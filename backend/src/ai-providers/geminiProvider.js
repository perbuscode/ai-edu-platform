// backend/src/ai-providers/geminiProvider.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const TEMPERATURE = Number(process.env.GEMINI_TEMPERATURE) || 0.2;

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("[geminiProvider] GEMINI_API_KEY no configurada.");
}
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Genera un plan de estudio con un esquema fijo y devuelve JSON.
 */
export async function generateStudyPlan({ objective, level, hoursPerWeek, weeks }) {
  const prompt = `
Eres un planificador de estudio. Devuelve **solo JSON válido** (sin texto extra), con este esquema:
{
  "objective": string,
  "level": string,
  "hoursPerWeek": number,
  "weeks": number,
  "weeksPlan": [
    { "week": number, "goals": string[], "resources": any[], "tasks": any[] }
  ]
}

Datos del usuario:
- objective: ${objective}
- level: ${level}
- hoursPerWeek: ${hoursPerWeek}
- weeks: ${weeks}
`.trim();

  const model = genAI.getGenerativeModel({ model: MODEL });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }]}],
    generationConfig: { responseMimeType: "application/json", temperature: TEMPERATURE }
  });

  const text = result?.response?.text?.() ?? "";
  if (!text) throw new Error("Gemini devolvió respuesta vacía");

  // Sin reparaciones aquí: deja el saneo/normalización al server.js si lo necesitas
  return text;
}
