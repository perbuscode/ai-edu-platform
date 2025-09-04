// src/components/FAQ.jsx
import React, { useState } from "react";

const QAS = [
  { q: "¿El plan es genérico?", a: "No. Adaptamos nivel, tiempo/semana, estilo y meta (empleo/negocio)." },
  { q: "¿El certificado sirve?", a: "El valor está en tu portfolio y dominio evaluado. Damos certificado + evidencia." },
  { q: "¿Solo IA?", a: "IA para personalización/velocidad; rúbricas y curaduría humana para calidad." },
  { q: "¿Y si me estanco?", a: "Tutoría detecta bloqueos, re-explica y ajusta plan. Accountability semanal." },
];

export default function FAQ() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[70] px-4 py-3 rounded-full bg-sky-600 text-white shadow-xl border border-sky-500 hover:bg-sky-500 transition"
          aria-label="Abrir preguntas frecuentes"
        >
          ¿Dudas?
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-[70] w-[320px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="font-semibold text-slate-900">Preguntas frecuentes</div>
            <button
              className="text-slate-600 hover:bg-slate-100 rounded-lg p-1"
              onClick={() => setOpen(false)}
              aria-label="Cerrar preguntas frecuentes"
            >
              ✕
            </button>
          </div>
          <div className="max-h-[50vh] overflow-auto px-4 py-3 space-y-3">
            {QAS.map((qa, i) => (
              <div key={i}>
                <div className="text-sm font-medium text-slate-900">{qa.q}</div>
                <div className="text-sm text-slate-700">{qa.a}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
