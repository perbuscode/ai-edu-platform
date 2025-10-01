// frontend/netlify/functions/gemini.js
// Función serverless que llama a Gemini 2.5 Flash vía API REST
// Requiere: Node 18+ (fetch nativo) y variable GEMINI_API_KEY en Netlify

exports.handler = async (event) => {
  try {
    // Solo permitir POST
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Leer el prompt del body
    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt || typeof prompt !== "string") {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: 'El campo "prompt" es requerido y debe ser texto.' }),
      };
    }

    // Validar API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY no está configurada");
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "GEMINI_API_KEY not set" }),
      };
    }

    // Configurar modelo y endpoint
    const modelName = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    console.log("[gemini] Using REST, model:", modelName, "prompt length:", prompt.length);

    // Configuración de generación (respuesta breve y rápida)
    const body = {
      systemInstruction: {
        role: "system",
        parts: [{ text: "Responde en un solo párrafo, máximo 6 oraciones." }],
      },
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 200, // 👈 Limita la longitud => más rápido
        topP: 0.9,
      },
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    // Llamada a la API
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    // Extraer texto de la respuesta
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
