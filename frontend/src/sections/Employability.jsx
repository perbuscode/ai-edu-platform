// src/sections/Employability.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Employability({ observe }) {
  const ref = useRef(null);
  useEffect(() => (observe ? observe(ref.current) : undefined), [observe]);
  const navigate = useNavigate();
  const actionButtonClass =
    "mt-auto inline-flex w-full items-center justify-center rounded-lg text-sm font-medium px-3 py-2 min-h-[48px] text-center";
  return (
    <section
      id="empleo"
      ref={ref}
      className="scroll-mt-20 bg-white rounded-xl shadow-xl border border-slate-200 p-6 text-slate-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Empleabilidad
          </h3>
          <p className="text-sm text-slate-600 mt-1 break-words">
            Convierte tu aprendizaje en resultados profesionales: CV,
            entrevistas y oportunidades.
          </p>
        </div>
        {/* Enlace a Skills Wallet eliminado */}
      </div>

      <div className="mt-4 grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        <div className="rounded-lg border border-slate-200 p-4 flex flex-col gap-3">
          <h4 className="font-medium text-slate-900 break-words">
            Construir mi CV
          </h4>
          <p className="text-sm text-slate-600 mt-1 break-words">
            Extrae logros y proyectos
          </p>
          <button
            className={`${actionButtonClass} bg-slate-900 text-white`}
            onClick={() => navigate("/cv")}
          >
            Generar CV
          </button>
        </div>
        <div className="rounded-lg border border-slate-200 p-4 flex flex-col gap-3">
          <h4 className="font-medium text-slate-900 break-words">
            Simular entrevista
          </h4>
          <p className="text-sm text-slate-600 mt-1 break-words">
            Preguntas técnicas y de negocio.
          </p>
          <button
            className={`${actionButtonClass} bg-slate-900 text-white`}
            onClick={() => navigate("/practice-interview")}
          >
            Practicar
          </button>
        </div>
        <div className="rounded-lg border border-slate-200 p-4 flex flex-col gap-3">
          <h4 className="font-medium text-slate-900 break-words">Portafolio</h4>
          <p className="text-sm text-slate-600 mt-1 break-words">
            Todos tus proyectos y evidencias.
          </p>
          <button
            className={`${actionButtonClass} bg-slate-900 text-white`}
            onClick={() => navigate("/dashboard/portafolio")}
          >
            Ver Portafolio
          </button>
        </div>
        <div className="rounded-lg border border-slate-200 p-4 flex flex-col gap-3">
          <h4 className="font-medium text-slate-900 break-words">
            Oportunidades
          </h4>
          <p className="text-sm text-slate-600 mt-1 break-words">
            Ofertas relacionadas a tus skills.
          </p>
          <a
            className={`${actionButtonClass} bg-sky-600 hover:bg-sky-500 text-white`}
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
