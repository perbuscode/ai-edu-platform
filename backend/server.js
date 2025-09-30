import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const allowOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: allowOrigin }));
app.use(express.json({ limit: "1mb" }));

// Simple id generator (no external dep)
function rid(len = 12) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// Local fallback generator when no OPENAI key available
function generatePlanLocal({ course, experience, hoursPerDay, weeks, goal }) {
  const title = `${course || "Habilidad objetivo"} (Plan ${weeks || 8} semanas)`;
  const parsedHours = Number(hoursPerDay || 1);
  const hoursPerWeek = isNaN(parsedHours) ? 5 : Math.max(3, Math.min(20, parsedHours * 5));
  const durationWeeks = Number(weeks || 8);
  const level = /no|cero|0/i.test(experience || "")
    ? "Principiante"
    : /junior|algo|poco/i.test(experience || "")
      ? "Junior"
      : "Intermedio";
  const blocks = [
    {
      title: "Fundamentos",
      bullets: ["Conceptos clave", "Herramientas", "Buenas prácticas"],
      project: "Mini proyecto base",
      role: "Jr.",
    },
    {
      title: "Práctica guiada",
      bullets: ["Técnicas esenciales", "Proyecto incremental", "Feedback"],
      project: "Proyecto intermedio",
      role: "Jr./Mid",
    },
    {
      title: "Aplicación real",
      bullets: ["Integración", "Optimización", "Entrega"],
      project: "Proyecto final",
      role: "Mid",
    },
  ];
  const rubric = [
    { criterion: "Dominio de fundamentos", level: "A/B/C" },
    { criterion: "Aplicación práctica", level: "A/B/C" },
    { criterion: "Calidad de entrega", level: "A/B/C" },
  ];
  return {
    id: `plan_${rid()}`,
    title,
    goal: goal || `Aprender ${course || "la habilidad objetivo"} con foco práctico`,
    level,
    hoursPerWeek,
    durationWeeks,
    blocks,
    rubric,
    source: "local",
  };
}

async function generatePlanWithOpenAI(payload) {
  const { OPENAI_API_KEY } = process.env;
  if (!OPENAI_API_KEY) return generatePlanLocal(payload);
  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: OPENAI_API_KEY });
    const { course, experience, hoursPerDay, weeks } = payload;
    const input = [
      "Genera un plan de estudio JSON con esta forma: {title, goal, level, hoursPerWeek, durationWeeks, blocks:[{title,bullets[],project,role}], rubric:[{criterion,level}]}.",
      "No envuelvas en bloque de código. Responde solo JSON válido.",
      `curso=${course || ""}; experiencia=${experience || ""}; horasDia=${hoursPerDay || ""}; semanas=${weeks || ""}`,
    ].join("\n");

    // Using Responses API (SDK v4)
    const resp = await client.responses.create({
      model: "gpt-4o-mini",
      input,
      temperature: 0.3,
    });
    const text = resp.output_text || "";
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // Attempt to extract JSON
      const m = text.match(/\{[\s\S]*\}/);
      data = m ? JSON.parse(m[0]) : null;
    }
    if (!data || typeof data !== "object") throw new Error("Invalid JSON from model");
    return { id: `plan_${rid()}`, ...data, source: "openai" };
  } catch (e) {
    console.warn("[plan] OpenAI failed, using local generator:", e?.message || e);
    return generatePlanLocal(payload);
  }
}

app.get("/health", (_, res) => res.json({ ok: true }));

app.post("/api/plan", async (req, res) => {
  try {
    const body = req.body || {};
    const payload = {
      course: String(body.course || body.goal || "").slice(0, 120),
      experience: String(body.experience || "").slice(0, 200),
      hoursPerDay: String(body.hoursPerDay || body.hours || "").slice(0, 10),
      weeks: String(body.weeks || "").slice(0, 10),
      goal: String(body.goal || "").slice(0, 200),
    };
    const plan = await generatePlanWithOpenAI(payload);
    res.json({ ok: true, plan });
  } catch (e) {
    console.error("[plan] error", e);
    res.status(500).json({ ok: false, error: "plan_generation_failed" });
  }
});

app.listen(PORT, () => {
  console.log(`[ai-edu-backend] listening on http://localhost:${PORT}`);
});
