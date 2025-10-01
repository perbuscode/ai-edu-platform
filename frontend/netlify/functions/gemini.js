// frontend/netlify/functions/gemini.js
// Function que llama a Gemini 2.5 Flash vía API REST (sin SDK)
// Requiere: Node 18+ (fetch nativo) y variable de entorno GEMINI_API_KEY en Netlify

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
        body: JSON.stringify({ error: 'El campo "prompt" es requerido y debe ser texto.' }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY no está configurada");
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "GEMINI_API_KEY not set" }),
      };
    }

    const modelName = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    console.log("[gemini] Using REST, model:", modelName, "prompt length:", prompt.length);

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      // (Opcional) Ajustes de seguridad / generación:
      // generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // IMPORTANTE: para la API REST se usa ?key=..., no Authorization: Bearer
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      console.error("Gemini REST error:", res.status, res.statusText, errText);
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: `Gemini REST ${res.status}: ${res.statusText}` }),
      };
    }

    const data = await res.json();

    // Extraer texto (puede venir en múltiples parts)
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || "")
        .join("") || "";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, model: modelName }),
    };
  } catch (error) {
    console.error("Gemini function error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Error interno: " + error.message }),
    };
  }
};
