// src/utils/api.js
import { getAuth } from 'firebase/auth';

const BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5050';

async function withAuthHeaders(headers = {}) {
  const result = { 'Content-Type': 'application/json', ...headers };
  try {
    const user = getAuth()?.currentUser;
    if (user) {
      const token = await user.getIdToken();
      result.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return result;
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || data?.message || 'Error en la solicitud';
    const error = new Error(msg);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export async function postJSON(path, body, opts = {}) {
  const headers = await withAuthHeaders(opts.headers);
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function getJSON(path, opts = {}) {
  const headers = await withAuthHeaders(opts.headers);
  const res = await fetch(`${BASE}${path}`, {
    method: 'GET',
    headers,
  });
  return handleResponse(res);
}
