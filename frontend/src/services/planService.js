// frontend/src/services/planService.js
// Cliente de servicio para el plan, usando el backend en Render.
// Lee la URL base desde REACT_APP_API_BASE_URL (configurada en Netlify/CRA).
// Depende de los helpers robustos en src/utils/api.js (postJSON/getJSON).

import { postJSON } from "../utils/api";

/**
 * Genera el plan (llama a POST /plan en tu backend).
 * Mantengo esta función por si ya la usas en alguna parte.
 */
export async function generatePlan(payload) {
  // El postJSON ya concatena BASE + "/plan"
  return postJSON("/plan", payload);
}

/**
 * saveStudyPlan: algunos componentes la importan.
 * Por ahora hace lo mismo que generatePlan y guarda una copia en localStorage.
 * Si luego agregas un endpoint real para persistir, cambia aquí.
 */
export async function saveStudyPlan({ objective, level, hoursPerWeek, weeks }) {
  const plan = await postJSON("/plan", {
    objective,
    level,
    hoursPerWeek,
    weeks,
  });

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
