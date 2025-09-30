// src/ai-providers/openaiProvider.js
import OpenAI from "openai";

const STUDY_PLAN_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const STUDY_PLAN_TEMPERATURE = Number(process.env.OPENAI_TEMPERATURE) || 0.6;

function makeClient(apiKey) {
  if (!apiKey) throw new Error("OPENAI_API_KEY no configurada");
  return new OpenAI({ apiKey });
}

export async function generateStudyPlan({ input }) {
  const client = makeClient(process.env.OPENAI_API_KEY);
  const { objective, level, hoursPerWeek, weeks } = input;

  const sys =
    "Eres un planificador educativo experto. Devuelve SIEMPRE un JSON válido y nada más (sin backticks).";
  const user = `Genera un plan de estudio en español, con este formato estricto JSON:
  {
    "title": string, "goal": string, "level": string, "hoursPerWeek": number, "durationWeeks": number,
    "blocks": [{ "title": string, "bullets": string[], "project": string, "role": string }],
    "rubric": [{ "criterion": string, "level": string }]
  }
  Datos: objetivo="${objective}", nivel="${level}", horasPorSemana=${hoursPerWeek}, semanas=${weeks}.`;

  const resp = await client.chat.completions.create({
    model: STUDY_PLAN_MODEL,
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
    temperature: STUDY_PLAN_TEMPERATURE,
  });

  const text = resp.choices?.[0]?.message?.content || "{}";
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error("Respuesta de OpenAI no es JSON válido:", text);
    throw new Error("La respuesta del modelo de IA no es un JSON válido.");
  }

  // Normaliza campos clave para asegurar consistencia
  data.goal = data.goal || objective;
  data.level = data.level || level;
  data.hoursPerWeek = Number(data.hoursPerWeek ?? hoursPerWeek);
  data.durationWeeks = Number(data.durationWeeks ?? weeks);
  return data;
}
