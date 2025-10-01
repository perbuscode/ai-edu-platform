// frontend/netlify/functions/plan.js
// Proxy del endpoint /plan de tu backend para evitar CORS.
// Necesitas en Netlify una env var: BACKEND_BASE = https://tu-backend.com  (SIN barra final)

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const backendBase = process.env.BACKEND_BASE;
    if (!backendBase) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Falta env BACKEND_BASE en Netlify" }),
      };
    }

    const url = `${backendBase}/plan`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: event.body || "{}", // reenvía el JSON que venía del frontend
    });

    const text = await res.text(); // podría ser JSON o texto
    return {
      statusCode: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json",
      },
      body: text,
    };
  } catch (err) {
    console.error("plan proxy error:", err);
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Proxy error: " + err.message }),
    };
  }
};
