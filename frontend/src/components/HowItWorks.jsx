import React from "react";
import { FaRegComments, FaClipboardList, FaBriefcase } from "react-icons/fa";
import PlanDemoModal from "./PlanDemoModal";

export default function HowItWorks() {
  const steps = [
    {
      icon: <FaRegComments className="text-slate-900" />,
      title: "Dinos tu meta",
      desc: "Cuéntanos qué habilidad quieres aprender y tu objetivo (empleo o negocio).",
      tip: "Ej: “Analista de Datos con Python en 12 semanas”.",
    },
    {
      icon: <FaClipboardList className="text-slate-900" />,
      title: "Recibe tu plan",
      desc: "Generamos un plan personalizado con bloques, proyectos y rúbrica clara.",
      tip: "Portafolio desde el primer bloque.",
    },
    {
      icon: <FaBriefcase className="text-slate-900" />,
      title: "Construye portfolio",
      desc: "Completa proyectos, valida tu avance y prepárate para entrevistas.",
      tip: "Incluye CV, LinkedIn y simulacros.",
    },
  ];

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            ¿Cómo funciona?
          </h2>
          <p className="text-slate-600 mt-2">
            En 3 pasos: define tu meta, recibe tu plan y construye evidencia real
            con proyectos. Todo guiado por IA + mentoría.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative rounded-2xl bg-white border border-slate-200 shadow-xl p-6"
            >
              <div className="absolute -top-1 left-0 right-0 h-1.5 rounded-t-2xl bg-sky-400" />
              <div className="size-12 rounded-xl bg-slate-100 grid place-items-center">
                {s.icon}
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{s.desc}</p>
              <p className="text-xs text-slate-500 mt-3">{s.tip}</p>
            </div>
          ))}
        </div>

        {/* CTA doble al final */}
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#plan"
            className="inline-block px-5 py-3 rounded-lg bg-sky-600 text-white font-semibold shadow-md hover:bg-sky-500 focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
          >
            🚀 Generar mi plan ahora
          </a>

          {/* Botón que abre el demo en modal */}
          <PlanDemoModal
            label="Ver plan de ejemplo"
            variant="outline"
          />
        </div>
      </div>
    </section>
  );
}
