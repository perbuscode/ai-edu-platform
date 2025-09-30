// src/sections/TutorIA.jsx
import React, { useEffect, useRef } from "react";

export default function TutorIA({ observe }) {
  const ref = useRef(null);
  useEffect(() => (observe ? observe(ref.current) : undefined), [observe]);
  return (
    <section
      id="tutor"
      ref={ref}
      className="scroll-mt-20 bg-white rounded-xl shadow-xl border border-slate-200 p-6 text-slate-900"
    >
      <h3 className="text-lg font-semibold text-slate-900">Tutor IA</h3>
      <p className="text-sm text-slate-600 mt-1">
        Asistencia conversacional: pistas, reexplicaciones, quizzes… y Co-pilot
        de proyectos.
      </p>

      {/* Tabs simplificadas */}
      <div className="mt-4 border-b border-slate-200 flex gap-4 text-sm">
        <button
          className="px-2 py-2 border-b-2 border-slate-900 font-medium"
          aria-pressed="true"
        >
          Chat
        </button>
      </div>

      {/* Chat */}
      <div className="mt-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 grid place-items-center text-slate-600">
            IA
          </div>
          <div className="bg-slate-100 text-slate-800 rounded-lg px-3 py-2 text-sm">
            Te recomiendo repasar “Contexto de filtro en DAX” antes del quiz.
            ¿Quieres un resumen?
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Escribe tu mensaje…"
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <button className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm">
            Enviar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-2.5 py-1.5 rounded-full border border-slate-300 text-slate-800 text-xs">
            Dame una pista
          </button>
          <button className="px-2.5 py-1.5 rounded-full border border-slate-300 text-slate-800 text-xs">
            Explícame de nuevo
          </button>
          <button className="px-2.5 py-1.5 rounded-full border border-slate-300 text-slate-800 text-xs">
            Quiz de práctica
          </button>
        </div>
      </div>

      {/* Navegación inferior eliminada */}
    </section>
  );
}
