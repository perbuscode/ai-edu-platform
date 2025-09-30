// src/sections/Portfolio.jsx
import React, { useEffect, useRef } from "react";

function Card({ title, desc, status, actionLabel, actionVariant = "border" }) {
  const variant =
    actionVariant === "fill"
      ? "bg-slate-900 text-white"
      : "border border-slate-300 text-slate-800";
  return (
    <article className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="h-28 bg-slate-200" />
      <div className="p-4">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-slate-600 mt-1">{desc}</p>
        <div className="mt-3 flex gap-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${status.bg} ${status.text}`}
          >
            {status.label}
          </span>
          <button className={`px-3 py-1.5 text-xs rounded-lg ${variant}`}>
            {actionLabel}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Portfolio({ observe }) {
  const ref = useRef(null);
  useEffect(() => (observe ? observe(ref.current) : undefined), [observe]);
  return (
    <section
      id="portafolio"
      ref={ref}
      className="scroll-mt-20 bg-white rounded-xl shadow-xl border border-slate-200 p-6 text-slate-900"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Portafolio</h3>
          <p className="text-sm text-slate-600 mt-1">
            Evidencias reales para tu CV y entrevistas.
          </p>
        </div>
        <a href="#tutor" className="text-sm text-slate-700 hover:underline">
          Siguiente: Tutor IA
        </a>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          title="Dashboard de Ventas"
          desc="KPIs trimestrales y storytelling."
          status={{
            label: "Aprobado",
            bg: "bg-emerald-100",
            text: "text-emerald-800",
          }}
          actionLabel="Descargar"
        />
        <Card
          title="Modelo Financiero"
          desc="Análisis de márgenes y proyecciones."
          status={{
            label: "En revisión",
            bg: "bg-sky-100",
            text: "text-sky-800",
          }}
          actionLabel="Ver entrega"
        />
        <Card
          title="Análisis de Churn"
          desc="Segmentación y predicción de bajas."
          status={{
            label: "Pendiente",
            bg: "bg-amber-100",
            text: "text-amber-800",
          }}
          actionLabel="Subir"
          actionVariant="fill"
        />
      </div>

      {/* Navegación inferior eliminada */}
    </section>
  );
}
