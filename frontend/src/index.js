import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { initTheme } from "./theme/applyTheme";

// Aplica tema antes del primer render para evitar flash
initTheme();

// Interceptor global para enlaces con hash: scroll suave a secciones
document.addEventListener('click', (e) => {
  const anchor = e.target && e.target.closest && e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const href = anchor.getAttribute('href');
  if (!href || href === '#' || href.length < 2) return;
  const id = href.slice(1);
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  catch { window.location.hash = href; }
});

// Logs de diagnóstico para detectar instalaciones duplicadas de React
// y confirmar versión en tiempo de ejecución.
// No afecta a producción (CRA elimina console.* en build si configuras minifier accordingly).
// eslint-disable-next-line no-console
console.log("[Diag] React version:", React.version);

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
