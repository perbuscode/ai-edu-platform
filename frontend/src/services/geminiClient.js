// frontend/src/services/geminiClient.js
const BASE = "/.netlify/functions";

/**
 * Envía un prompt a la función Netlify "gemini"
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function askGemini(prompt) {
  const res = await fetch(`${BASE}/gemini`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Gemini ${res.status}: ${msg}`);
  }

  const data = await res.json();
  if (data?.text) return data.text;
  throw new Error("Respuesta de Gemini inválida");
}
