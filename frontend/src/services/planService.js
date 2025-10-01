// frontend/src/services/planService.js
const BASE = "/.netlify/functions"; // 👈 ya no uses localhost en producción

export async function generatePlan(payload) {
  const res = await fetch(`${BASE}/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Plan ${res.status}: ${msg}`);
  }

  return res.json(); // tu backend devuelve JSON de plan
}
