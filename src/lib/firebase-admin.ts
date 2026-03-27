// src/lib/firebase-admin.ts

import * as admin from "firebase-admin";

const getServiceAccountFromJson = () => {
  const rawJson = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON;

  if (!rawJson) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawJson) as {
      project_id?: string;
      client_email?: string;
      private_key?: string;
    };

    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      return null;
    }

    return {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key.replace(/\\n/g, "\n"),
    };
  } catch {
    return null;
  }
};

const getFirebaseAdminOptions = () => {
  const jsonServiceAccount = getServiceAccountFromJson();
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (jsonServiceAccount) {
    return {
      credential: admin.credential.cert(jsonServiceAccount),
      projectId: jsonServiceAccount.projectId,
    };
  }

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
