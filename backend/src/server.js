// backend/src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

// --- CORS ---
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

// --- Health + diag ---
app.get("/healthz", (_req, res) => res.status(200).send("ok"));
app.get("/__diag", (_req, res) => {
  res.json({
    mode: process.env.MOCK_PLAN === "1" ? "MOCK" : "AI",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  });
});
app.get("/", (_req, res) => {
  res.status(200).json({ ok: true, name: "ai-edu-backend", health: "/healthz" });
});

// --- Helpers JSON ---
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

// --- Enriquecimiento y compatibilidad ---
function ensureArray(x) { return Array.isArray(x) ? x : []; }
function toNumber(x, def = 0) { const n = Number(x); return Number.isFinite(n) ? n : def; }

/**
 * Si llega el "esquema rico", derivamos weeksPlan para compatibilidad.
 * Si llega el "esquema simple", lo enriquecemos con defaults.
 */
function unifyPlanShape(raw) {
  if (!raw || typeof raw !== "object") {
    return { error: "payload no es un objeto" };
  }

  // Detecta si es "rico" (blocks/summary/skills/salary)
  const isRich =
    "blocks" in raw ||
    "summary" in raw ||
    "skills" in raw ||
    "salary" in raw ||
    "roles" in raw ||
    "rubric" in raw;

  if (isRich) {
    const rich = {
      title: typeof raw.title === "string" ? raw.title : `Plan: ${raw.objective || "Objetivo"}`,
      goal: typeof raw.goal === "string" ? raw.goal : (raw.objective || "Objetivo"),
      level: typeof raw.level === "string" ? raw.level : "No especificado",
      hoursPerWeek: toNumber(raw.hoursPerWeek, 6),
      durationWeeks: toNumber(raw.durationWeeks ?? raw.weeks, 4),
      blocks: ensureArray(raw.blocks).map((b, i) => ({
        title: typeof b.title === "string" ? b.title : `Bloque ${i + 1}`,
        bullets: ensureArray(b.bullets),
        project: typeof b.project === "string" ? b.project : "",
        role: typeof b.role === "string" ? b.role : "",
        lessonHours: ensureArray(b.lessonHours).map(v => toNumber(v, 0)),
        projectHours: toNumber(b.projectHours, 0),
      })),
      rubric: ensureArray(raw.rubric),
      skills: ensureArray(raw.skills),
      roles: ensureArray(raw.roles),
      salary: ensureArray(raw.salary),
      summary: typeof raw.summary === "string"
        ? raw.summary
        : `Plan de ${toNumber(raw.durationWeeks ?? raw.weeks, 4)} semanas a ${toNumber(raw.hoursPerWeek, 6)} h/semana.`,
    };

    // Deriva weeksPlan para compat con UI antigua
    const weeksPlan = rich.blocks.map((blk, idx) => ({
      week: idx + 1,
      goals: ensureArray(blk.bullets),
      resources: [], // el modelo puede no proveer, queda listo para futuro
      tasks: [],     // idem
    }));

    return {
      objective: rich.goal,
      level: rich.level,
      hoursPerWeek: rich.hoursPerWeek,
      weeks: rich.durationWeeks,
      weeksPlan,
      // Conserva todo lo rico:
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

  // Esquema simple -> enriquecer con defaults
  const simple = {
    objective: raw.objective || "Objetivo",
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

  // Genera un rico mínimo desde el simple (para UI nueva)
  const blocks = simple.weeksPlan.map((w) => ({
    title: `Semana ${w.week}`,
    bullets: ensureArray(w.goals),
    project: "",
    role: "",
    lessonHours: new Array(ensureArray(w.goals).length).fill(0),
    projectHours: 0,
  }));

  return {
    ...simple,
    title: `Plan: ${simple.objective}`,
    goal: simple.objective,
    durationWeeks: simple.weeks,
    blocks,
    rubric: [],
    skills: [],
    roles: [],
    salary: [],
    summary: `Plan de ${simple.weeks} semanas a ${simple.hoursPerWeek} h/semana.`,
  };
}

// --- Proveedor IA (Gemini 2.5 con @google/generative-ai) ---
async function callAIProviderRich(input) {
  if (process.env.MOCK_PLAN === "1") {
    // Mock enriquecido
    const weeks = toNumber(input?.weeks, 4);
    const hoursPerWeek = toNumber(input?.hoursPerWeek, 6);
    const blocks = Array.from({ length: weeks }, (_, i) => ({
      title: `Semana ${i + 1}`,
      bullets: i === 0
        ? ["Fundamentos del tema", "Instalación y setup", "Primeros ejercicios"]
        : ["Práctica guiada", "Ejercicios aplicados", "Pequeño reto"],
      project: i === weeks - 1 ? "Proyecto integrador" : "",
      role: i === weeks - 1 ? "Presentación final" : "",
      lessonHours: [2, 2, 2],
      projectHours: i === weeks - 1 ? 4 : 0,
    }));
    return JSON.stringify({
      title: `Plan: ${input?.objective || "Objetivo"}`,
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

  // Pedimos explícitamente el ESQUEMA RICO
  const prompt = `
Eres un planificador educativo experto.
Devuelve **EXCLUSIVAMENTE JSON válido** (sin texto extra, sin markdown), con este esquema:

{
  "title": string,
  "goal": string,
  "level": string,
  "hoursPerWeek": number,
  "durationWeeks": number,
  "blocks": [
    {
      "title": string,
      "bullets": string[],
      "project": string,
      "role": string,
      "lessonHours": number[],
      "projectHours": number
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
  "summary": string
}

/*
Reglas de horas:
- Total aproximado ≈ hoursPerWeek * durationWeeks.
- "lessonHours.length" === "bullets.length".
- "projectHours" = 0 si no hay "project".
- Usa números con 1 decimal como máximo cuando sea necesario (ej. 1.5).
*/

Datos del usuario:
- objective: ${input?.objective}
- level: ${input?.level}
- hoursPerWeek: ${input?.hoursPerWeek}
- weeks: ${input?.weeks}

Entrega SOLO el JSON.`;

  try {
    const model = genAI.getGenerativeModel({ model: modelId });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }]}],
      generationConfig: {
        responseMimeType: "application/json",
        temperature,
        // maxOutputTokens opcional según tu cuenta; si quieres:
        // maxOutputTokens: 2200,
      },
    });

    const text = result?.response?.text?.() ?? "";
    if (!text) throw new Error("Gemini devolvió respuesta vacía");
    return text;
  } catch (err) {
    return JSON.stringify({ _providerError: `Gemini error: ${err?.message || String(err)}` });
  }
}

