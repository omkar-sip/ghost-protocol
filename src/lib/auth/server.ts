import crypto from 'node:crypto';
import { cookies } from 'next/headers';

export const ADMIN_EMAILS = [
  'podcraftindia@gmail.com',
  'omkarshirvalkar@gmail.com',
  'swayamuk1@gmail.com',
] as const;

const SESSION_COOKIE = 'ghost_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function secret() {
  const value = process.env.AUTH_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error('AUTH_SESSION_SECRET must be at least 32 characters long');
  }
  return value;
}

function passwordHashEnv(email: string) {
  const key = normalizeEmail(email).split('@')[0].replace(/[^a-z0-9]/g, '_').toUpperCase();
  return process.env[`ADMIN_PASSWORD_HASH_${key}`];
}

function safeEqual(left: Buffer, right: Buffer) {
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

/** Verify scrypt$base64url-salt$base64url-derived-key values only. */
function verifyPassword(password: string, storedHash: string | undefined) {
  if (!storedHash?.startsWith('scrypt$')) return false;
  const [, salt, expected] = storedHash.split('$');
  if (!salt || !expected) return false;

  try {
    const derived = crypto.scryptSync(password, Buffer.from(salt, 'base64url'), 64);
    return safeEqual(derived, Buffer.from(expected, 'base64url'));
  } catch {
    return false;
  }
}

function sign(value: string) {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url');
}

function makeSession(email: string) {
  const payload = Buffer.from(JSON.stringify({
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    nonce: crypto.randomBytes(16).toString('base64url'),
  })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function readSession(value: string | undefined) {
  if (!value) return null;
  const [payload, signature] = value.split('.');
  if (!payload || !signature || !safeEqual(Buffer.from(signature), Buffer.from(sign(payload)))) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { email?: string; exp?: number };
    const email = normalizeEmail(data.email || '');
    if (!ADMIN_EMAILS.includes(email as (typeof ADMIN_EMAILS)[number]) || !data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
    return { email };
  } catch {
    return null;
  }
}

export function clientAddress(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export function isRateLimited(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_ATTEMPTS;
}

export function authenticate(email: string, password: string) {
  const normalized = normalizeEmail(email);
  if (!ADMIN_EMAILS.includes(normalized as (typeof ADMIN_EMAILS)[number])) return false;
  return verifyPassword(password, passwordHashEnv(normalized));
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function setSessionCookie(value: string) {
  return cookies().then((store) => store.set(SESSION_COOKIE, value, sessionCookieOptions()));
}

export function clearSessionCookie() {
  return cookies().then((store) => store.set(SESSION_COOKIE, '', { ...sessionCookieOptions(), maxAge: 0 }));
}

export async function getSession() {
  const store = await cookies();
  return readSession(store.get(SESSION_COOKIE)?.value);
}

export function getSessionFromRequest(request: Request) {
  const header = request.headers.get('cookie') || '';
  const value = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
  return readSession(value);
}

export { makeSession };
