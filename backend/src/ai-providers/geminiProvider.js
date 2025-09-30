// backend/src/ai-providers/geminiProvider.js
import { GoogleGenAI } from "@google/genai";

/** =========================
 *  Constantes y configuración
 *  ========================= */
const HarmCategory = {
  HARM_CATEGORY_HARASSMENT: "HARM_CATEGORY_HARASSMENT",
  HARM_CATEGORY_HATE_SPEECH: "HARM_CATEGORY_HATE_SPEECH",
  HARM_CATEGORY_SEXUALLY_EXPLICIT: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  HARM_CATEGORY_DANGEROUS_CONTENT: "HARM_CATEGORY_DANGEROUS_CONTENT",
};

const HarmBlockThreshold = {
  BLOCK_ONLY_HIGH: "BLOCK_ONLY_HIGH",
};

const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const MODEL_CANDIDATES = Array.from(
  new Set([
    PRIMARY_MODEL,
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-2.0-flash-lite",
  ]),
);

const TEMPERATURE =
  Number(process.env.GEMINI_TEMPERATURE) >= 0 ? Number(process.env.GEMINI_TEMPERATURE) : 0.6;

const MAX_OUTPUT_TOKENS = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS) || 1200;

const MAX_RETRIES = Number(process.env.GEMINI_MAX_RETRIES) || 2; // por ruta
const BASE_BACKOFF_MS = Number(process.env.GEMINI_BACKOFF_MS) || 500;

const DISABLE_SAFETY = process.env.GEMINI_DISABLE_SAFETY === "1";

/** =========================
 *  Cliente único
 *  ========================= */
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("[geminiProvider] GEMINI_API_KEY no configurada (revisa backend/.env).");
}
const ai = new GoogleGenAI({ apiKey });

/** =========================
 *  Utilidades
 *  ========================= */
const sleep = ms => new Promise(r => setTimeout(r, ms));

function jitteredBackoff(attempt) {
  const base = BASE_BACKOFF_MS * Math.pow(2, attempt - 1); // 1,2,4...
  const jitter = Math.floor(Math.random() * 500); // 0..499ms
  return base + jitter;
}

function getGenerationConfig() {
  return {
    responseMimeType: "application/json",
    temperature: TEMPERATURE,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
  };
}

function getSafetySettings() {
  if (DISABLE_SAFETY) return undefined;
  return [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];
}

function buildPrompt({ objective, level, hoursPerWeek, weeks }) {
  return `Eres un planificador educativo experto. Genera un plan de estudio en español con este formato estricto JSON:
{
  "title": string,
  "goal": string,
  "level": string,
  "hoursPerWeek": number,
  "durationWeeks": number,
  "blocks": [
    { "title": string, "bullets": string[], "project": string, "role": string }
  ],
  "rubric": [
    { "criterion": string, "level": string }
  ]
}
Datos: objetivo="${objective}", nivel="${level}", horasPorSemana=${hoursPerWeek}, semanas=${weeks}.
Devuelve SIEMPRE un JSON válido y nada más.`;
}

