// frontend/src/services/geminiClient.js

const GEMINI_FUNCTION_ENDPOINT = "/.netlify/functions/gemini";

/**
 * Llama a la Netlify Function para obtener una respuesta de Gemini.
 *
 * @param {string} prompt El texto que se enviará al modelo de IA.
 * @returns {Promise<string>} El texto de la respuesta generada por Gemini.
 * @throws {Error} Si la petición falla o la API devuelve un error.
 */
export async function askGemini(prompt) {
  try {
    const response = await fetch(GEMINI_FUNCTION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // Intenta parsear el error
      const errorMessage = errorData.error || `Error del servidor: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error al llamar a la función de Gemini:", error);
    // Re-lanza el error para que el componente que lo llama pueda manejarlo (e.g., mostrar un toast).
    throw new Error(error.message || "No se pudo conectar con el servicio de IA.");
  }
}
