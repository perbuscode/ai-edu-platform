// backend/scripts/gemini-test.js
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

function normalizeJsonText(text) {
  if (!text) return text;
  let t = String(text).trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "");
    t = t.replace(/```$/i, "").trim();
  }
  const first = t.indexOf("{");
  const last = t.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) t = t.slice(first, last + 1).trim();
  return t;
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ No se encontró GEMINI_API_KEY en .env");
    process.exit(1);
  }

  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  console.log("[gemini-test] Usando modelo:", modelName);

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt =
      'Genera un plan de estudio **JSON válido** para aprender HTML en 2 semanas. Responde ÚNICAMENTE el JSON con este esquema: {"title":string,"goal":string,"level":string,"hoursPerWeek":number,"durationWeeks":number,"blocks":[{"title":string,"bullets":string[],"project":string,"role":string}],"rubric":[{"criterion":string,"level":string}] }';

    const response = await ai.models.generateContent({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.5,
        maxOutputTokens: 800,
      },
      contents: prompt, // el SDK acepta string directo
    });

    const raw = response?.text ?? (typeof response?.text === "function" ? response.text() : "");
    const cleaned = normalizeJsonText(raw);

    console.log("\nBruto:\n", raw);
    console.log("\nLimpio:\n", cleaned);

    // Intentamos parsear a JSON para validar
    const json = JSON.parse(cleaned);
    console.log("\n✅ JSON válido. title:", json.title);
  } catch (err) {
    console.error("\n❌ Error al llamar a Gemini:", {
      name: err?.name,
      message: err?.message,
      status: err?.status || err?.statusCode,
    });
  }
}

main();
