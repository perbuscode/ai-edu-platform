// src/sections/Metrics.jsx
import React, { useEffect, useRef } from "react";

const metricsMock = [
  { label: "Racha", value: "3 días" },
  { label: "Horas esta semana", value: "2.5 h" },
  { label: "Lecciones completadas", value: "7" },
  { label: "Proyectos entregados", value: "2" },
];

export default function Metrics({ observe, data = metricsMock }) {
  const ref = useRef(null);
  useEffect(() => (observe ? observe(ref.current) : undefined), [observe]);
  return (
    <section id="metrics" ref={ref} className="scroll-mt-20 bg-white rounded-xl shadow-xl border border-slate-200 p-6 text-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Métricas de progreso</h3>
      </div>
      <p className="text-sm text-slate-600 mt-1">Indicadores para reforzar tu constancia y avance.</p>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
        {data.map((m, i) => (
          <div key={i} className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm text-slate-500">{m.label}</p>
            <p className="text-2xl font-bold text-slate-900">{m.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
