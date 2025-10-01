// frontend/src/services/planner.js
import { askGemini } from "./geminiClient";

/**
 * Genera un prompt estructurado para crear un plan de estudio.
 * @param {{ objective: string, level: string, hoursPerWeek: number, weeks: number }} data
 * @returns {string} El prompt para enviar a Gemini.
 */
function buildStudyPlanPrompt({ objective, level, hoursPerWeek, weeks }) {
  // Este es un ejemplo. Puedes adaptar el prompt a tus necesidades.
  return `Crea un resumen de un plan de estudios para el siguiente objetivo:
- Objetivo: "${objective}"
- Nivel actual: "${level}"
- Dedicación: ${hoursPerWeek} horas/semana
- Duración: ${weeks} semanas

Describe en un párrafo corto los temas principales a cubrir.`;
}

export async function generatePlanSummary(data) {
  const prompt = buildStudyPlanPrompt(data);
  const summaryText = await askGemini(prompt);
  return summaryText;
}
