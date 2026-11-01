import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ThemeConfig } from '@/types/theme';
import { getSessionFromRequest } from '@/lib/auth/server';
import defaultTheme from '@/data/theme.json';

export const dynamic = 'force-dynamic';
const themePath = path.join(process.cwd(), 'src', 'data', 'theme.json');

export async function GET() {
  try {
    return NextResponse.json(JSON.parse(await fs.readFile(themePath, 'utf8')));
  } catch {
    return NextResponse.json(defaultTheme);
  }
}

export async function PUT(request: Request) {
  if (!getSessionFromRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body: ThemeConfig = await request.json();
    if (!body || typeof body !== 'object' || !Array.isArray(body.sections)) return NextResponse.json({ error: 'Invalid theme payload structure' }, { status: 400 });
    await fs.writeFile(themePath, `${JSON.stringify(body, null, 2)}\n`, 'utf8');
    return NextResponse.json({ success: true, data: body });
  } catch {
    return NextResponse.json({ error: 'Theme persistence is unavailable in this deployment.' }, { status: 503 });
  }
}
