// src/services/planner.js

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5050";

/**
 * Llama al backend para generar un plan de estudio.
 * @param {{objective: string, level: string, hoursPerWeek: number, weeks: number}} data
 * @returns {Promise<object>} El plan generado.
 */
export async function generatePlan(data) {
  const response = await fetch(`${API_BASE_URL}/plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: "Error desconocido del servidor",
    }));
    throw new Error(errorData.error || "No se pudo generar el plan");
  }

  const result = await response.json();
  return result.plan;
}
