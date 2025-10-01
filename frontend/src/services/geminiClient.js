// frontend/src/services/geminiClient.js
import { postJSON } from "../utils/api";

/**
 * Envía un prompt al backend en Render para generar un plan con Gemini.
 *
 * @param {string} prompt Texto que se usará como "objective" del plan
 * @returns {Promise<object>} Plan de estudio generado por el backend
 */
export async function askGemini(prompt) {
  return postJSON("/plan", {
    objective: prompt,
    level: "Inicial",
    hoursPerWeek: 6,
    weeks: 4,
  });
}
