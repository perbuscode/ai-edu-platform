// frontend/src/services/geminiClient.js
import { postJSON } from "../utils/api";

/**
 * Envía un "prompt" al backend en Render para que genere un plan con Gemini.
 * @param {string} prompt Texto que se usará como objetivo del plan
 * @returns {Promise<object>} Plan de estudio en JSON
 */
export async function askGemini(prompt) {
  // Aquí mandamos el prompt como "objective"
  return postJSON("/plan", {
    objective: prompt,
    level: "Inicial",
    hoursPerWeek: 6,
    weeks: 4,
  });
}
