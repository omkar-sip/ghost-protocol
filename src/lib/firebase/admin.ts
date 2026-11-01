import * as admin from 'firebase-admin';

const hasAdminConfig = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY,
);

if (!admin.apps.length && hasAdminConfig) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handle escaped newlines in the private key string
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error);
  }
}

export const getAdminAuth = () => {
  try {
    return admin.auth();
  } catch (err) {
    console.error('Firebase Admin Auth not available', err);
    return null;
  }
};

export const getAdminFirestore = () => {
  try {
    return admin.firestore();
  } catch (err) {
    console.error('Firebase Admin Firestore not available', err);
    return null;
  }
};

export { admin };
export default admin;
