import { getFirestoreSafe } from "./firebaseAdmin.js";

const fallbackMetrics = {
  streak: 3,
  hours: 2.5,
  lessons: 7,
  projects: 2,
};

const fallbackCourses = [
  {
    id: "frontend",
    title: "Desarrollo Web Frontend",
    description: "HTML, CSS, React y patrones.",
    progress: 68,
  },
  {
    id: "powerbi",
    title: "Master Power BI",
    description: "ETL, modelado, DAX y storytelling.",
    progress: 25,
  },
];

const fallbackSkills = {
  levels: [
    {
      id: "dax",
      name: "DAX",
      levelText: "Nivel 3/5",
      percent: "60%",
      badge: { label: "Subiendo", bg: "bg-emerald-100", text: "text-emerald-800" },
    },
    {
      id: "etl",
      name: "ETL / Power Query",
      levelText: "Nivel 2/5",
      percent: "40%",
      badge: { label: "Estable", bg: "bg-slate-100", text: "text-slate-800" },
    },
    {
      id: "modelado",
      name: "Modelado",
      levelText: "Nivel 2/5",
      percent: "35%",
      badge: { label: "Subiendo", bg: "bg-emerald-100", text: "text-emerald-800" },
    },
    {
      id: "storytelling",
      name: "Storytelling",
      levelText: "Nivel 3/5",
      percent: "60%",
      badge: { label: "Bajando", bg: "bg-amber-100", text: "text-amber-800" },
    },
    {
      id: "sql",
      name: "SQL",
      levelText: "Nivel 2/5",
      percent: "40%",
      badge: { label: "Estable", bg: "bg-slate-100", text: "text-slate-800" },
    },
    {
      id: "ingles",
      name: "Inglés B2",
      levelText: "Nivel 2/5",
      percent: "40%",
      badge: { label: "Estable", bg: "bg-slate-100", text: "text-slate-800" },
    },
  ],
};

async function readDashboardDoc(docId) {
  const db = getFirestoreSafe();
  if (!db) return null;
  try {
    const snap = await db.collection("dashboard").doc(docId).get();
    if (!snap.exists) return null;
    return snap.data();
  } catch (error) {
    console.warn(`[dashboard] Firestore read ${docId} failed:`, error?.message || error);
    return null;
  }
}

export async function getMetricsData() {
  const data = await readDashboardDoc("metrics");
  return data ? { ...fallbackMetrics, ...data } : fallbackMetrics;
}

export async function getCoursesData() {
  const data = await readDashboardDoc("courses");
  return Array.isArray(data?.courses) ? data.courses : fallbackCourses;
}

export async function getSkillsMapData() {
  const data = await readDashboardDoc("skillsMap");
  return Array.isArray(data?.levels) ? { levels: data.levels } : fallbackSkills;
}
