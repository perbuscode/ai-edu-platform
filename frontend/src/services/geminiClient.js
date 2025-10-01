// frontend/src/services/geminiClient.js
import { postJSON } from "../utils/api";

/**
 * Envía un prompt al backend en Render para generar un plan con Gemini.
 *
 * @param {string} prompt Texto que se usará como "objective" del plan
 * @param {object} opts   Opcionales: level, hoursPerWeek, weeks, timeoutMs
 * @returns {Promise<object>} Plan de estudio generado por el backend
 */
export async function askGemini(
  prompt,
  { level = "Inicial", hoursPerWeek = 6, weeks = 4, timeoutMs = 120000 } = {}
) {
  return postJSON(
    "/plan",
    { objective: prompt, level, hoursPerWeek, weeks },
    {
      timeoutMs,  // ⏱️ ampliamos el timeout (120s por defecto)
      retries: 0, // no reintentes si ya tardó tanto
      allowAbort: false, // ignora AbortController externos “accidentales”
    }
  );
}
