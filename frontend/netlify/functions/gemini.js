// netlify/functions/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Reutiliza el cliente si la función se mantiene "caliente" (warm)
let genAI;

export async function handler(event, context) {
  // 1. Validar que la API Key esté configurada en Netlify
  if (!process.env.GEMINI_API_KEY) {
    console.error("La variable de entorno GEMINI_API_KEY no está configurada.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Configuración del servidor incompleta." }),
    };
  }

  // 2. Solo aceptar peticiones POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método no permitido." }),
      headers: { Allow: "POST" },
    };
  }

  try {
    // 3. Parsear y validar el body de la petición
    const body = JSON.parse(event.body || "{}");
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'El campo "prompt" es requerido y debe ser un texto.' }),
      };
    }

    // 4. Inicializar el cliente de Google y llamar al modelo
    if (!genAI) {
      genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ text }),
    };
  } catch (error) {
    console.error("Error en la función de Gemini:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al contactar el servicio de IA." }),
    };
  }
}