// --- Endpoint /plan ---
app.post("/plan", async (req, res) => {
  try {
    const { objective, level, hoursPerWeek, weeks } = req.body || {};
    if (!objective) return res.status(400).json({ error: "objective es requerido" });
    const hpw = Number(hoursPerWeek), wks = Number(weeks);
    if (!Number.isFinite(hpw) || hpw <= 0) return res.status(400).json({ error: "hoursPerWeek debe ser número > 0" });
    if (!Number.isFinite(wks) || wks <= 0) return res.status(400).json({ error: "weeks debe ser número > 0" });

    // 1) Llamamos al proveedor pidiendo el esquema RICO
    const aiRawText = await callAIProviderRich({ objective, level, hoursPerWeek: hpw, weeks: wks });

    // 2) Normalizamos/parseamos
    const { data, error, source, raw } = normalizeAIJSON(aiRawText);
    if (error) {
      return res.status(502).json({ error: "AI invalid JSON", detail: error, sample: raw?.slice(0, 4000) || null });
    }

    // 3) Unificamos shape: si es rico, derivamos weeksPlan; si es simple, enriquecemos
    const unified = unifyPlanShape(data);

    return res.status(200).json({ ...unified, _source: source });
  } catch (err) {
    console.error("[/plan] Uncaught error:", err);
    return res.status(500).json({ error: "Internal error generating plan" });
  }
});

// --- Errores y 404 ---
app.use((err, _req, res, next) => {
  if (err && /CORS bloqueado/.test(String(err.message))) {
    return res.status(403).json({ error: "CORS origin no permitido" });
  }
  return next(err);
});
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// --- Listen / Shutdown ---
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
