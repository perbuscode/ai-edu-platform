import { api } from "./http";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const getMetrics = () => api("/api/metrics");
export const getCourses = () => api("/api/courses");
export const getSkillsMap = () => api("/api/skills-map");

export async function getStudyPlan() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return null;

  const db = getFirestore();
  const ref = doc(db, `users/${user.uid}/studyPlan/main`);
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data() : null;
}
