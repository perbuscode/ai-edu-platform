import React, { useState } from "react";
import Modal from "./Modal";
import PlanPreview from "./PlanPreview";

export default function PlanDemoModal({
  label = "Ver plan de ejemplo",
  variant = "outline", // "primary" | "outline" | "outlineDark" | "solidDark"
  className = "",
}) {
  const [open, setOpen] = useState(false);

  const btnBase =
    "inline-block px-5 py-3 rounded-lg text-sm font-medium transition focus:outline-none";
  const stylesMap = {
    primary:
      "bg-sky-600 text-white shadow-md hover:bg-sky-500 focus:ring-2 focus:ring-sky-400",
    outline:
      "border border-slate-300 text-slate-800 hover:bg-slate-50",
    outlineDark:
      "border border-white/40 text-white hover:bg-white/10",
    solidDark:
      "bg-slate-700 text-white shadow-md hover:bg-slate-600 focus:ring-2 focus:ring-slate-400",
  };
  const styles = stylesMap[variant] || stylesMap.outline;

  const planDemo = {
    title: "Master en Power BI · Intensivo (70h · 5 días)",
    level: "Profesional",
    duration: "5 días · 70h",
    hours: "Tiempo completo (intensivo)",
    focus: "Mixto",
    skill: "Power BI",
    blocks: [
      {
        title: "Bloque 1 — Fundamentos de Power BI",
        bullets: [
          "Conexión a datos, Power Query (ETL) y modelo relacional",
          "Combinar/anexar, tablas calendario y jerarquías",
          "Visualizaciones básicas, filtros/segmentadores y UX",
          "Publicación y compartido (Power BI Service)",
        ],
        project: "Dashboard de Ventas Operativas",
        role: "Jr. BI Analyst",
        salaryRef: "$20–30/h",
      },
      {
        title: "Bloque 2 — DAX + Dashboard Profesional",
        bullets: [
          "DAX básico (SUM, AVERAGE), CALCULATE y FILTER",
          "Columnas vs medidas, tablas/matrices, visuales intermedios",
          "Bookmarks, tooltips, drillthrough y storytelling",
          "Exportación e integración",
        ],
        project: "Dashboard Financiero Interactivo",
        role: "BI Analyst",
        salaryRef: "$35–50/h",
      },
      {
        title: "Bloque 3 — DAX Avanzado + Seguridad + Automatización",
        bullets: [
          "DAX avanzado (SUMX, RANKX), Time Intelligence",
          "RLS (seguridad por roles) y optimización",
          "Automatización (refresh/gateway), SQL y APIs",
        ],
        project: "Dashboard Ejecutivo RRHH",
        role: "BI Developer",
        salaryRef: "$45–65/h",
      },
      {
        title: "Bloque 4 — IA + Python + Power Platform",
        bullets: [
          "Power BI Copilot / Q&A, Text Analytics / Sentimiento",
          "Python en Power BI y Azure ML",
          "Power Automate + BI, clustering y anomalías",
        ],
        project: "Dashboard Predictivo de Clientes",
        role: "Data Scientist Jr.",
        salaryRef: "$55–75/h",
      },
      {
        title: "Bloque 5 — Proyecto Master Final",
        bullets: [
          "Caso real multinacional: requerimientos y arquitectura",
          "Modelo multifuente, ETL, DAX complejo, RLS + automatización",
          "Visualización pro, IA integrada, storytelling ejecutivo",
          "Presentación final",
        ],
        project: "Proyecto Master Final",
        role: "BI Consultant / BI Lead",
        salaryRef: "$60–85/h",
      },
    ],
    summary: [
      "Portafolio listo desde el Bloque 1",
      "Preparación para roles de Jr. a Lead",
      "Validación con proyectos y rúbrica pública",
    ],
    details: {
      roles: [
        { role: "Jr. BI Analyst", salary: "$20–30/h", demand: "⭐⭐⭐", impact: "Base para empleo inicial" },
        { role: "BI Analyst", salary: "$35–50/h", demand: "⭐⭐⭐⭐", impact: "KPIs y storytelling" },
        { role: "BI Developer", salary: "$45–65/h", demand: "⭐⭐⭐⭐", impact: "Modelado, DAX y performance" },
        { role: "Data Scientist Jr.", salary: "$55–75/h", demand: "⭐⭐⭐⭐", impact: "IA aplicada en BI" },
        { role: "BI Consultant / Lead", salary: "$60–85/h", demand: "⭐⭐⭐", impact: "Arquitectura y gobierno" },
      ],
      note: "Rangos salariales y demanda son referenciales por mercado y seniority. No constituyen garantía de empleo.",
    },
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${btnBase} ${styles} ${className}`}
      >
        {label}
      </button>

      <Modal
        open={open}
        title="Plan de ejemplo — Master en Power BI"
        onClose={() => setOpen(false)}
      >
        <PlanPreview plan={planDemo} />
        <div className="mt-4 flex gap-3">
          <a
            href="#plan"
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800"
            onClick={() => setOpen(false)}
          >
            Generar mi propio plan
          </a>
          <button
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-800 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </>
  );
}
