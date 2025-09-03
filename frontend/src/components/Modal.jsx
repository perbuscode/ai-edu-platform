import React, { useEffect } from "react";

/**
 * Modal accesible + scroll lock + overlay
 * Props:
 * - open: boolean
 * - title: string (opcional)
 * - onClose: () => void
 * - children: ReactNode
 */
export default function Modal({ open, title, onClose, children }) {
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Contenedor centrado */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            {title ? (
              <h3 id="modal-title" className="text-lg font-semibold text-slate-900">
                {title}
              </h3>
            ) : (
              <span className="sr-only">Modal</span>
            )}
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="rounded-md p-2 hover:bg-slate-100 text-slate-600"
            >
              ✕
            </button>
          </div>

          {/* Contenido con scroll interno */}
          <div className="px-5 py-4 overflow-y-auto max-h-[70vh]">
            {children}
          </div>

          {/* Footer opcional: podemos dejar fuera para mayor flexibilidad */}
        </div>
      </div>
    </div>
  );
}
