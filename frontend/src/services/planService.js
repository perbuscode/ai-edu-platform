// frontend/src/services/planService.js
export async function generatePlan({ objective, level, hoursPerWeek, weeks }) {
  const base = process.env.REACT_APP_API_BASE_URL || "http://localhost:5050";

  const resp = await fetch(`${base}/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ objective, level, hoursPerWeek, weeks }),
  });

  let data;
  try {
    data = await resp.json();
  } catch {
    throw new Error("El servidor no respondió con JSON válido.");
  }

  if (!resp.ok) {
    const msg = data?.error || "No se pudo generar el plan";
    throw new Error(msg);
  }

  return data.plan;
}
