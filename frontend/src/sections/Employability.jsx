// src/sections/Employability.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Employability({ observe }) {
  const ref = useRef(null);
  useEffect(() => (observe ? observe(ref.current) : undefined), [observe]);
  const navigate = useNavigate();
  return (
    <section id="empleo" ref={ref} className="scroll-mt-20 bg-white rounded-xl shadow-xl border border-slate-200 p-6 text-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Empleabilidad</h3>
          <p className="text-sm text-slate-600 mt-1">Convierte tu aprendizaje en resultados profesionales: CV, entrevistas y oportunidades.</p>
        </div>
        {/* Enlace a Skills Wallet eliminado */}
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-slate-200 p-4 flex flex-col gap-3">
          <h4 className="font-medium text-slate-900">Construir mi CV</h4>
          <p className="text-sm text-slate-600 mt-1">Extrae logros y proyectos</p>
          <button
            className="mt-auto px-3 py-2 rounded-lg bg-slate-900 text-white text-sm w-full"
            onClick={() => navigate('/cv')}
          >
            Generar CV
          </button>
        </div>
        <div className="rounded-lg border border-slate-200 p-4 flex flex-col gap-3">
          <h4 className="font-medium text-slate-900">Simular entrevista</h4>
          <p className="text-sm text-slate-600 mt-1">Preguntas técnicas y de negocio.</p>
          <button
            className="mt-auto px-3 py-2 rounded-lg bg-slate-900 text-white text-sm w-full"
            onClick={() => navigate('/practice-interview')}
          >
            Practicar
          </button>
        </div>
        <div className="rounded-lg border border-slate-200 p-4 flex flex-col gap-3">
          <h4 className="font-medium text-slate-900">Portafolio</h4>
          <p className="text-sm text-slate-600 mt-1">Todos tus proyectos y evidencias.</p>
          <button
            className="mt-auto px-3 py-2 rounded-lg bg-slate-900 text-white text-sm w-full"
            onClick={() => navigate('/dashboard/portafolio')}
          >
            Ver Portafolio
          </button>
        </div>
        <div className="rounded-lg border border-slate-200 p-4 flex flex-col gap-3">
          <h4 className="font-medium text-slate-900">Oportunidades</h4>
          <p className="text-sm text-slate-600 mt-1">Ofertas relacionadas a tus skills.</p>
          <a
            className="mt-auto inline-flex items-center justify-center px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm w-full"
            href="https://www.linkedin.com/jobs/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver ofertas
          </a>
        </div>
      </div>

      {/* Navegación inferior eliminada */}
    </section>
  );
}
