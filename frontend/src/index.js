import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

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
