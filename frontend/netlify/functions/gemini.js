// frontend/netlify/functions/gemini.js
// Llama a Gemini 2.5 Flash vía REST con límite de tokens y timeout corto.
// Si falla o se pasa, reintenta con gemini-1.5-flash-latest.

const MODEL_PRIMARY = "gemini-2.5-flash";
const MODEL_FALLBACK = "gemini-1.5-flash-latest";
const TIMEOUT_MS = 8000;

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms)
    ),
  ]);
}

async function callGeminiREST({ apiKey, model, prompt }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const body = {
    systemInstruction: {
      role: "system",
      parts: [{ text: "Responde en un solo párrafo o bullets concisos." }],
    },
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 220,
      topP: 0.9,
    },
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };

  const res = await withTimeout(
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
    TIMEOUT_MS
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`REST ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") ||
    "";
  return text;
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt || typeof prompt !== "string") {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: 'El campo "prompt" es requerido y debe ser texto.',
        }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "GEMINI_API_KEY not set" }),
      };
    }

    console.log("[gemini] Primary:", MODEL_PRIMARY, "len:", prompt.length);
    try {
      const text = await callGeminiREST({
        apiKey,
        model: MODEL_PRIMARY,
        prompt,
      });
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, model: MODEL_PRIMARY }),
      };
    } catch (err) {
      console.warn(
        "[gemini] Primary failed:",
        err.message,
        "→ trying fallback:",
        MODEL_FALLBACK
      );
      const text = await callGeminiREST({
        apiKey,
        model: MODEL_FALLBACK,
        prompt,
      });
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, model: MODEL_FALLBACK }),
      };
    }
  } catch (error) {
    console.error("Gemini function error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Error interno: " + error.message }),
    };
  }
};
