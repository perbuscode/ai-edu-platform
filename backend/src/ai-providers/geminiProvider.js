// backend/src/ai-providers/geminiProvider.js
import { GoogleGenAI } from "@google/genai";

const HarmCategory = {
  HARM_CATEGORY_HARASSMENT: "HARM_CATEGORY_HARASSMENT",
  HARM_CATEGORY_HATE_SPEECH: "HARM_CATEGORY_HATE_SPEECH",
  HARM_CATEGORY_SEXUALLY_EXPLICIT: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  HARM_CATEGORY_DANGEROUS_CONTENT: "HARM_CATEGORY_DANGEROUS_CONTENT",
};

const HarmBlockThreshold = { BLOCK_ONLY_HIGH: "BLOCK_ONLY_HIGH" };

const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const MODEL_CANDIDATES = Array.from(
  new Set([
    PRIMARY_MODEL,
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-2.0-flash-lite",
  ]),
);

const DEFAULT_TEMPERATURE = Number(process.env.GEMINI_TEMPERATURE || 0.4);
const MAX_TOKENS = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS || 1200);

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("[geminiProvider] GEMINI_API_KEY no configurada (revisa .env).");
}
const ai = new GoogleGenAI({ apiKey });

function normalizeJsonText(text) {
  if (!text) return text;
  let t = String(text).trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "");
    t = t.replace(/```$/i, "").trim();
  }
  const first = t.indexOf("{");
  const last = t.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) t = t.slice(first, last + 1).trim();
  return t;
}

/**
 * Prompt enriquecido:
 * Pedimos un JSON inspirado y accionable: resumen, habilidades, roles objetivo y salarios.
 * Todo en español, conciso, listo para UI.
 */
function buildPrompt({ objective, level, hoursPerWeek, weeks }) {
  return `Actúa como un planificador educativo y orientador laboral.
Genera un JSON **válido** en español, conciso e inspirador, que incluya:
- Un breve "summary" (1–2 frases) que motive e indique el enfoque.
- "skills": lista de 5–12 habilidades concretas que el estudiante desarrollará (p.ej.: HTML, CSS, React, Hooks, APIs, Git).
- "roles": 1–3 roles objetivo realistas (p.ej.: "Frontend Jr.", "Desarrollador Web Jr.").
- "salary": array con 1–3 rangos salariales estimados alineados a los roles (si no hay datos confiables, deja el campo vacío).
  Cada item: { "role": string, "currency": string, "min": number, "max": number, "period": "mes"|"año", "region": string }
- El plan en bloques "blocks" con bullets y proyecto por bloque.
- Una "rubric" breve de evaluación/aprovechamiento.

Requisitos:
- Responde **solo** JSON válido, sin texto adicional.
- Ajusta títulos y contenido a: objetivo="${objective}", nivel="${level}", horasPorSemana=${hoursPerWeek}, semanas=${weeks}.
- No exageres ni inventes cifras si no estás seguro: puedes dejar "salary": [].

Esquema de salida:
{
  "title": string,
  "goal": string,
  "level": string,
  "hoursPerWeek": number,
  "durationWeeks": number,
  "summary": string,
  "skills": string[],
  "roles": string[],
  "salary": [
    { "role": string, "currency": string, "min": number, "max": number, "period": string, "region": string }
  ],
  "blocks": [
    { "title": string, "bullets": string[], "project": string, "role": string }
  ],
  "rubric": [
    { "criterion": string, "level": string }
  ]
}`;
}

async function callOneModel(model, prompt) {
  const safetySettings =
    process.env.GEMINI_DISABLE_SAFETY === "1"
      ? []
      : [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ];

  const generationConfig = {
    responseMimeType: "application/json",
    temperature: DEFAULT_TEMPERATURE,
    maxOutputTokens: MAX_TOKENS,
  };

  const resp = await ai.models.generateContent({
    model,
    generationConfig,
    safetySettings,
    contents: prompt,
  });

  const raw = typeof resp?.text === "function" ? resp.text() : resp?.text || "";
  return normalizeJsonText(raw);
}

export async function generateStudyPlan({ input }) {
  const { objective, level, hoursPerWeek, weeks } = input;
  const prompt = buildPrompt({ objective, level, hoursPerWeek, weeks });

  let text = "";
  let lastError = null;

  // Reintentos con varios modelos
  for (let i = 0; i < MODEL_CANDIDATES.length; i++) {
    const model = MODEL_CANDIDATES[i];
    try {
      text = await callOneModel(model, prompt);
      if (text && text.trim().startsWith("{")) break; // tenemos algo con pinta de JSON
    } catch (err) {
      lastError = err;
      const delay = 400 + Math.floor(Math.random() * 900);
      console.warn(
        `[geminiProvider] intento ${i + 1} falló (status=${err?.status || err?.statusCode || "?"}). Reintentando en ${delay}ms...`,
      );
      await new Promise(r => setTimeout(r, delay));
    }
  }

  if (!text) {
    console.error("[geminiProvider] No se obtuvo respuesta JSON de ningún modelo.", lastError);
    if (process.env.MOCK_ON_5XX === "1") {
      return {
        title: `${objective} (Nivel ${level}) - ${weeks} semanas [mock]`,
        goal: objective,
        level,
        hoursPerWeek: Number(hoursPerWeek),
        durationWeeks: Number(weeks),
        summary: "Plan de ejemplo mientras el servicio de IA se estabiliza.",
        skills: ["Fundamentos", "Práctica guiada", "Proyecto final"],
        roles: ["Jr."],
        salary: [],
        blocks: [
          {
            title: "Fundamentos",
            bullets: ["Intro", "Setup", "Conceptos base"],
            project: "Proyecto 1",
            role: "Jr.",
          },
          {
            title: "Práctica",
            bullets: ["Hooks/Fetch", "Routing básico"],
            project: "Proyecto 2",
            role: "Mid",
          },
        ],
        rubric: [{ criterion: "Comprensión", level: "A/B/C" }],
      };
    }
    throw new Error("No se pudo generar el plan. Hubo un problema con el servicio de IA.");
  }

  // Parseo seguro
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error("[geminiProvider] Respuesta no es JSON válido:", text);
    throw new Error("La respuesta del modelo de IA no es un JSON válido.");
  }

  // Normalizaciones / defaults mínimos
  data.goal = data.goal || objective;
  data.level = data.level || level;
  data.hoursPerWeek = Number(data.hoursPerWeek ?? hoursPerWeek);
  data.durationWeeks = Number(data.durationWeeks ?? weeks);

  // Estructuras opcionales
  if (!Array.isArray(data.skills)) data.skills = [];
  if (!Array.isArray(data.roles)) data.roles = [];
  if (!Array.isArray(data.salary)) data.salary = [];
  if (!Array.isArray(data.blocks)) data.blocks = [];
  if (!Array.isArray(data.rubric)) data.rubric = [];

  return data;
}
