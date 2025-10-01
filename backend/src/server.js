// backend/src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/genai";

// ==========================
// App base y configuración
// ==========================
const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

// ==========================
// CORS (ajusta tus dominios)
// ==========================
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

// ==========================
// Health
// ==========================
app.get("/healthz", (_req, res) => res.status(200).send("ok"));
app.get("/", (_req, res) => {
  res.status(200).json({ ok: true, name: "ai-edu-backend", health: "/healthz" });
});

// ==========================
// Utils de normalización JSON
// ==========================
function safeParseJSON(text) {
  try {
    return [JSON.parse(text), null];
  } catch (e) {
    return [null, e];
  }
}

function extractJsonFence(text) {
  if (!text) return null;
  const m =
    text.match(/```json\s*([\s\S]*?)```/i) ||
    text.match(/```\s*([\s\S]*?)```/i);
  return m ? m[1].trim() : null;
}

function sliceFirstCurlyToLastCurly(text) {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
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

function validatePlanShape(obj) {
  if (!obj || typeof obj !== "object") return "payload no es un objeto";
  const must = ["objective", "weeks", "hoursPerWeek", "weeksPlan"];
  for (const k of must) {
    if (!(k in obj)) return `falta propiedad requerida: ${k}`;
  }
  if (!Array.isArray(obj.weeksPlan)) return "weeksPlan debe ser un arreglo";
  return null;
}

function normalizeAIJSON(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return { error: "AI devolvió cuerpo vacío o no-string" };
  }

  {
    const [dataDirect] = safeParseJSON(rawText);
    if (dataDirect) return { data: dataDirect, source: "direct" };
  }

  const fenced = extractJsonFence(rawText);
  if (fenced) {
    const [d1] = safeParseJSON(fenced);
    if (d1) return { data: d1, source: "fence" };
    const repairedFence = gentleRepairs(fenced);
    const [d2] = safeParseJSON(repairedFence);
    if (d2) return { data: d2, source: "fence+repair" };
  }

  const sliced = sliceFirstCurlyToLastCurly(rawText);
  if (sliced) {
    const [d3] = safeParseJSON(sliced);
    if (d3) return { data: d3, source: "sliced" };
    const repairedSliced = gentleRepairs(sliced);
    const [d4] = safeParseJSON(repairedSliced);
    if (d4) return { data: d4, source: "sliced+repair" };
  }

  const repaired = gentleRepairs(rawText);
  const [d5] = safeParseJSON(repaired);
  if (d5) return { data: d5, source: "repair" };

  return { error: "No se pudo convertir la respuesta de la IA en JSON.", raw: rawText };
}

// ==========================
// Proveedor IA (Gemini 2.5)
// ==========================
async function callAIProvider(input) {
  if (process.env.MOCK_PLAN === "1") {
    return JSON.stringify({
      objective: input?.objective ?? "Objetivo",
      level: input?.level ?? "No especificado",
      hoursPerWeek: input?.hoursPerWeek ?? 6,
      weeks: input?.weeks ?? 4,
      weeksPlan: Array.from({ length: input?.weeks ?? 4 }, (_, i) => ({
        week: i + 1,
        goals: i === 0 ? ["Fundamentos"] : ["Profundización"],
        resources: [],
        tasks: [],
      })),
      _source: "mock",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return JSON.stringify({ _providerError: "GEMINI_API_KEY no está configurada" });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelId = "gemini-2.5-flash";

  const schemaHint = `
Devuelve **solo JSON válido** sin texto extra. Esquema:
{
  "objective": string,
  "level": string,
  "hoursPerWeek": number,
  "weeks": number,
  "weeksPlan": [
    { "week": number, "goals": string[], "resources": any[], "tasks": any[] }
  ]
}
  `.trim();

  const userPrompt = `
Genera un plan de estudio según este input (responde en español neutro):
${JSON.stringify(input, null, 2)}

${schemaHint}
`.trim();

  try {
    const model = genAI.getGenerativeModel({ model: modelId });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }]}],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const text = result?.response?.text?.() ?? "";
    if (!text) throw new Error("Gemini devolvió respuesta vacía");
    return text;
  } catch (err) {
    return JSON.stringify({
      _providerError: `Gemini error: ${err?.message || String(err)}`,
    });
  }
}

// ==========================
// Endpoint /plan
// ==========================
app.post("/plan", async (req, res) => {
  try {
    const { objective, level, hoursPerWeek, weeks } = req.body || {};

    if (!objective) return res.status(400).json({ error: "objective es requerido" });
    const hpw = Number(hoursPerWeek);
    const wks = Number(weeks);
    if (!Number.isFinite(hpw) || hpw <= 0) {
      return res.status(400).json({ error: "hoursPerWeek debe ser número > 0" });
    }
    if (!Number.isFinite(wks) || wks <= 0) {
      return res.status(400).json({ error: "weeks debe ser número > 0" });
    }

    const aiRawText = await callAIProvider({ objective, level, hoursPerWeek: hpw, weeks: wks });

    const { data, error, source, raw } = normalizeAIJSON(aiRawText);
    if (error) {
      return res.status(502).json({
        error: "AI invalid JSON",
        detail: error,
        sample: raw?.slice(0, 4000) || null,
      });
    }

    const shapeErr = validatePlanShape(data);
    if (shapeErr) {
      const fixed = {
        objective,
        level: data?.level ?? level ?? "No especificado",
        hoursPerWeek: data?.hoursPerWeek ?? hpw,
        weeks: data?.weeks ?? wks,
        weeksPlan: Array.isArray(data?.weeksPlan) ? data.weeksPlan : [],
        _source: source || "unknown",
        _note: `Esquema reparado: ${shapeErr}`,
      };
      return res.status(200).json(fixed);
    }

    return res.status(200).json({
      ...data,
      _source: source,
    });
  } catch (err) {
    console.error("[/plan] Uncaught error:", err);
    return res.status(500).json({ error: "Internal error generating plan" });
  }
});

// ==========================
// Manejo de errores y 404
// ==========================
app.use((err, _req, res, next) => {
  if (err && /CORS bloqueado/.test(String(err.message))) {
    return res.status(403).json({ error: "CORS origin no permitido" });
  }
  return next(err);
});

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// ==========================
// Listen / Shutdown
// ==========================
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
  server.close(() => {
    console.log("[boot] Server closed. Bye!");
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export default app;
