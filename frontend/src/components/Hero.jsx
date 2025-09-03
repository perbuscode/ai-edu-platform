import React from "react";
import PlanDemoModal from "./PlanDemoModal";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="pt-24 md:pt-28 bg-gradient-to-br from-slate-900 to-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            De “quiero aprender” a “sé hacer” en un plan claro, práctico y guiado.
          </h1>
          <p className="mt-4 text-slate-300 text-lg max-w-xl">
            Solo di la habilidad que quieres aprender para tu empleo o negocio y
            recibirás un plan de estudio personalizado con{" "}
            <span className="text-white font-medium">proyectos reales</span> y{" "}
            <span className="text-white font-medium">mentoría a tu ritmo</span>.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <a
              href="#plan"
              className="inline-block px-6 py-3 rounded-lg bg-sky-600 text-white font-semibold shadow-md hover:bg-sky-500 focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
            >
              🚀 Generar mi plan ahora
            </a>

            {/* Botón que ABRE el modal, con estilo sólido para fondo oscuro */}
            <PlanDemoModal label="📘 Ver plan de ejemplo" variant="solidDark" />
          </div>
        </div>

        <div className="flex md:justify-end">
          <img
            src="/images/hero.png"
            alt="Ilustración de aprendizaje con IA"
            className="w-full max-w-md rounded-3xl shadow-2xl"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
      </div>

      <div className="h-px w-full bg-white/10" />
    </section>
  );
}
