// frontend/src/services/planEnricher.js
import { askGemini } from "./geminiClient";

/**
 * Extrae las últimas 4 respuestas del usuario desde el historial
 * (objetivo, nivel, horas/semana, semanas).
 */
function extractWizardAnswers(messages) {
  const answers = messages
    .filter((m) => m.role === "user")
    .slice(-4)
    .map((m) => m.content || m.text || "");
  const [goal, level, hoursPerWeek, weeks] = answers;
  return { goal, level, hoursPerWeek, weeks };
}

/**
 * Construye el prompt de enriquecimiento combinando:
 * - El plan JSON devuelto por tu backend (estructura base)
 * - Las 4 respuestas del usuario (contexto)
 */
function buildEnrichmentPrompt(plan, messages) {
  const { goal, level, hoursPerWeek, weeks } = extractWizardAnswers(messages);

  return [
    "Eres un planificador instruccional experto. Recibirás un plan base en JSON (estructura) y contexto del alumno.",
    "Tu tarea: devolver SOLO un plan enriquecido en Markdown (sin charla extra), manteniendo la estructura por semanas y añadiendo:",
    "- Objetivos SMART por semana",
    "- Recursos concretos (docs oficiales, cursos MOOC, artículos), con enlaces en Markdown",
    "- Ejercicios prácticos y criterios de evaluación",
    "- Consejos de gestión del tiempo y hábitos",
    "Sé conciso pero útil. Evita párrafos gigantes; usa bullets y subtítulos.",
    "",
    "Contexto del alumno:",
    `- Objetivo/tema: ${goal || "(no especificado)"}`,
    `- Nivel actual: ${level || "(no especificado)"}`,
    `- Horas por semana: ${hoursPerWeek || "(no especificado)"}`,
    `- Semanas objetivo: ${weeks || "(no especificado)"}`,
    "",
    "Plan base (JSON):",
    "```json",
    JSON.stringify(plan, null, 2),
    "```",
    "",
    "Devuelve el plan enriquecido en Markdown con este esquema:",
    "## Resumen",
    "- Objetivo, duración, horas/semana",
    "",
    "## Plan por semanas",
    "- Semana 1: objetivos SMART, contenidos, ejercicios, recursos (links), criterios de éxito",
    "- Semana 2: ...",
    "",
    "## Recursos globales y buenas prácticas",
    "- …",
  ].join("\n");
}

/**
 * Enriquecedor: llama a Gemini con el prompt construido.
 * @param {object} plan - Plan JSON devuelto por el backend (generatePlan)
 * @param {Array} messages - Historial del wizard para extraer contexto
 * @returns {Promise<string>} Markdown enriquecido
 */
export async function enrichPlanWithGemini(plan, messages) {
  const prompt = buildEnrichmentPrompt(plan, messages);
  const enrichedMarkdown = await askGemini(prompt);
  return enrichedMarkdown;
}
