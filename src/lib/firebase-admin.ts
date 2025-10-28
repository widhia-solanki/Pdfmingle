// src/lib/firebase-admin.ts

import * as admin from 'firebase-admin';

export const initializeFirebaseAdmin = () => {
  if (!admin.apps.length) {
    // Vercel automatically provides the GOOGLE_APPLICATION_CREDENTIALS
    // when you connect your project to a Google Cloud service account.
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
};
