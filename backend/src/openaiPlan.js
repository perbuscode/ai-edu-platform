import OpenAI from "openai";

export function makeOpenAIClient(apiKey) {
  if (!apiKey) throw new Error("OPENAI_API_KEY no configurada");
  return new OpenAI({ apiKey });
}

export async function generateStudyPlan({ client, input }) {
  const { objective, level, hoursPerWeek, weeks } = input;
  const sys = [
    "Eres un planificador educativo experto.",
    "Devuelve SIEMPRE un JSON válido y nada más (sin backticks).",
  ].join(" ");
  const user = `Genera un plan de estudio en español, con este formato estricto JSON:
  {
    "title": string,
    "goal": string,
    "level": string,
    "hoursPerWeek": number,
    "durationWeeks": number,
    "blocks": [
      { "title": string, "bullets": string[], "project": string, "role": string }
    ],
    "rubric": [
      { "criterion": string, "level": string }
    ]
  }
  Datos: objetivo="${objective}", nivel="${level}", horasPorSemana=${hoursPerWeek}, semanas=${weeks}.
  `;

  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user }
    ],
    response_format: { type: "json_object" },
    temperature: 0.6,
  });
  const text = resp.choices?.[0]?.message?.content || "{}";
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error("Respuesta de OpenAI no es JSON válido");
  }
  // Normaliza campos claves
  data.goal = data.goal || objective;
  data.level = data.level || level;
  data.hoursPerWeek = Number(data.hoursPerWeek ?? hoursPerWeek);
  data.durationWeeks = Number(data.durationWeeks ?? weeks);
  return data;
}

