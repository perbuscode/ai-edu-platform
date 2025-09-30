// src/sections/Metrics.jsx
import React, { useEffect, useRef } from "react";
import { useDashboard } from "../context/DashboardProvider";

const Skeleton = () => (
  <div
    className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4 animate-pulse"
    aria-hidden="true"
  >
    {[0, 1, 2, 3].map((index) => (
      <div
        key={index}
        className="rounded-lg border border-slate-200 p-4 space-y-3"
      >
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-7 bg-slate-200 rounded w-1/2" />
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="mt-4 text-slate-500 text-sm" role="status" aria-live="polite">
    No hay datos disponibles.
  </div>
);

const ErrorPanel = ({ msg, onRetry }) => (
  <div
    className="mt-4 text-rose-500 text-sm flex items-center gap-2"
    role="status"
    aria-live="polite"
  >
    <span>Error: {msg}</span>
    <button
      type="button"
      className="underline font-medium text-rose-500 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
      onClick={onRetry}
    >
      Reintentar
    </button>
  </div>
);

export default function Metrics({ observe }) {
  const ref = useRef(null);
  useEffect(() => (observe ? observe(ref.current) : undefined), [observe]);

  const { metrics, loading, error, refresh } = useDashboard();

  const items = metrics
    ? [
        {
          label: "Racha",
          value:
            metrics.streak === 0 || metrics.streak
              ? `${metrics.streak} ${metrics.streak === 1 ? "día" : "días"}`
              : "-",
        },
        {
          label: "Horas esta semana",
          value:
            metrics.hours === 0 || metrics.hours
              ? `${Number(metrics.hours).toFixed(1)} h`
              : "-",
        },
        { label: "Lecciones completadas", value: metrics.lessons ?? "-" },
        { label: "Proyectos entregados", value: metrics.projects ?? "-" },
      ]
    : [];

  let content;
  if (loading) content = <Skeleton />;
  else if (error) content = <ErrorPanel msg={error} onRetry={refresh} />;
  else if (items.length === 0) content = <EmptyState />;
  else
    content = (
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-slate-200 p-4 bg-white"
          >
            <p className="text-sm text-slate-500 min-h-[40px]">{item.label}</p>
            <p className="text-2xl font-bold text-brand-primary whitespace-nowrap">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    );

  return (
    <section
      id="metrics"
      ref={ref}
      className="scroll-mt-20 bg-white rounded-xl shadow-xl border border-slate-200 p-6 text-slate-900"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900">
          Métricas de progreso
        </h3>
      </div>
      <p className="text-sm text-slate-600 mt-1">
        Indicadores para reforzar tu constancia y avance.
      </p>
      {content}
    </section>
  );
}
