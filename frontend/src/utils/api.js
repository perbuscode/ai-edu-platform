// src/utils/api.js
import { getAuth } from 'firebase/auth';

const BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5050';

export async function postJSON(path, body, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  // Intenta incluir ID token de Firebase si hay usuario
  try {
    const user = getAuth()?.currentUser;
    if (user) {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {}

  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || 'Error en la solicitud';
    const e = new Error(msg);
    e.status = res.status;
    e.data = data;
    throw e;
  }
  return data;
}

