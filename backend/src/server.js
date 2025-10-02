import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

/* --------------------------- CORS --------------------------- */
const allowedOrigins = new Set([
  "https://edvanceia.netlify.app",
  "https://edvanceia.com",
  "https://www.edvanceia.com",
  "http://localhost:8888",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
]);
const corsOptions = {
  origin(origin, cb) {
    if (!origin || allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error(`CORS bloqueado para origen: ${origin}`));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

/* ---------------------- Health + Diag ----------------------- */
app.get("/healthz", (_req, res) => res.status(200).send("ok"));
app.get("/__diag", (_req, res) =>
  res.json({
    mode: process.env.MOCK_PLAN === "1" ? "MOCK" : "AI",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  }),
);
app.get("/", (_req, res) =>
  res.status(200).json({ ok: true, name: "ai-edu-backend", health: "/healthz" }),
);

/* ---------------------- JSON helpers ------------------------ */
function safeParseJSON(text) { try { return [JSON.parse(text), null]; } catch (e) { return [null, e]; } }
function extractJsonFence(text) {
  if (!text) return null;
  const m = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/i);
  return m ? m[1].trim() : null;
}
function sliceFirstCurlyToLastCurly(text) {
  const first = text.indexOf("{"); const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return null;
  return text.slice(first, last + 1).trim();
}
function gentleRepairs(text) {
  if (!text) return text;
  let out = text.trim();
  out = out.replace(/^\uFEFF/, "");
  out = out.replace(/'(\w+?)'\s*:/g, '"$1":');
  out = out.replace(/:\s*'([^']*)'/g, ': "$1"');
  out = out.replace(/,\s*([}\]])/g, "$1");
  return out;
}
function normalizeAIJSON(rawText) {
  if (!rawText || typeof rawText !== "string") return { error: "AI devolvió cuerpo vacío o no-string" };
  { const [d] = safeParseJSON(rawText); if (d) return { data: d, source: "direct" }; }
  const fenced = extractJsonFence(rawText);
  if (fenced) {
    const [d1] = safeParseJSON(fenced); if (d1) return { data: d1, source: "fence" };
    const [d2] = safeParseJSON(gentleRepairs(fenced)); if (d2) return { data: d2, source: "fence+repair" };
  }
  const sliced = sliceFirstCurlyToLastCurly(rawText);
  if (sliced) {
    const [d3] = safeParseJSON(sliced); if (d3) return { data: d3, source: "sliced" };
    const [d4] = safeParseJSON(gentleRepairs(sliced)); if (d4) return { data: d4, source: "sliced+repair" };
  }
  const [d5] = safeParseJSON(gentleRepairs(rawText)); if (d5) return { data: d5, source: "repair" };
  return { error: "No se pudo convertir la respuesta de la IA en JSON.", raw: rawText };
}

/* --------------- Enriquecimiento & compat ------------------- */
function ensureArray(x) { return Array.isArray(x) ? x : []; }
function toNumber(x, def = 0) { const n = Number(x); return Number.isFinite(n) ? n : def; }

