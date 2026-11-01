import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ThemeConfig } from '@/types/theme';
import defaultTheme from '@/data/theme.json';

export const dynamic = 'force-dynamic';

const themePath = path.join(process.cwd(), 'src', 'data', 'theme.json');

import { getAdminAuth, getAdminFirestore } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const db = getAdminFirestore();
    if (!db) return NextResponse.json(defaultTheme);
    
    const docRef = db.collection('storefront').doc('theme');
    const docSnap = await docRef.get();
    
    let themeData: any;
    
    if (docSnap.exists) {
      themeData = docSnap.data();
    } else {
      // Auto-migrate from local JSON if it exists
      if (fs.existsSync(themePath)) {
        const localData = fs.readFileSync(themePath, 'utf-8');
        themeData = JSON.parse(localData);
      } else {
        themeData = { global: { colors: {} }, sections: [] };
      }
      await docRef.set(themeData);
    }
    
    return NextResponse.json(themeData);
  } catch (error) {
    console.error('Firestore GET error:', error);
    return NextResponse.json(defaultTheme);
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    
    const adminAuth = getAdminAuth();
    if (!adminAuth) {
      return NextResponse.json({ error: 'System configuration error: Admin Auth not available' }, { status: 500 });
    }

    try {
      await adminAuth.verifyIdToken(token);
    } catch (authError: any) {
      console.error('Firebase Auth Verification Failed', authError);
      const isMismatch = authError.message && authError.message.includes('audience');
      return NextResponse.json({ error: isMismatch ? 'Project ID Mismatch: Client and Server Firebase projects differ.' : 'Invalid or Expired Credentials' }, { status: 403 });
    }

    const body: ThemeConfig = await request.json();
    
    if (!body || typeof body !== 'object' || !Array.isArray(body.sections)) {
      return NextResponse.json({ error: 'Invalid theme payload structure' }, { status: 400 });
    }

    const db = getAdminFirestore();
    if (!db) return NextResponse.json({ error: 'Firestore unavailable' }, { status: 500 });

    await db.collection('storefront').doc('theme').set(body);
    
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error('Firestore PUT error:', error);
    return NextResponse.json({ error: 'Failed to save theme' }, { status: 500 });
  }
}
