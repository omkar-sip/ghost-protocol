// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const hasClientConfig = Object.values(firebaseConfig).every(
  (value) => typeof value === 'string' && value.length > 0,
);

// Vercel builds can run without the runtime Firebase variables. Do not call
// initializeApp/getAuth with undefined values: that makes static generation
// fail with auth/invalid-api-key. Authentication is enabled when the variables
// are present in the deployment environment.
export const auth: Auth | null = hasClientConfig
  ? getAuth(!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;

export default getApps()[0] ?? null;
