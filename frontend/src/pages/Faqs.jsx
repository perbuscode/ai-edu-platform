// src/pages/Faqs.jsx
import React from "react";

const QAS = [
  {
    q: "¿El plan es genérico?",
    a: "No. Adaptamos nivel, tiempo/semana, estilo y meta (empleo/negocio).",
  },
  {
    q: "¿El certificado sirve?",
    a: "Tu portfolio y dominio evaluado suman valor; entregamos certificado + evidencias.",
  },
  {
    q: "¿Solo IA?",
    a: "IA para personalización y velocidad; rúbricas + curaduría humana para calidad.",
  },
  {
    q: "¿Y si me estanco?",
    a: "Tutoría detecta bloqueos, re-explica y ajusta plan. Accountability semanal.",
  },
  {
    q: "¿Puedo cambiar de objetivo?",
    a: "Sí, recalculamos tu plan según nuevas metas.",
  },
  {
    q: "¿Cuánto tarda el plan?",
    a: "Depende de tus horas/semana y objetivo. Típico: 6–12 semanas.",
  },
  {
    q: "¿Qué tan personalizado es?",
    a: "Ajustamos contenidos, proyectos y evaluación según tu contexto.",
  },
  {
    q: "¿Qué nivel necesito para empezar?",
    a: "Desde cero hasta avanzado: ajustamos ritmo y materiales a tu punto de partida.",
  },
  {
    q: "¿Hay garantía?",
    a: "Si no te resulta útil en la primera semana, te ayudamos a reencaminar o devolvemos tu dinero (7 días).",
  },
  {
    q: "¿Necesito una computadora potente?",
    a: "No. Con navegador moderno es suficiente para la mayoría de actividades.",
  },
  {
    q: "¿Puedo pausar y retomar luego?",
    a: "Sí, puedes pausar y reagendar. Guardamos tu progreso y siguientes pasos.",
  },
  {
    q: "¿Cómo se evalúa mi progreso?",
    a: "Usamos rúbricas claras, revisiones semanales y proyectos con entregables verificables.",
  },
  {
    q: "¿Incluye comunidad y soporte?",
    a: "Sí, acceso a comunidad privada, sesiones grupales y soporte por chat.",
  },
  {
    q: "¿Puedo combinar cursos?",
    a: "Sí, armamos un plan que combine habilidades según tu objetivo (ej. datos + presentación).",
  },
];

export default function Faqs() {
  return (
    <main className="pt-24 md:pt-28 bg-slate-900 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <h1 className="text-3xl font-bold text-white">Preguntas frecuentes</h1>
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 divide-y">
          {QAS.map((qa, i) => (
            <details key={i} className="group p-4">
              <summary className="cursor-pointer select-none list-none font-medium text-slate-900 flex items-center justify-between rounded-md focus-visible:ring-2 focus-visible:ring-sky-500">
                <span>{qa.q}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="ml-3 text-slate-400 transition-transform duration-200 group-open:rotate-180 group-open:text-sky-600"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </summary>
              <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-open:max-h-96 group-open:opacity-100">
                <p className="mt-2 text-slate-700">{qa.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}
