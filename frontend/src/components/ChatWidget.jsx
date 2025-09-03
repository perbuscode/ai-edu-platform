import React, { useState } from "react";
import { FaComments } from "react-icons/fa";

export default function ChatWidget() {
  // Cerrado por defecto 👇
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed z-40 bottom-6 right-6">
      {/* Panel */}
      {open && (
        <div className="mb-3 w-[320px] max-w-[85vw] rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <FaComments /> Soporte
            </div>
            <button
              className="text-slate-500 hover:text-slate-700"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
          <div className="p-4 text-sm text-slate-700">
            ¿Tienes dudas? Escríbenos y te ayudamos a elegir tu ruta de
            aprendizaje.
            <textarea
              rows={3}
              className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Escribe tu mensaje…"
            />
            <button className="mt-3 w-full rounded-lg bg-slate-900 text-white py-2 hover:bg-slate-800">
              Enviar
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        className="rounded-full bg-slate-900 text-white px-4 py-3 shadow-xl hover:bg-slate-800 flex items-center gap-2"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <FaComments />
        ¿Preguntas?
      </button>
    </div>
  );
}
