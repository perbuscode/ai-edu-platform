// frontend/src/utils/api.js
import { getAuth } from "firebase/auth";

/**
 * BASE: viene de Netlify (producción) o local por defecto.
 * Asegúrate de tener REACT_APP_API_BASE_URL definido en Netlify.
 */
const BASE = (process.env.REACT_APP_API_BASE_URL || "http://localhost:5050").replace(/\/+$/, "");

/**
 * Construye headers con token de Firebase si existe.
 */
async function withAuthHeaders(headers = {}) {
  const result = { "Content-Type": "application/json", ...headers };
  try {
    const user = getAuth()?.currentUser;
    if (user) {
      const token = await user.getIdToken();
      result.Authorization = `Bearer ${token}`;
    }
  } catch {
    // noop
  }
  return result;
}

/**
 * Parseo de respuesta con errores amigables.
 */
async function handleResponse(res) {
  // Intenta JSON, si no, texto
  const text = await res.text().catch(() => "");
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* texto plano */ }

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || text || "Error en la solicitud";
    const error = new Error(msg);
    error.status = res.status;
    error.data = data || text;
    throw error;
  }

  // Si no hay body, devuelve objeto vacío
  if (!text) return {};
  return data ?? { raw: text };
}

/**
 * Fetch con tolerancia a AbortError y network hiccups.
 * - Si el abort fue "accidental" (sin razón), reintenta 1 vez.
 * - Puedes forzar que *sí* propague el abort pasando { allowAbort: true }.
 * - Puedes ajustar timeout con { timeoutMs } (por defecto 30000 ms).
 */
async function robustFetch(url, options = {}) {
  const {
    allowAbort = false,
    timeoutMs = 30000,
    retries = 1,
    // si desde fuera te pasan un signal, lo respetamos solo si allowAbort === true
    signal: externalSignal,
    ...rest
  } = options;

  // Creamos nuestro propio AbortController para timeout
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(new DOMException("timeout", "TimeoutError")), timeoutMs);

  // Elegimos qué signal usar:
  // - Si allowAbort=true y viene externalSignal, combinamos señales (si está soportado)
  // - Si no, usamos SOLO nuestra señal (evita abortos accidentales externos)
  let signalToUse = ac.signal;
  try {
    if (allowAbort && externalSignal && "any" in AbortSignal) {
      signalToUse = AbortSignal.any([ac.signal, externalSignal]);
    } else if (allowAbort && externalSignal) {
      // fallback: usamos la externa (aceptando que podría abortar)
      signalToUse = externalSignal;
    }
  } catch {
    // si AbortSignal.any no existe, seguimos con la nuestra
  }

  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { ...rest, signal: signalToUse });
      clearTimeout(timer);
      return res;
    } catch (err) {
      lastErr = err;
      // Si fue AbortError y NO nos pidieron permitir aborts, reintenta una vez
      const isAbort = err?.name === "AbortError";
      const wasTimeout = err?.name === "TimeoutError" || String(err?.message || "").includes("timeout");

      if (attempt < retries && (isAbort || wasTimeout) && !allowAbort) {
        // Espera mínima antes de reintentar (evita loop instantáneo)
        await new Promise(r => setTimeout(r, 150));
        continue;
      }
      clearTimeout(timer);
      throw err;
    }
  }
  throw lastErr;
}

/**
 * POST JSON
 * opts soporta: headers, allowAbort, timeoutMs, retries, (signal)
 */
export async function postJSON(path, body, opts = {}) {
  const headers = await withAuthHeaders(opts.headers);
  const res = await robustFetch(`${BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    allowAbort: !!opts.allowAbort,
    timeoutMs: opts.timeoutMs ?? 30000,
    retries: Number.isFinite(opts.retries) ? opts.retries : 1,
    signal: opts.signal,
  });
  return handleResponse(res);
}

/**
 * GET JSON
 * opts soporta: headers, allowAbort, timeoutMs, retries, (signal)
 */
export async function getJSON(path, opts = {}) {
  const headers = await withAuthHeaders(opts.headers);
  const res = await robustFetch(`${BASE}${path}`, {
    method: "GET",
    headers,
    allowAbort: !!opts.allowAbort,
    timeoutMs: opts.timeoutMs ?? 30000,
    retries: Number.isFinite(opts.retries) ? opts.retries : 1,
    signal: opts.signal,
  });
  return handleResponse(res);
}
