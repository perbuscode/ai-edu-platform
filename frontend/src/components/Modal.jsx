import React, { useEffect, useRef, useId, useCallback } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([type='hidden']):not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export default function Modal({ open, title, onClose, children }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const titleId = useId();

  const handleKeyDown = useCallback(
    (event) => {
      if (!open) return;

      // Cerrar con Escape
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      // Trap de Tab
      if (event.key !== "Tab") return;

      const dialogNode = dialogRef.current;
      if (!dialogNode) return;

      const focusable = dialogNode.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) {
        event.preventDefault();
        dialogNode.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [open, onClose]
  );

  // Foco inicial y restauración
  useEffect(() => {
    if (!open) return undefined;

    previousFocusRef.current = document.activeElement;

    requestAnimationFrame(() => {
      const dialogNode = dialogRef.current;
      if (!dialogNode) return;
      const focusable = dialogNode.querySelectorAll(FOCUSABLE_SELECTOR);
      const target = closeButtonRef.current || focusable[0] || dialogNode;
      target?.focus();
    });

    return () => {
      if (
        previousFocusRef.current &&
        typeof previousFocusRef.current.focus === "function"
      ) {
        previousFocusRef.current.focus();
      }
    };
  }, [open]);

  // Listener global para teclado (evita onKeyDown en elementos no interactivos)
  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      {/* Overlay: interactivo pero no focuseable ni anunciado */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50 w-full h-full cursor-default"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
        role="document"
      >
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 id={titleId} className="text-lg font-semibold text-slate-900">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Cerrar modal"
            ref={closeButtonRef}
          >
            &times;
          </button>
        </div>
        <div className="px-5 py-4 max-h-[70vh] overflow-auto">{children}</div>
      </div>
    </div>
  );
}
