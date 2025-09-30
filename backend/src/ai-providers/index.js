// src/ai-providers/index.js
import * as openaiProvider from "./openaiProvider.js";
import * as geminiProvider from "./geminiProvider.js";

const providers = {
  openai: openaiProvider,
  gemini: geminiProvider,
};

export function getAiProvider() {
  const providerName = (process.env.AI_PROVIDER || "openai").toLowerCase();
  const provider = providers[providerName];

  if (!provider) {
    throw new Error(
      `Proveedor de IA desconocido: "${providerName}". Los proveedores válidos son: ${Object.keys(providers).join(", ")}`,
    );
  }

  return provider;
}
