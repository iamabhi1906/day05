import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase/firestore';
import z from 'zod';

const firebaseAdminSecretSchema = z.object({
  projectId: z.string(),
  clientEmail: z.string(),
  privateKey: z.string().transform((key) => key.replace(/\\n/g, '\n')),
});

const firebaseAdminSecret = firebaseAdminSecretSchema.parse({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
});

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: firebaseAdminSecret.projectId,
      clientEmail: firebaseAdminSecret.clientEmail,
      privateKey: firebaseAdminSecret.privateKey,
    }),
  });
}

export const adminAuth = getAuth();