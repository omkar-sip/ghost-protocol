import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getSessionFromRequest } from '@/lib/auth/server';

export const dynamic = 'force-dynamic';
const contentPath = path.join(process.cwd(), 'src', 'data', 'content.json');

export async function GET() {
  try {
    return NextResponse.json(JSON.parse(await fs.readFile(contentPath, 'utf8')));
  } catch {
    return NextResponse.json({ error: 'Content data unavailable' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!getSessionFromRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
    await fs.writeFile(contentPath, `${JSON.stringify(body, null, 2)}\n`, 'utf8');
    return NextResponse.json({ success: true, data: body });
  } catch {
    return NextResponse.json({ error: 'Content persistence is unavailable in this deployment.' }, { status: 503 });
  }
}
