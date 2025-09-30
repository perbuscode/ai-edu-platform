import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { DashboardProvider } from "./context/DashboardProvider";
import { initTheme } from "./theme/applyTheme";

// Aplica tema antes del primer render para evitar flash
initTheme();

// Interceptor global para enlaces con hash: scroll suave a secciones
document.addEventListener("click", (e) => {
  const anchor =
    e.target &&
    e.target.closest &&
    e.target.closest('a[href^="#"], a[href^="/#"]');
  if (!anchor) return;
  const href = anchor.getAttribute("href") || "";
  // Caso 1: enlaces internos del mismo documento (#id): prevenimos y hacemos scroll
  if (href.startsWith("#")) {
    if (href === "#" || href.length < 2) return;
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    try {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      window.location.hash = href;
    }
    return;
  }
  // Caso 2: enlaces a "/#id" (navegan a la landing): dejamos que React Router maneje
  // y App.js aplicará el scroll al detectar el hash tras el cambio de ruta.
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
            <DashboardProvider>
              <App />
            </DashboardProvider>
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
