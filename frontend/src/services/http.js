// src/services/http.js
const ENV_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.VITE_API_BASE ||
  "http://localhost:5050"; // backend directo por defecto

const BASE = ENV_BASE;

export async function api(path, init = {}) {
  const url = /^https?:\/\//i.test(path) ? path : `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...(init.headers || {}) },
      ...init,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const err = new Error(`[api] ${res.status} ${res.statusText} @ ${url} ${text ? `- ${text}` : ""}`);
      err.status = res.status;
      err.body = text;
      throw err;
    }
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? await res.json() : await res.text();
  } catch (e) {
    console.warn(e.message || e);
    throw e;
  }
}

export async function safeJsonFetch(path, init) {
  try {
    const data = await api(path, init);
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    console.warn(`[safeJsonFetch] fallback null for ${path}`);
    return null;
  }
}