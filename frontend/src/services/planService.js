// frontend/src/services/planService.js
// Cliente de servicio para el plan, usando el backend en Render.
// Lee la URL base desde REACT_APP_API_BASE_URL (configurada en Netlify/CRA).
// Depende de los helpers robustos en src/utils/api.js (postJSON/getJSON).

import { postJSON } from "../utils/api";

/**
 * Genera el plan (llama a POST /plan en tu backend).
 * Puedes ajustar timeoutMs si lo necesitas (por defecto 120s).
 */
export async function generatePlan(
  payload,
  { timeoutMs = 120000, retries = 0, allowAbort = false } = {}
) {
  // postJSON concatena BASE + path y soporta opciones { timeoutMs, retries, allowAbort }
  return postJSON("/plan", payload, { timeoutMs, retries, allowAbort });
}

/**
 * saveStudyPlan: algunos componentes la importan.
 * Por ahora hace lo mismo que generatePlan y guarda una copia en localStorage.
 * Si luego agregas un endpoint real de persistencia, cambia aquí.
 */
export async function saveStudyPlan(
  { objective, level, hoursPerWeek, weeks },
  { timeoutMs = 120000, retries = 0, allowAbort = false } = {}
) {
  const plan = await postJSON(
    "/plan",
    { objective, level, hoursPerWeek, weeks },
    { timeoutMs, retries, allowAbort }
  );

  try {
    localStorage.setItem("lastStudyPlan", JSON.stringify(plan));
  } catch {
    // noop
  }

  return plan;
}

/** Utilidad opcional: leer el último plan guardado localmente */
export function loadLastStudyPlan() {
  try {
    const raw = localStorage.getItem("lastStudyPlan");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
