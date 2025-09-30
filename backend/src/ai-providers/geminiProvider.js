// backend/src/ai-providers/geminiProvider.js
import { GoogleGenAI } from "@google/genai";

const HarmCategory = {
  HARM_CATEGORY_HARASSMENT: "HARM_CATEGORY_HARASSMENT",
  HARM_CATEGORY_HATE_SPEECH: "HARM_CATEGORY_HATE_SPEECH",
  HARM_CATEGORY_SEXUALLY_EXPLICIT: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  HARM_CATEGORY_DANGEROUS_CONTENT: "HARM_CATEGORY_DANGEROUS_CONTENT",
};

const HarmBlockThreshold = {
  BLOCK_ONLY_HIGH: "BLOCK_ONLY_HIGH",
};

const STUDY_PLAN_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const STUDY_PLAN_TEMPERATURE = Number(process.env.GEMINI_TEMPERATURE) || 0.6;

// Crea el cliente una sola vez
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("[geminiProvider] GEMINI_API_KEY no configurada (revisa .env).");
}
const ai = new GoogleGenAI({ apiKey });

// ---- utils ----
function normalizeJsonText(text) {
  if (!text) return text;
  let t = String(text).trim();

  // El modelo a veces envuelve con fences de markdown
  if (t.startsWith("```")) {
    // quita la primera línea ```json o ```
    t = t.replace(/^```(?:json)?\s*/i, "");
    // quita el cierre ```
    t = t.replace(/```$/i, "").trim();
  }

  // recorta desde el primer { hasta el último }
  const first = t.indexOf("{");
  const last = t.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    t = t.slice(first, last + 1).trim();
  }
  return t;
}

// Prompt: pide explícitamente SOLO JSON
function buildPrompt({ objective, level, hoursPerWeek, weeks }) {
  return `Eres un planificador educativo experto.
Devuelve EXCLUSIVAMENTE un JSON válido (sin explicaciones, sin markdown, sin \`\`\`).
Estructura exacta:
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
- Total aprox ≈ hoursPerWeek * durationWeeks.
- "lessonHours.length" === "bullets.length".
- "projectHours" = 0 si no hay "project".
- Usa números con 1 decimal como máximo (ej. 1.5).
*/

Datos:
- objetivo="${objective}"
- nivel="${level}"
- horasPorSemana=${hoursPerWeek}
- semanas=${weeks}

Devuelve SOLO el JSON, sin texto adicional.`;
}

// Schema para forzar JSON (soportado por @google/genai)
const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    goal: { type: "string" },
    level: { type: "string" },
    hoursPerWeek: { type: "number" },
    durationWeeks: { type: "number" },
    blocks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          bullets: { type: "array", items: { type: "string" } },
          project: { type: "string" },
          role: { type: "string" },
          lessonHours: { type: "array", items: { type: "number" } },
          projectHours: { type: "number" },
        },
        required: ["title", "bullets", "project", "role", "lessonHours", "projectHours"],
        additionalProperties: true,
      },
    },
    rubric: {
      type: "array",
      items: {
        type: "object",
        properties: {
          criterion: { type: "string" },
          level: { type: "string" },
        },
        required: ["criterion", "level"],
        additionalProperties: true,
      },
    },
    skills: { type: "array", items: { type: "string" } },
    roles: { type: "array", items: { type: "string" } },
    salary: {
      type: "array",
      items: {
        type: "object",
        properties: {
          role: { type: "string" },
          currency: { type: "string", enum: ["USD"] },
          min: { type: "number" },
          max: { type: "number" },
          period: { type: "string", enum: ["month", "year"] },
          region: { type: "string" },
        },
        required: ["role", "currency", "min", "max", "period"],
        additionalProperties: true,
      },
    },
    summary: { type: "string" },
  },
  required: [
    "title",
    "goal",
    "level",
    "hoursPerWeek",
    "durationWeeks",
    "blocks",
    "rubric",
    "skills",
    "roles",
    "salary",
    "summary",
  ],
  additionalProperties: true,
};

export async function generateStudyPlan({ input }) {
  const { objective, level, hoursPerWeek, weeks } = input;

  const generationConfig = {
    responseMimeType: "application/json",
    responseSchema: RESPONSE_SCHEMA, // << fuerza JSON con el shape esperado
    temperature: STUDY_PLAN_TEMPERATURE,
    maxOutputTokens: 1800,
  };

  const safetySettings = [
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

  const prompt = buildPrompt({ objective, level, hoursPerWeek, weeks });

  let text = "";
  try {
    const resp = await ai.models.generateContent({
      model: STUDY_PLAN_MODEL,
      generationConfig,
      safetySettings,
      contents: prompt, // string directo
    });
    text = resp?.text ?? "";
  } catch (err) {
    console.error("[geminiProvider] Error al llamar a generateContent:", {
      name: err?.name,
      message: err?.message,
      status: err?.status || err?.statusCode,
    });
    throw new Error("No se pudo generar el plan. Hubo un problema con el servicio de IA.");
  }

  // Depuración opcional
  if (process.env.DEBUG_GEMINI === "1") {
    console.log("[geminiProvider] RAW text >>>", text);
  }

  // Sanea antes de parsear
  const cleaned = normalizeJsonText(text);

  let data;
  try {
    data = JSON.parse(cleaned);
  } catch (e) {
    console.error("[geminiProvider] JSON inválido tras limpieza:", cleaned);
    throw new Error("La respuesta del modelo de IA no es un JSON válido.");
  }

  // Normalizaciones / defaults
  data.goal = data.goal || objective;
  data.level = data.level || level;
  data.hoursPerWeek = Number(data.hoursPerWeek ?? hoursPerWeek);
  data.durationWeeks = Number(data.durationWeeks ?? weeks);
  data.skills = Array.isArray(data.skills) ? data.skills : [];
  data.roles = Array.isArray(data.roles) ? data.roles : [];
  data.salary = Array.isArray(data.salary) ? data.salary : [];
  data.blocks = Array.isArray(data.blocks) ? data.blocks : [];
  data.summary = typeof data.summary === "string" ? data.summary : "";

  // Asegurar coherencia de horas por módulo
  for (const m of data.blocks) {
    m.bullets = Array.isArray(m.bullets) ? m.bullets : [];
    if (!Array.isArray(m.lessonHours)) m.lessonHours = [];
    if (m.lessonHours.length !== m.bullets.length) {
      const n = m.bullets.length;
      const copy = m.lessonHours
        .slice(0, n)
        .map(Number)
        .map(v => (isFinite(v) ? v : 0));
      while (copy.length < n) copy.push(0);
      m.lessonHours = copy;
    } else {
      m.lessonHours = m.lessonHours.map(v => (isFinite(Number(v)) ? Number(v) : 0));
    }
    m.projectHours = isFinite(Number(m.projectHours)) ? Number(m.projectHours) : 0;
    if (!m.project) m.projectHours = 0;
  }

  return data;
}
