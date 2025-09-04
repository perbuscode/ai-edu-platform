// src/components/Hero.jsx
import React from "react";

export default function Hero({ onOpenExample }) {
  return (
    <section
      id="inicio"
      className="pt-24 md:pt-28 bg-gradient-to-br from-slate-900 to-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 grid md:grid-cols-2 gap-10 items-center">
        {/* Texto principal */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            De “quiero aprender” a “sé hacer” en un plan claro, práctico y guiado.
          </h1>
          <p className="mt-4 text-slate-300 text-lg max-w-xl mx-auto md:mx-0">
            Solo di la habilidad que quieres aprender para el empleo o empresa que quieras lograr y te entregamos un plan de estudio personalizado con{" "}
            <span className="text-white font-medium">proyectos reales que evidencian tu conocimiento</span> y una{" "}
            <span className="text-white font-medium">mentoría personalizada que va a tu ritmo</span>.
          </p>

          <div className="mt-6 flex gap-3 justify-center md:justify-start flex-wrap">
            <a
              href="#plan"
              className="inline-block px-6 py-3 rounded-lg bg-sky-600 text-white font-semibold shadow-md hover:bg-sky-500 focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
            >
              🚀 Generar mi plan ahora
            </a>
            <button
              onClick={onOpenExample}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-900 shadow-md focus:outline-none focus:ring-2 focus:ring-white/40 transition-[padding] duration-200 hover:px-7"
            >
              <span className="absolute inset-y-0 left-0 w-0 bg-sky-600 transition-all duration-300 group-hover:w-full" />
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Ver plan de ejemplo</span>
            </button>
          </div>
        </div>

        {/* Imagen del hero */}
        <div className="flex justify-center md:justify-end">
          <img
            src="/images/hero.png"
            alt="Ilustración principal con cohete"
            className="w-full max-w-lg mx-auto"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </div>
      </div>

      <div className="h-px w-full bg-white/10" />
    </section>
  );
}
