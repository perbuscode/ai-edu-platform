// src/utils/api.js
import { getAuth } from "firebase/auth";

/**
 * Normaliza BASE desde .env (Create React App usa REACT_APP_*).
 * En prod pon REACT_APP_API_BASE_URL=https://TU-SERVICIO-RENDER.onrender.com
 */
const RAW_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5050";
const BASE = RAW_BASE.replace(/\/+$/, ""); // sin / final

function joinUrl(base, path) {
  const p = String(path || "");
  // asegura que haya exactamente un slash
  return p.startsWith("/") ? `${base}${p}` : `${base}/${p}`;
}

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

function safeParseJSON(text) {
  try {
    return [JSON.parse(text), null];
  } catch (e) {
    return [null, e];
  }
}

/**
 * Manejo robusto de la respuesta:
 * - lee texto primero
 * - intenta parsear JSON; si falla pero el status es OK, lanza error claro
 * - si viene bloque ```json ... ```, lo intenta extraer
 */
function extractJsonBlock(text) {
  if (!text) return null;
  const m =
    text.match(/```json\s*([\s\S]*?)```/i) ||
    text.match(/```\s*([\s\S]*?)```/i);
  return m ? m[1].trim() : null;
}

async function handleResponse(res) {
  const text = await res.text();

  // si no es ok, intenta devolver mensaje del server
  if (!res.ok) {
    let payload = null;
    if (text) {
      const [j] = safeParseJSON(text);
      payload = j;
    }
    const msg =
      payload?.error ||
      payload?.message ||
      text ||
      "Error en la solicitud";
    const error = new Error(msg);
    error.status = res.status;
    error.data = payload || text;
    throw error;
  }

  if (!text) return {}; // sin cuerpo

  // intenta JSON directo
  let [data] = safeParseJSON(text);
  if (data) return data;

  // intenta extraer bloque ```json ... ```
  const block = extractJsonBlock(text);
  if (block) {
    const [data2] = safeParseJSON(block);
    if (data2) return data2;
  }

  // último recurso: error explícito (útil para depurar respuestas del proveedor)
  const err = new Error("Respuesta no es JSON válido");
  err.raw = text;
  throw err;
}

/**
 * Opcional: timeout por llamada
 */
function withTimeout(ms = 20000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(id) };
}

export async function postJSON(path, body, opts = {}) {
  const headers = await withAuthHeaders(opts.headers);
  const { signal, cancel } = withTimeout(opts.timeoutMs || 20000);
  try {
    const res = await fetch(joinUrl(BASE, path), {
      method: "POST",
      headers,
      body: JSON.stringify(body ?? {}),
      signal,
    });
    return await handleResponse(res);
  } finally {
    cancel?.();
  }
}

export async function getJSON(path, opts = {}) {
  const headers = await withAuthHeaders(opts.headers);
  const { signal, cancel } = withTimeout(opts.timeoutMs || 20000);
  try {
    const res = await fetch(joinUrl(BASE, path), {
      method: "GET",
      headers,
      signal,
    });
    return await handleResponse(res);
  } finally {
    cancel?.();
  }
}

/**
 * Helper conveniente para tu página Plan
 * (puedes usarlo o seguir llamando postJSON("/plan", payload) directo)
 */
export function generatePlan(payload) {
  return postJSON("/plan", payload);
}
