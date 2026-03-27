import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const contentPath = path.join(process.cwd(), 'src', 'data', 'content.json');

import { getAdminFirestore } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const db = getAdminFirestore();
    if (!db) return NextResponse.json({ error: 'Firestore unavailable' }, { status: 500 });
    
    const docRef = db.collection('storefront').doc('content');
    const docSnap = await docRef.get();
    
    let contentData: any;
    
    if (docSnap.exists) {
      contentData = docSnap.data();
    } else {
      if (fs.existsSync(contentPath)) {
        const localData = fs.readFileSync(contentPath, 'utf-8');
        contentData = JSON.parse(localData);
      } else {
        contentData = {};
      }
      await docRef.set(contentData);
    }
    
    return NextResponse.json(contentData);
  } catch (error) {
    console.error('Firestore GET content error:', error);
    return NextResponse.json({ error: 'Failed to read content data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
    }

    const db = getAdminFirestore();
    if (!db) return NextResponse.json({ error: 'Firestore unavailable' }, { status: 500 });

    await db.collection('storefront').doc('content').set(body);

    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error('Firestore PUT content error:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