/** Esquema unificado: si viene rico, derivamos weeksPlan; si viene simple, enriquecemos. */
function unifyPlanShape(raw) {
  if (!raw || typeof raw !== "object") return { error: "payload no es un objeto" };

  const goal = raw.goal || raw.objective || "Objetivo";
  const isRich =
    "blocks" in raw || "summary" in raw || "skills" in raw ||
    "salary" in raw || "roles" in raw || "rubric" in raw;

  if (isRich) {
    // title: si falta o es igual al goal, usamos una variante breve sin prefijo "Plan:"
    let title = typeof raw.title === "string" && raw.title.trim() ? raw.title.trim() : goal;
    if (title.trim().toLowerCase() === String(goal).trim().toLowerCase()) {
      title = goal;
    }

    const rich = {
      title,
      goal,
      level: typeof raw.level === "string" ? raw.level : "No especificado",
      hoursPerWeek: toNumber(raw.hoursPerWeek, 6),
      durationWeeks: toNumber(raw.durationWeeks ?? raw.weeks, 4),
      blocks: ensureArray(raw.blocks).map((b, i) => ({
        title: typeof b?.title === "string" && b.title.trim() ? b.title : `Módulo ${i + 1}`,
        bullets: ensureArray(b?.bullets),
        project: typeof b?.project === "string" ? b.project : "",
        role: typeof b?.role === "string" ? b.role : "",
        lessonHours: ensureArray(b?.lessonHours).map(v => toNumber(v, 0)),
        projectHours: toNumber(b?.projectHours, 0),
      })),
      rubric: ensureArray(raw.rubric),
      skills: ensureArray(raw.skills),
      roles: ensureArray(raw.roles),
      salary: ensureArray(raw.salary),
      summary: typeof raw.summary === "string" && raw.summary.trim()
        ? raw.summary.trim()
        : `Plan de ${toNumber(raw.durationWeeks ?? raw.weeks, 4)} semanas a ${toNumber(raw.hoursPerWeek, 6)} h/semana para lograr: ${goal}.`,
    };

    // Alinear lessonHours con bullets
    for (const blk of rich.blocks) {
      if (blk.lessonHours.length !== blk.bullets.length) {
        blk.lessonHours = blk.bullets.map((_, i) => toNumber(blk.lessonHours[i], 0));
      }
      if (!blk.project) blk.projectHours = 0;
    }

    const weeksPlan = rich.blocks.map((blk, idx) => ({
      week: idx + 1,
      goals: ensureArray(blk.bullets),
      resources: [],
      tasks: [],
    }));

    return {
      objective: rich.goal,
      level: rich.level,
      hoursPerWeek: rich.hoursPerWeek,
      weeks: rich.durationWeeks,
      weeksPlan,
      // conservar shape rico:
      title: rich.title,
      goal: rich.goal,
      durationWeeks: rich.durationWeeks,
      blocks: rich.blocks,
      rubric: rich.rubric,
      skills: rich.skills,
      roles: rich.roles,
      salary: rich.salary,
      summary: rich.summary,
    };
  }

  // Simple -> enriquecer
  const simple = {
    objective: goal,
    level: raw.level || "No especificado",
    hoursPerWeek: toNumber(raw.hoursPerWeek, 6),
    weeks: toNumber(raw.weeks ?? raw.durationWeeks, 4),
    weeksPlan: ensureArray(raw.weeksPlan).map((w, i) => ({
      week: toNumber(w.week, i + 1),
      goals: ensureArray(w.goals),
      resources: ensureArray(w.resources),
      tasks: ensureArray(w.tasks),
    })),
  };

  const blocks = simple.weeksPlan.map((w) => ({
    title: `Semana ${w.week}`,
    bullets: ensureArray(w.goals),
    project: "", // si el backend (IA) no lo envió, queda vacío
    role: "",
    lessonHours: new Array(ensureArray(w.goals).length).fill(0),
    projectHours: 0,
  }));

  return {
    ...simple,
    title: goal,
    goal,
    durationWeeks: simple.weeks,
    blocks,
    rubric: [],
    skills: [],
    roles: [],
    salary: [],
    summary: `Plan de ${simple.weeks} semanas a ${simple.hoursPerWeek} h/semana para lograr: ${goal}.`,
  };
}