// Limpieza de respuestas que, a pesar de pedir JSON, vengan con fences o texto extra
function normalizeJsonText(text) {
  if (!text) return text;
  let t = String(text).trim();

  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "");
    t = t.replace(/```$/i, "").trim();
  }
  const first = t.indexOf("{");
  const last = t.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    t = t.slice(first, last + 1).trim();
  }
  return t;
}

function extractTextFromResponse(resp) {
  try {
    // Ruta 1 (ai.models.*) suele traer resp.text
    if (resp?.text) return typeof resp.text === "function" ? resp.text() : resp.text;

    // Ruta 2 (getGenerativeModel().generateContent) -> resp.response.text()
    if (resp?.response?.text) {
      const maybeFn = resp.response.text;
      return typeof maybeFn === "function" ? maybeFn() : maybeFn;
    }

    // Por si acaso, buscamos candidatos
    const cand = resp?.candidates?.[0];
    const parts = cand?.content?.parts;
    if (Array.isArray(parts)) {
      return parts
        .map(p => (p?.text ? String(p.text) : ""))
        .filter(Boolean)
        .join("\n");
    }
  } catch {
    // ignoramos y devolvemos vacío
  }
  return "";
}

function isServerError(err) {
  const status = err?.status || err?.statusCode || err?.response?.status || err?.data?.status || 0;
  return Number(status) >= 500;
}

async function callRouteModelsGenerateContent({ model, prompt, generationConfig, safetySettings }) {
  return ai.models.generateContent({
    model,
    contents: prompt,
    generationConfig,
    safetySettings,
  });
}

async function callRouteGetGenerativeModel({ model, prompt, generationConfig, safetySettings }) {
  const m = ai.getGenerativeModel({ model, generationConfig, safetySettings });
  return m.generateContent(prompt);
}

async function runWithRetries(fn, label) {
  let lastErr;
  for (let i = 1; i <= MAX_RETRIES; i++) {
    try {
      const resp = await fn();
      return resp;
    } catch (err) {
      lastErr = err;
      const status =
        err?.status || err?.statusCode || err?.response?.status || err?.data?.status || 0;
      if (i < MAX_RETRIES) {
        const delay = jitteredBackoff(i);
        console.warn(
          `[geminiProvider] ${label} intento ${i} falló (status=${status}). Reintentando en ${delay}ms...`,
        );
        await sleep(delay);
      }
    }
  }
  throw lastErr;
}

/** =========================
 *  API pública
 *  ========================= */
export async function generateStudyPlan({ input }) {
  const { objective, level, hoursPerWeek, weeks } = input;

  const generationConfig = getGenerationConfig();
  const safetySettings = getSafetySettings();
  const prompt = buildPrompt({ objective, level, hoursPerWeek, weeks });

  let text = "";
  let lastErr;

  for (const model of MODEL_CANDIDATES) {
    try {
      // 1) Ruta A: ai.models.generateContent (con reintentos)
      const respA = await runWithRetries(
        () =>
          callRouteModelsGenerateContent({
            model,
            prompt,
            generationConfig,
            safetySettings,
          }),
        `models.generateContent [${model}]`,
      );
      text = extractTextFromResponse(respA);
      if (!text) throw new Error("Respuesta vacía del modelo (ruta A).");
    } catch (errA) {
      lastErr = errA;

      // Si NO es 5xx, no tiene sentido probar la otra ruta
      if (!isServerError(errA)) {
        console.error("[geminiProvider] Error no recuperable (ruta A):", {
          status: errA?.status || errA?.statusCode || errA?.response?.status || errA?.data?.status,
          message: errA?.message,
        });
        throw new Error("No se pudo generar el plan. Hubo un problema con el servicio de IA.");
      }

      console.warn(
        "[geminiProvider] Ruta models.generateContent falló con 5xx, probando getGenerativeModel()...",
      );

      try {
        // 2) Ruta B: getGenerativeModel().generateContent (con reintentos)
        const respB = await runWithRetries(
          () =>
            callRouteGetGenerativeModel({
              model,
              prompt,
              generationConfig,
              safetySettings,
            }),
          `getGenerativeModel.generateContent [${model}]`,
        );
        text = extractTextFromResponse(respB);
        if (!text) throw new Error("Respuesta vacía del modelo (ruta B).");
      } catch (errB) {
        lastErr = errB;
        const statusA =
          errA?.status || errA?.statusCode || errA?.response?.status || errA?.data?.status;
        const statusB =
          errB?.status || errB?.statusCode || errB?.response?.status || errB?.data?.status;

        console.error("[geminiProvider] Ambas rutas fallaron para el modelo", {
          model,
          statusA,
          msgA: errA?.message,
          statusB,
          msgB: errB?.message,
        });

        // Intentamos con el siguiente modelo candidato
        continue;
      }
    }

    // Si llegamos aquí con "text" válido, salimos del loop de modelos
    if (text) {
      break;
    }
  }

  if (!text) {
    // Si ningún modelo devolvió texto:
    console.error("[geminiProvider] No se obtuvo respuesta de ningún modelo", {
      candidatesTried: MODEL_CANDIDATES,
      lastError: lastErr?.message,
    });
    throw new Error("No se pudo generar el plan. Hubo un problema con el servicio de IA.");
  }

  // Parseo robusto del JSON
  let data;
  try {
    const clean = normalizeJsonText(text);
    data = JSON.parse(clean);
  } catch (e) {
    console.error("[geminiProvider] Respuesta no es JSON válido:", text);
    throw new Error("La respuesta del modelo de IA no es un JSON válido.");
  }

  // Completar faltantes
  data.goal = data.goal || objective;
  data.level = data.level || level;
  data.hoursPerWeek = Number(data.hoursPerWeek ?? hoursPerWeek);
  data.durationWeeks = Number(data.durationWeeks ?? weeks);

  return data;
}
