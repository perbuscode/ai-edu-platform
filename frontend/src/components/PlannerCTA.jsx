import React, { useState } from "react";

export default function PlannerCTA() {
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("Profesional");

  function handleQuickFill(text) {
    setSkill(text);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!skill.trim()) {
      alert("Escribe una habilidad para generar tu plan de estudio.");
      return;
    }
    // MVP: placeholder. Aquí luego conectaremos con el backend/worker.
    alert(`Generando plan de estudio para: "${skill}" (Nivel: ${level})`);
  }

  const examples = [
    "Desarrollador Frontend con React",
    "Analista de Datos con Python",
    "Marketing Digital orientado a e-commerce",
    "Inglés B2 para negocios",
  ];

  return (
    <section id="plan" className="bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Cabecera corta */}
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Pide tu plan de estudio con IA
          </h2>
          <p className="text-slate-300 mt-2">
            <span className="font-medium text-white">Solo di qué habilidad quieres aprender</span>{" "}
            y nosotros te preparamos un plan de estudio **técnico, profesional o máster**, con
            clases, proyectos y evaluación.
          </p>
        </div>

        {/* Card principal */}
        <div className="mt-8 bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 md:p-8">
          {/* Pasos cortos */}
          <ol className="flex flex-col md:flex-row gap-3 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center size-6 rounded-full bg-slate-900 text-white text-xs font-semibold">1</span>
              Escribe la habilidad
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center size-6 rounded-full bg-slate-900 text-white text-xs font-semibold">2</span>
              Elige el nivel
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center size-6 rounded-full bg-slate-900 text-white text-xs font-semibold">3</span>
              Obtén tu plan en segundos
            </li>
          </ol>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 grid md:grid-cols-[1fr,220px,140px] gap-3">
            <input
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder='Ej: "Analista de Datos con Python" o "Inglés B2 para negocios"'
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />

            <select
              className="rounded-lg border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-slate-300"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option>Técnico</option>
              <option>Profesional</option>
              <option>Máster</option>
            </select>

            <button
              type="submit"
              className="rounded-lg bg-slate-900 text-white font-medium px-4 py-3 hover:bg-slate-800"
            >
              Generar plan
            </button>
          </form>

          {/* Sugerencias rápidas */}
          <div className="mt-4 flex flex-wrap gap-2">
            {examples.map((ex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickFill(ex)}
                className="px-3 py-1.5 rounded-full border border-slate-300 text-sm text-slate-700 hover:bg-slate-50"
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Nota MVP */}
          <p className="text-xs text-slate-500 mt-4">
            *MVP: esta demo muestra un aviso. En la siguiente iteración conectaremos con el motor de generación para crear el plan completo (módulos, calendario, proyectos y evaluación).
          </p>
        </div>
      </div>
    </section>
  );
}
