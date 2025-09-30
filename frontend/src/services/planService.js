// frontend/src/services/planService.js
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function generatePlan({ objective, level, hoursPerWeek, weeks }) {
  const base = process.env.REACT_APP_API_BASE_URL || "http://localhost:5050";

  const resp = await fetch(`${base}/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ objective, level, hoursPerWeek, weeks }),
  });

  let data;
  try {
    data = await resp.json();
  } catch {
    throw new Error("El servidor no respondió con JSON válido.");
  }

  if (!resp.ok) {
    const msg = data?.error || "No se pudo generar el plan";
    throw new Error(msg);
  }

  return data.plan;
}

export async function saveStudyPlan(uid, plan) {
  const db = getFirestore();
  if (!db || !uid) return false;

  const ref = doc(db, `users/${uid}/studyPlan/main`);
  await setDoc(ref, { ...plan, updatedAt: serverTimestamp() }, { merge: true });
  return true;
}
