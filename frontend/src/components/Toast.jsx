// src/components/Toast.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const ToastContext = createContext(null);

let idSeq = 0;
function createToast(message, type = "info", duration = 3000) {
  return { id: ++idSeq, message, type, duration };
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeouts = useRef(new Map());
  const lastRef = useRef({ msg: null, type: null, at: 0 });

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    const to = timeouts.current.get(id);
    if (to) clearTimeout(to);
    timeouts.current.delete(id);
  }, []);

  const push = useCallback(
    (message, type = "info", duration = 3000) => {
      const now = Date.now();
      const last = lastRef.current;
      if (last.msg === message && last.type === type && now - last.at < 1500) {
        return null; // evitar duplicado inmediato
      }
      const t = createToast(message, type, duration);
      setToasts((prev) => [...prev, t]);
      const to = setTimeout(() => remove(t.id), duration);
      timeouts.current.set(t.id, to);
      lastRef.current = { msg: message, type, at: now };
      return t.id;
    },
    [remove]
  );

  const api = useMemo(
    () => ({
      push,
      info: (m, d) => push(m, "info", d),
      success: (m, d) => push(m, "success", d),
      error: (m, d) => push(m, "error", d),
      // Atajos para errores comunes
      offline: (msg = "Sin conexión a internet") => push(msg, "error", 3500),
      loadError: (msg = "No se pudieron cargar los datos") =>
        push(msg, "error", 3500),
      forbidden: (msg = "Acción no permitida") => push(msg, "error", 3500),
    }),
    [push]
  );

  useEffect(
    () => () => {
      // Limpieza on unmount
      for (const [, to] of timeouts.current) clearTimeout(to);
      timeouts.current.clear();
    },
    []
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Contenedor de toasts */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed z-[120] bottom-4 right-4 flex flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={[
              "pointer-events-auto min-w-[260px] max-w-sm rounded-lg px-4 py-3 shadow-lg text-sm",
              t.type === "success" && "bg-emerald-600 text-white",
              t.type === "error" && "bg-rose-600 text-white",
              t.type === "info" &&
                "bg-slate-800 text-slate-100 border border-white/10",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="flex items-start gap-3">
              <span className="flex-1">{t.message}</span>
              <button
                className="ml-2 text-white/80 hover:text-white"
                onClick={() => remove(t.id)}
                aria-label="Cerrar notificación"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
