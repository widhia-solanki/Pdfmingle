// src/lib/firebase-admin.ts

import * as admin from "firebase-admin";

const getFirebaseAdminOptions = () => {
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    return {
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    };
  }

  return {
    credential: admin.credential.applicationDefault(),
    projectId,
  };
};

export const initializeFirebaseAdmin = () => {
  if (!admin.apps.length) {
    admin.initializeApp(getFirebaseAdminOptions());
  }

  return admin.app();
};

export const getAdminDb = () => initializeFirebaseAdmin().firestore();
