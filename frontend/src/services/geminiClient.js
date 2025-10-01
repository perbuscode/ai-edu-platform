// frontend/src/services/geminiClient.js

const BASE = "/.netlify/functions";

/**
 * Envía un prompt a la función Netlify "gemini"
 * @param {string} prompt - El texto a enviar al modelo
 * @returns {Promise<string>} - Respuesta de Gemini (texto)
 */
export async function askGemini(prompt) {
  try {
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

    // Normaliza el campo de respuesta
    if (data?.text) return data.text;

    throw new Error("Respuesta de Gemini inválida");
  } catch (err) {
    console.error("[geminiClient] Error al contactar Gemini:", err);
    throw err;
  }
}
