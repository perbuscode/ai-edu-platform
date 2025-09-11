// src/services/progress.js
import { getFirestore, doc, setDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

function dbSafe() { try { return getFirestore(); } catch { return null; } }

export async function saveLessonProgress({ uid, courseId, lessonId, data }) {
  const db = dbSafe();
  if (!db || !uid) return false;
  const ref = doc(db, `users/${uid}/courses/${courseId}/lessons/${lessonId}`);
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  return true;
}

export async function loadLessonProgress({ uid, courseId, lessonId }) {
  const db = dbSafe();
  if (!db || !uid) return null;
  const ref = doc(db, `users/${uid}/courses/${courseId}/lessons/${lessonId}`);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export function subscribeLessonProgress({ uid, courseId, lessonId, onChange }) {
  const db = dbSafe();
  if (!db || !uid) return () => {};
  const ref = doc(db, `users/${uid}/courses/${courseId}/lessons/${lessonId}`);
  return onSnapshot(ref, (snap) => onChange(snap.exists() ? snap.data() : null));
}

export async function saveNotes({ uid, lessonId, text }) {
  const db = dbSafe();
  if (!db || !uid) return false;
  const ref = doc(db, `users/${uid}/notes/${lessonId}`);
  await setDoc(ref, { text, updatedAt: serverTimestamp() }, { merge: true });
  return true;
}

export async function loadNotes({ uid, lessonId }) {
  const db = dbSafe();
  if (!db || !uid) return '';
  const ref = doc(db, `users/${uid}/notes/${lessonId}`);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data()?.text || '') : '';
}

