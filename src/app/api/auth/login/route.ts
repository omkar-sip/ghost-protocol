import { NextResponse } from 'next/server';
import { authenticate, clientAddress, isRateLimited, makeSession, setSessionCookie } from '@/lib/auth/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const address = clientAddress(request);
  if (isRateLimited(`login:${address}`)) {
    return NextResponse.json({ error: 'Too many login attempts. Try again later.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!authenticate(email, password)) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    await setSessionCookie(makeSession(email));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