/* -------------------- Proveedor IA (Gemini) ------------------ */
async function callAIProviderRich(input) {
  if (process.env.MOCK_PLAN === "1") {
    const weeks = toNumber(input?.weeks, 4);
    const hoursPerWeek = toNumber(input?.hoursPerWeek, 6);
    const blocks = Array.from({ length: weeks }, (_, i) => ({
      title: `Módulo ${i + 1}`,
      bullets:
        i === 0
          ? ["Fundamentos del tema", "Instalación y setup", "Primeros ejercicios"]
          : ["Práctica guiada", "Ejercicios aplicados", "Pequeño reto"],
      project: "Proyecto aplicado del módulo",
      role: "Rol simulado",
      lessonHours: [2, 1.5, 2.5],
      projectHours: 3,
    }));
    return JSON.stringify({
      title: input?.objective || "Plan",
      goal: input?.objective || "Objetivo",
      level: input?.level || "No especificado",
      hoursPerWeek,
      durationWeeks: weeks,
      blocks,
      rubric: [
        { criterion: "Cumple objetivos semanales", level: "Básico/Intermedio/Avanzado" },
        { criterion: "Entrega de proyecto", level: "A tiempo y con calidad" },
      ],
      skills: ["Organización", "Pensamiento crítico", "Autonomía"],
      roles: ["Jr. Trainee", "Jr. Assistant"],
      salary: [
        { role: "Jr. Assistant", currency: "USD", min: 700, max: 1200, period: "month", region: "LatAm (referencial)" },
      ],
      summary: `Plan de ${weeks} semanas a ${hoursPerWeek} h/semana para lograr: ${input?.objective || "tu meta"}.`,
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return JSON.stringify({ _providerError: "GEMINI_API_KEY no está configurada" });

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelId = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const temperature = Number(process.env.GEMINI_TEMPERATURE) || 0.2;

  const prompt = `
Eres un planificador educativo. Devuelve **EXCLUSIVAMENTE JSON válido** (sin texto extra, sin markdown), con este esquema y reglas:

{
  "title": string,           // título corto y marketeable (NO repitas exactamente el objetivo)
  "goal": string,            // objetivo del plan (puede ser más detallado que el title)
  "level": string,           // p.ej. "Inicial", "Intermedio", "Avanzado"
  "hoursPerWeek": number,    // horas por semana (número)
  "durationWeeks": number,   // semanas totales (número)
  "blocks": [
    {
      "title": string,       // nombre del módulo/semana
      "bullets": string[],   // temas/competencias del módulo
      "project": string,     // SIEMPRE incluir un proyecto práctico no vacío
      "role": string,        // rol simulado o contexto del proyecto
      "lessonHours": number[],// MISMA longitud que bullets. Deben VARIAR, no todas iguales. Rango típico 0.5–4.0
      "projectHours": number // horas del proyecto (>= 1 si hay proyecto)
    }
  ],
  "rubric": [
    { "criterion": string, "level": string }
  ],
  "skills": string[],
  "roles": string[],
  "salary": [
    { "role": string, "currency": "USD", "min": number, "max": number, "period": "month" | "year", "region": string }
  ],
  "summary": string          // resumen claro y distinto del goal
}

/* Reglas de coherencia:
- Sumatoria aproximada: (sum(lessonHours) + sum(projectHours por módulo)) ≈ hoursPerWeek * durationWeeks (±20%).
- "lessonHours.length" === "bullets.length" en TODOS los módulos.
- "project" debe ser no vacío en TODOS los módulos; si no aplica, justificar y poner projectHours = 0.
- Usa valores de horas con 0 o 1 decimal.
- Español neutro.
*/

Datos del usuario:
- objective: ${input?.objective}
- level: ${input?.level}
- hoursPerWeek: ${input?.hoursPerWeek}
- weeks: ${input?.weeks}

Entrega SOLO el JSON.`.trim();

  try {
    const model = genAI.getGenerativeModel({ model: modelId });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }]}],
      generationConfig: {
        responseMimeType: "application/json",
        temperature
      },
    });
    const text = result?.response?.text?.() ?? "";
    if (!text) throw new Error("Gemini devolvió respuesta vacía");
    return text;
  } catch (err) {
    return JSON.stringify({ _providerError: `Gemini error: ${err?.message || String(err)}` });
  }
}

/* --------------------------- /plan --------------------------- */
app.post("/plan", async (req, res) => {
  try {
    const { objective, level, hoursPerWeek, weeks } = req.body || {};
    if (!objective) return res.status(400).json({ error: "objective es requerido" });
    const hpw = Number(hoursPerWeek), wks = Number(weeks);
    if (!Number.isFinite(hpw) || hpw <= 0) return res.status(400).json({ error: "hoursPerWeek debe ser número > 0" });
    if (!Number.isFinite(wks) || wks <= 0) return res.status(400).json({ error: "weeks debe ser número > 0" });

    const aiRawText = await callAIProviderRich({ objective, level, hoursPerWeek: hpw, weeks: wks });

    const { data, error, source, raw } = normalizeAIJSON(aiRawText);
    if (error) {
      return res.status(502).json({ error: "AI invalid JSON", detail: error, sample: raw?.slice(0, 4000) || null });
    }

    const unified = unifyPlanShape(data);
    return res.status(200).json({ ...unified, _source: source });
  } catch (err) {
    console.error("[/plan] Uncaught error:", err);
    return res.status(500).json({ error: "Internal error generating plan" });
  }
});

/* ---------------------- Errores / 404 ------------------------ */
app.use((err, _req, res, next) => {
  if (err && /CORS bloqueado/.test(String(err.message))) {
    return res.status(403).json({ error: "CORS origin no permitido" });
  }
  return next(err);
});
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

/* ------------------------- Listen ---------------------------- */
const PORT = process.env.PORT || 5050;
const HOST = "0.0.0.0";
const server = app.listen(PORT, HOST, () => {
  console.log(`[boot] NODE_ENV=${process.env.NODE_ENV || "development"}`);
  console.log(`[boot] MODE=${process.env.MOCK_PLAN === "1" ? "MOCK" : "AI"}`);
  console.log(`[boot] Listening on http://${HOST}:${PORT}`);
  console.log("[boot] Health check at GET /healthz -> 200 ok");
});
function shutdown(signal) {
  console.log(`[boot] Received ${signal}. Closing server...`);
  server.close(() => { console.log("[boot] Server closed. Bye!"); process.exit(0); });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export default app;
