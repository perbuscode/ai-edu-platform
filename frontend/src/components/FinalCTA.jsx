import React from "react";
import PlanDemoModal from "./PlanDemoModal";

export default function FinalCTA() {
  return (
    <section className="bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          ¿Listo para convertir “quiero aprender” en “sé hacer”?
        </h2>
        <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
          Pide tu plan personalizado con proyectos reales y mentoría a tu ritmo.
          O mira un ejemplo en 1 minuto.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="#plan"
            className="inline-block px-6 py-3 rounded-lg bg-sky-600 text-white font-semibold shadow-md hover:bg-sky-500 focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
          >
            🚀 Generar mi plan ahora
          </a>

          {/* Botón del demo con fondo sólido en fondo oscuro */}
          <PlanDemoModal label="📘 Ver plan de ejemplo" variant="solidDark" />
        </div>

        <ul className="mt-6 text-slate-400 text-sm space-y-1">
          <li>✔️ Sin costo • Demo real</li>
          <li>✔️ Plan con bloques, proyectos y roles objetivo</li>
          <li>✔️ Descarga y compártelo con tu mentor o equipo</li>
        </ul>
      </div>
    </section>
  );
}
