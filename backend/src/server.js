// src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";

// ==========================
// Arranque / middlewares base
// ==========================
const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

// ==========================
// CORS (ajusta los orígenes a tu realidad)
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

// ====================================================
// Utilidades para convertir texto "raro" en JSON válido
// ====================================================
function safeParseJSON(text) {
  try {
    return [JSON.parse(text), null];
  } catch (e) {
    return [null, e];
  }
}

// Extrae bloque ```json ... ``` o ``` ... ```
function extractJsonFence(text) {
  if (!text) return null;
  const m =
    text.match(/```json\s*([\s\S]*?)```/i) ||
    text.match(/```\s*([\s\S]*?)```/i);
  return m ? m[1].trim() : null;
}

// Toma desde el primer { hasta el último } para intentar aislar el objeto JSON
function sliceFirstCurlyToLastCurly(text) {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return null;
  return text.slice(first, last + 1).trim();
}

// Reparaciones suaves y no peligrosas
function gentleRepairs(text) {
  if (!text) return text;

  let out = text.trim();

  // Quita BOM si existe
  out = out.replace(/^\uFEFF/, "");

  // Reemplaza comillas simples por dobles sólo en casos simples (keys y strings comunes)
  // Nota: es una reparación heurística; si no corresponde, el parse fallará y seguiremos con otras estrategias
  // Claves: 'key': -> "key":
  out = out.replace(/'(\w+?)'\s*:/g, '"$1":');
  // Strings: : 'value' -> : "value"
  out = out.replace(/:\s*'([^']*)'/g, ': "$1"');

  // Elimina comas finales antes de } o ]
  out = out.replace(/,\s*([}\]])/g, "$1");

  return out;
}

// Validación mínima de esquema de plan
function validatePlanShape(obj) {
  if (!obj || typeof obj !== "object") return "payload no es un objeto";
  const must = ["objective", "weeks", "hoursPerWeek", "weeksPlan"];
  for (const k of must) {
    if (!(k in obj)) return `falta propiedad requerida: ${k}`;
  }
  if (!Array.isArray(obj.weeksPlan)) return "weeksPlan debe ser un arreglo";
  return null; // ok
}

/**
 * Intenta convertir texto "AI" en JSON válido con varias estrategias:
 * 1) JSON.parse directo
 * 2) Extraer bloque entre ```json ... ```
 * 3) Tomar desde primer { hasta último } (cuando hay texto adicional)
 * 4) Reparaciones suaves (comillas simples, comas finales)
 * 5) Repetir parse tras reparaciones
 */
function normalizeAIJSON(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return { error: "AI devolvió cuerpo vacío o no-string" };
  }

  // 1) Parse directo
  {
    const [dataDirect] = safeParseJSON(rawText);
    if (dataDirect) return { data: dataDirect, source: "direct" };
  }

  // 2) Extraer bloque fence
  const fenced = extractJsonFence(rawText);
  if (fenced) {
    const [dataFence] = safeParseJSON(fenced);
    if (dataFence) return { data: dataFence, source: "fence" };

    const repairedFence = gentleRepairs(fenced);
    const [dataFenceRepaired] = safeParseJSON(repairedFence);
    if (dataFenceRepaired) return { data: dataFenceRepaired, source: "fence+repair" };
  }

  // 3) Cortar desde { ... } último
  const sliced = sliceFirstCurlyToLastCurly(rawText);
  if (sliced) {
    const [dataSliced] = safeParseJSON(sliced);
    if (dataSliced) return { data: dataSliced, source: "sliced" };

    const repairedSliced = gentleRepairs(sliced);
    const [dataSlicedRepaired] = safeParseJSON(repairedSliced);
    if (dataSlicedRepaired) return { data: dataSlicedRepaired, source: "sliced+repair" };
  }

  // 4) Reparaciones suaves sobre el texto completo
  const repaired = gentleRepairs(rawText);
  const [dataRepaired] = safeParseJSON(repaired);
  if (dataRepaired) return { data: dataRepaired, source: "repair" };

  return { error: "No se pudo convertir la respuesta de la IA en JSON.", raw: rawText };
}

// ====================================================
// (Opcional) Generador simulado / proveedor real
// Sustituye este bloque por tu integración con @google/genai u OpenAI
// ====================================================
async function callAIProvider(_input) {
  // Si estás testeando, respeta MOCK_PLAN=1
  if (process.env.MOCK_PLAN === "1") {
    return JSON.stringify({
      objective: "Aprender React",
      level: "Inicial",
      hoursPerWeek: 6,
      weeks: 4,
      weeksPlan: Array.from({ length: 4 }, (_, i) => ({
        week: i + 1,
        goals: i === 0 ? ["Fundamentos"] : ["Profundización"],
        resources: [],
        tasks: [],
      })),
    });
  }

  // TODO: Integra aquí tu llamada real a Gemini u OpenAI y devuelve TEXTO (no objeto)
  // Ejemplo de texto con basura y bloque json (simulando mal formateo):
  return `
    Aquí está tu plan:
    \`\`\`json
    {
      "objective": "Aprender React",
      "level": "Inicial",
      "hoursPerWeek": 6,
      "weeks": 4,
      "weeksPlan": [
        { "week": 1, "goals": ["Fundamentos"], "resources": [], "tasks": [] },
        { "week": 2, "goals": ["Componentes"], "resources": [], "tasks": [] },
        { "week": 3, "goals": ["Estado y efectos"], "resources": [], "tasks": [] },
        { "week": 4, "goals": ["Routing y deploy"], "resources": [], "tasks": [] }
      ]
    }
    \`\`\`
    ¿Algo más?
  `;
}

// ==========================
// Endpoint robusto: /plan
// ==========================
app.post("/plan", async (req, res) => {
  try {
    const { objective, level, hoursPerWeek, weeks } = req.body || {};

    // Validaciones mínimas de entrada
    if (!objective) return res.status(400).json({ error: "objective es requerido" });
    const hpw = Number(hoursPerWeek);
    const wks = Number(weeks);
    if (!Number.isFinite(hpw) || hpw <= 0) {
      return res.status(400).json({ error: "hoursPerWeek debe ser número > 0" });
    }
    if (!Number.isFinite(wks) || wks <= 0) {
      return res.status(400).json({ error: "weeks debe ser número > 0" });
    }

    // 1) Llama a tu proveedor (retorna TEXTO)
    const aiRawText = await callAIProvider({ objective, level, hoursPerWeek: hpw, weeks: wks });

    // 2) Normaliza a JSON sí o sí
    const { data, error, source, raw } = normalizeAIJSON(aiRawText);
    if (error) {
      // No logramos convertir → responde 502 con detalle, siempre JSON
      return res.status(502).json({
        error: "AI invalid JSON",
        detail: error,
        note: "No se pudo convertir la respuesta de la IA a JSON",
        sample: raw?.slice(0, 4000) || null,
      });
    }

    // 3) Validación mínima del shape; si falta algo, completamos con valores del input
    const shapeErr = validatePlanShape(data);
    if (shapeErr) {
      // intentamos “sanear” con el input del usuario para que el frontend no se caiga
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

    // 4) Todo bien → devolvemos el plan normalizado + metadatos de trazabilidad opcionales
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
