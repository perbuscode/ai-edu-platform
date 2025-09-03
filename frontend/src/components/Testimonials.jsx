import React from "react";
import { FaStar } from "react-icons/fa";
import PlanDemoModal from "./PlanDemoModal";

function Stars({ n = 5 }) {
  return (
    <div className="flex gap-1 text-amber-400" aria-label={`${n} estrellas`}>
      {Array.from({ length: n }).map((_, i) => (
        <FaStar key={i} />
      ))}
    </div>
  );
}

function TestimonialCard({ t }) {
  return (
    <article className="relative rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
      {/* Línea acento superior */}
      <div className="absolute -top-1 left-0 right-0 h-1.5 rounded-t-2xl bg-sky-400" />

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          {t.avatar ? (
            <img
              src={t.avatar}
              alt={`Foto de ${t.name}`}
              className="size-12 rounded-full object-cover border border-slate-200"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <div className="size-12 rounded-full bg-slate-200 grid place-items-center text-slate-700 font-semibold">
              {t.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-semibold text-slate-900">{t.name}</h3>
            <span className="text-xs text-slate-500">•</span>
            <p className="text-sm text-slate-600">{t.roleNow}</p>
          </div>

          <p className="mt-3 text-slate-800 leading-relaxed">
            “{t.story}”
          </p>

          <div className="mt-4 flex items-center gap-3">
            <Stars n={5} />
            <span className="text-xs text-slate-500">{t.context}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const data = [
    {
      name: "Laura P.",
      roleNow: "BI Analyst en fintech",
      story:
        "Llegué sin saber nada de Power BI. En 5 semanas tenía un dashboard presentable y dos proyectos en mi portafolio. Me llamaron a entrevista por el proyecto final.",
      context: "Plan: Power BI · 5 semanas",
      avatar: "/images/avatars/laura.jpg",
    },
    {
      name: "Carlos M.",
      roleNow: "Frontend Dev (React) en startup",
      story:
        "El plan me quitó la ansiedad de elegir cursos. Solo seguí los bloques y construí un proyecto por semana. En la entrevista me pidieron el repo del portfolio.",
      context: "Plan: Frontend con React · 8 semanas",
      avatar: "/images/avatars/carlos.jpg",
    },
    {
      name: "Ana G.",
      roleNow: "Emprendedora — ecommerce",
      story:
        "Yo no buscaba empleo, quería vender más. La ruta me dio lo justo: analytics, anuncios y automatizaciones. En 30 días tripliqué visitas con un dashboard simple.",
      context: "Plan: Marketing + NoCode · 4 semanas",
      avatar: "/images/avatars/ana.jpg",
    },
  ];

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Lo que dicen quienes probaron el plan
          </h2>
          <p className="text-slate-600 mt-2">
            Historias reales y enfocadas en resultados: portfolio, entrevistas y crecimiento del negocio.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {data.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>

        {/* CTA al final */}
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#plan"
            className="inline-block px-5 py-3 rounded-lg bg-sky-600 text-white font-semibold shadow-md hover:bg-sky-500 focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
          >
            🚀 Generar mi plan ahora
          </a>

          {/* Ahora abrimos el demo en modal (igual que en HowItWorks) */}
          <PlanDemoModal label="Ver plan de ejemplo" variant="outline" />
        </div>
      </div>
    </section>
  );
}
