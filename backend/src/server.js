// backend/src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { getCoursesData, getMetricsData, getSkillsMapData } from "./dashboardData.js";
import { getFirestoreSafe, verifyIdTokenOptional } from "./firebaseAdmin.js";
import { getAiProvider } from "./ai-providers/index.js";

const app = express();
const PORT = process.env.PORT || 5050;

// --- Sanitización básica de strings ---
function toSafeString(v, { max = 200 } = {}) {
  if (typeof v !== "string") return "";
  // trim + recortar longitud + quitar caracteres de control no imprimibles
  const trimmed = v.trim().slice(0, max);
  return trimmed.replace(/[\u0000-\u001F\u007F]/g, "");
}

// Configuración de CORS más explícita y segura para producción
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",");
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Cabeceras de seguridad básicas (ajusta según necesidades del frontend)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  next();
});

app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.get("/api/metrics", async (req, res) => {
  try {
    const metrics = await getMetricsData();
    res.json(metrics);
  } catch (error) {
    console.error("[dashboard] metrics error", error);
    res.status(500).json({ error: "No se pudieron obtener las métricas" });
  }
});

app.get("/api/courses", async (req, res) => {
  try {
    const courses = await getCoursesData();
    res.json(courses);
  } catch (error) {
    console.error("[dashboard] courses error", error);
    res.status(500).json({ error: "No se pudieron obtener los cursos" });
  }
});

app.get("/api/skills-map", async (req, res) => {
  try {
    const skills = await getSkillsMapData();
    res.json(skills);
  } catch (error) {
    console.error("[dashboard] skills map error", error);
    res.status(500).json({ error: "No se pudo obtener el mapa de habilidades" });
  }
});

app.post("/plan", async (req, res) => {
  try {
    const { objective, level, hoursPerWeek, weeks } = req.body || {};

    // Sanitizar strings (evita espacios de más y caracteres raros)
    const objectiveSafe = toSafeString(objective, { max: 300 });
    const levelSafe = toSafeString(level, { max: 100 });

    // Validación explícita del payload
    const problems = [];
    if (!objectiveSafe) problems.push("objective (string no vacío)");
    if (!levelSafe) problems.push("level (string no vacío)");
    const hpw = Number(hoursPerWeek);
    if (!Number.isFinite(hpw) || hpw <= 0) problems.push("hoursPerWeek (número > 0)");
    const wks = Number(weeks);
    if (!Number.isFinite(wks) || wks <= 0 || !Number.isInteger(wks))
      problems.push("weeks (entero > 0)");

    // (Opcional) límites sanos:
    // if (hpw > 80) problems.push("hoursPerWeek (máx 80)");
    // if (wks > 52) problems.push("weeks (máx 52)");

    if (problems.length) {
      const errorId = Date.now().toString(36);
      console.warn(`[POST /plan][${errorId}] Validación fallida: ${problems.join(", ")}`);
      return res.status(400).json({ error: `Payload inválido: ${problems.join("; ")}`, errorId });
    }

    let plan;
    if (
      process.env.MOCK_PLAN === "1" ||
      (req.query && req.query.mock === "1") ||
      req.headers["mock"] === "1" ||
      req.headers["x-mock"] === "1"
    ) {
      console.info("[POST /plan] mock solicitado");
      plan = {
        title: `${objectiveSafe} (Nivel ${levelSafe}) - ${wks} semanas`,
        goal: objectiveSafe,
        level: levelSafe,
        hoursPerWeek: hpw,
        durationWeeks: wks,
        blocks: [
          {
            title: "Fundamentos",
            bullets: ["Intro", "Herramientas", "Buenas prácticas"],
            project: "Proyecto 1",
            role: "Jr.",
          },
          {
            title: "Profundización",
            bullets: ["Conceptos clave", "Práctica guiada"],
            project: "Proyecto 2",
            role: "Mid",
          },
        ],
        rubric: [
          { criterion: "Comprensión de conceptos", level: "A/B/C" },
          { criterion: "Aplicación práctica", level: "A/B/C" },
        ],
      };
    } else {
      try {
        const { generateStudyPlan } = getAiProvider();
        plan = await generateStudyPlan({
          input: { objective: objectiveSafe, level: levelSafe, hoursPerWeek: hpw, weeks: wks },
        });
      } catch (error) {
        const errorId = Date.now().toString(36);
        console.error(`[POST /plan][${errorId}] Fallo al generar plan con el proveedor de IA`, {
          message: error?.message || String(error),
          httpStatus: error.status || error.statusCode,
        });
        throw error;
      }
    }

    // Intento de guardar el plan en Firestore si hay usuario autenticado
    const authz = req.headers["authorization"];
    const decoded = await verifyIdTokenOptional(authz);
    if (decoded?.uid) {
      const db = getFirestoreSafe();
      if (db) {
        const uid = decoded.uid;
        const ref = db.collection("users").doc(uid).collection("plans").doc();
        const stored = {
          plan,
          objective: objectiveSafe,
          level: levelSafe,
          hoursPerWeek: hpw,
          weeks: wks,
          createdAt: new Date().toISOString(),
        };
        await ref.set(stored);
        plan._id = ref.id;
      }
    }

    res.json({ plan });
  } catch (e) {
    const errorId = Date.now().toString(36);
    const httpStatus =
      e?.status ?? e?.statusCode ?? e?.response?.status ?? e?.response?.statusCode ?? 500;

    // Log en servidor
    console.error(`[POST /plan][${errorId}] Error al generar plan`, {
      name: e?.name || "Error",
      message: e?.message || String(e),
      httpStatus,
      details: e?.details || e?.response?.data,
      stack: e?.stack,
    });

    // Respuesta base al cliente
    const payload = { error: "No se pudo generar el plan", errorId };

    // En desarrollo, expone info útil
    if (process.env.NODE_ENV !== "production") {
      payload.debug = {
        provider: process.env.AI_PROVIDER,
        model: process.env.GEMINI_MODEL,
        status: httpStatus,
        name: e?.name,
        message: e?.message,
        details: e?.details || e?.response?.data || null,
      };
    }

    res.status(httpStatus).json(payload);
  }
});

// Export app for testing
export default app;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`[backend] Escuchando en http://localhost:${PORT}`);
  });
}
