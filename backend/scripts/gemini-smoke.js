// backend/scripts/gemini-smoke.js
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  console.log("[smoke] Node:", process.version);
  console.log("[smoke] Model:", model);
  console.log("[smoke] API key present?:", apiKey ? "YES" : "NO");

  if (!apiKey) {
    console.error("[smoke] FALTA GEMINI_API_KEY en .env");
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const resp = await ai.models.generateContent({
      model,
      generationConfig: {
        responseMimeType: "text/plain",
        maxOutputTokens: 64,
        temperature: 0.2,
      },
      contents: "Dime “hola” en una sola palabra.",
    });

    console.log("[smoke] OK ->", resp.text);
  } catch (err) {
    // Mostramos TODO lo útil para depurar de una
    console.error("[smoke] ERROR");
    console.error(" name:", err?.name);
    console.error(" message:", err?.message);
    console.error(" status:", err?.status ?? err?.statusCode);
    console.error(" details:", err?.details);
    console.error(" response?.data:", err?.response?.data);
    console.error(" raw err object:", err);
    process.exit(2);
  }
}

main();
