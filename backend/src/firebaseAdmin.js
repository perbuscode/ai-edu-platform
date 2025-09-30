import admin from "firebase-admin";

let app;
export function initFirebaseAdmin() {
  if (app) return app;
  // Try GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT
  if (admin.apps.length > 0) {
    app = admin.app();
    return app;
  }

  try {
    const credential = process.env.FIREBASE_SERVICE_ACCOUNT
      ? admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
      : admin.credential.applicationDefault();

    admin.initializeApp({ credential });
  } catch (e) {
    console.warn("[firebase-admin] No se pudo inicializar con credenciales: ", e?.message || e);
  }

  app = admin.app();
  return app;
}

export function getFirestoreSafe() {
  initFirebaseAdmin();
  try {
    return admin.firestore();
  } catch (e) {
    console.warn("[firebase-admin] Firestore no disponible: ", e?.message || e);
    return null;
  }
}

export async function verifyIdTokenOptional(bearer) {
  initFirebaseAdmin();
  if (!bearer) return null;
  const token = String(bearer).startsWith("Bearer ") ? String(bearer).slice(7) : bearer;
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded; // { uid, ... }
  } catch {
    return null;
  }
}
