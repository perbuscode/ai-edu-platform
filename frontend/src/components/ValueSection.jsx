// src/components/ValueSection.jsx
import React from "react";

const valueItems = [
  {
    id: "personalization",
    title: "Personalización real",
    desc: "Plan adaptado a tu nivel, objetivos y agenda.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2a10 10 0 100 20 10 10 0 000-20Zm1 5v6h5v2h-7V7h2Z"
        />
      </svg>
    ),
  },
  {
    id: "projects",
    title: "Proyectos reales",
    desc: "Evidencias que demuestran competencia laboral.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3 5h18v2H3V5Zm2 4h14v10H5V9Zm2 2v6h10v-6H7Z"
        />
      </svg>
    ),
  },
  {
    id: "mentorship",
    title: "Tutoría & accountability",
    desc: "Acompañamiento que te guía y corrige rumbo.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 12a5 5 0 100-10 5 5 0 000 10ZM2 20a8 8 0 0116 0v2H2v-2Z"
        />
      </svg>
    ),
  },
  {
    id: "speed",
    title: "Velocidad y claridad",
    desc: "Recibe un roadmap listo, sin perder semanas eligiendo cursos.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4 4h16v4H4V4Zm0 6h10v4H4v-4Zm0 6h7v4H4v-4Z"
        />
      </svg>
    ),
  },
];

export default function ValueSection() {
  return (
    <section className="bg-slate-900 py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Lo que te hace avanzar
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {valueItems.map((it) => (
            <article
              key={it.id}
              className="group relative overflow-hidden rounded-xl p-4 bg-white shadow-lg border border-slate-200/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(120px 60px at 20% 0%, rgba(14,165,233,0.10), transparent 60%), radial-gradient(120px 60px at 80% 0%, rgba(99,102,241,0.10), transparent 60%)",
                }}
              />
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-sky-50 text-sky-600 ring-1 ring-sky-200 group-hover:bg-sky-100 group-hover:text-sky-700 transition-colors duration-300">
                  {it.icon}
                </div>
                <h3 className="font-semibold text-slate-900 text-[15px]">
                  {it.title}
                </h3>
              </div>
              <p className="text-[13px] text-slate-600 mt-2">{it.desc}</p>
              <div className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-sky-200 transition-colors duration-300" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
