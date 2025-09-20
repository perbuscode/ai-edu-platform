// src/services/userProfile.js
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

function dbSafe() { try { return getFirestore(); } catch { return null; } }

export async function loadUserProfile(uid) {
  const db = dbSafe();
  if (!db || !uid) return null;
  const ref = doc(db, `users/${uid}`);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function saveUserProfile(uid, data) {
  const db = dbSafe();
  if (!db || !uid) return false;
  const ref = doc(db, `users/${uid}`);
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  return true;
}

