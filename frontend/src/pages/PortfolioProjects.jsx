// src/pages/PortfolioProjects.jsx
import React from "react";
import DashboardLayout from "../app/DashboardLayout";
import useActiveSection from "../app/useActiveSection";
import FloatingAssistant from "../components/FloatingAssistant";

function ProjectCard({ title, desc, status, ctaLabel = "Ver" }) {
  return (
    <article className="border border-slate-200 rounded-lg overflow-hidden bg-white text-slate-900">
      <div className="h-28 bg-slate-200" />
      <div className="p-4">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-slate-600 mt-1">{desc}</p>
        <div className="mt-3 flex gap-2 items-center">
          {status ? (
            <span className={`px-2 py-1 text-xs rounded-full ${status.bg} ${status.text}`}>{status.label}</span>
          ) : null}
          <button className="ml-auto px-3 py-1.5 text-xs rounded-lg border border-slate-300">{ctaLabel}</button>
        </div>
      </div>
    </article>
  );
}

const mockProjects = [
  { title: "Dashboard de Ventas", desc: "KPIs trimestrales y storytelling.", status: { label: "Aprobado", bg: "bg-emerald-100", text: "text-emerald-800" } },
  { title: "Modelo Financiero", desc: "Análisis de márgenes y proyecciones.", status: { label: "En revisión", bg: "bg-sky-100", text: "text-sky-800" } },
  { title: "Análisis de Churn", desc: "Segmentación y predicción de bajas.", status: { label: "Pendiente", bg: "bg-amber-100", text: "text-amber-800" } },
  { title: "Exploración de Datos", desc: "EDA con insights clave.", status: { label: "Aprobado", bg: "bg-emerald-100", text: "text-emerald-800" } },
  { title: "ETL y Normalización", desc: "Limpieza y transformación.", status: { label: "En revisión", bg: "bg-sky-100", text: "text-sky-800" } },
  { title: "Storytelling Ejecutivo", desc: "Narrativa para comité.", status: { label: "Pendiente", bg: "bg-amber-100", text: "text-amber-800" } },
];

export default function PortfolioProjects() {
  const { activeId } = useActiveSection();
  const links = [];
  return (
    <DashboardLayout links={links} activeId={activeId} onLinkClick={() => {}}>
      <section className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 text-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Portafolio de Proyectos</h3>
            <p className="text-sm text-slate-600 mt-1">Todos tus proyectos realizados y sus estados.</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockProjects.map((p, i) => (
            <ProjectCard key={i} {...p} />
          ))}
        </div>
      </section>
      <FloatingAssistant placement="top-right" strategy="absolute" offsetClass="top-20" />
    </DashboardLayout>
  );
}
