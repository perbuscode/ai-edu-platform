// src/components/PlanExampleModal.jsx
import React from "react";
import Modal from "./Modal";

// Modal de plan: muestra un plan dinámico si se provee, o un ejemplo por defecto
export default function PlanExampleModal({ open, onClose, plan: givenPlan }) {
  const fallback = {
    title: "Analista de Datos con Power BI (Profesional · 10 semanas)",
    goal: "Prepararte para un rol de BI Analyst",
    level: "Profesional",
    hoursPerWeek: 8,
    durationWeeks: 10,
    blocks: [
      { title: "Fundamentos & ETL", bullets: ["Power Query", "Modelo de datos", "Calendario & Time Intelligence"], project: "Dashboard de Ventas", role: "Jr. BI Analyst" },
      { title: "DAX & Storytelling", bullets: ["Medidas clave", "CALCULATE/FILTER", "Bookmarks/Tooltips"], project: "Dashboard Financiero", role: "BI Analyst" },
      { title: "Avanzado & Gobierno", bullets: ["RLS", "Automatización", "Optimización"], project: "RRHH Ejecutivo", role: "BI Developer" },
    ],
    rubric: [
      { criterion: "Limpieza de datos (ETL)", level: "A/B/C" },
      { criterion: "KPIs correctos con DAX", level: "A/B/C" },
      { criterion: "Storytelling y UX ejecutiva", level: "A/B/C" },
    ],
  };
  const plan = givenPlan || fallback;

  return (
    <Modal open={open} onClose={onClose} title={givenPlan ? "Tu plan personalizado" : "Plan de ejemplo"}>
      <div className="space-y-4">
        <div>
          <h4 className="text-slate-900 font-semibold">{plan.title}</h4>
          <p className="text-sm text-slate-600 mt-1">
            Meta: {plan.goal} · Nivel: {plan.level} · {plan.hoursPerWeek} h/semana · {plan.durationWeeks} semanas
          </p>
        </div>

        {Array.isArray(plan.blocks) && plan.blocks.length > 0 && (
          <div className="space-y-3">
            <h5 className="font-semibold text-slate-900">Bloques</h5>
            {plan.blocks.map((b, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-4">
                <div className="font-medium text-slate-900">{b.title}</div>
                {Array.isArray(b.bullets) && (
                  <ul className="list-disc pl-5 mt-2 text-sm text-slate-700 space-y-1">
                    {b.bullets.map((x, j) => <li key={j}>{x}</li>)}
                  </ul>
                )}
                {(b.project || b.role) && (
                  <div className="mt-2 text-sm text-slate-600">
                    {b.project && (<div><span className="text-slate-500">Proyecto:</span> {b.project}</div>)}
                    {b.role && (<div><span className="text-slate-500">Rol:</span> {b.role}</div>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {Array.isArray(plan.rubric) && plan.rubric.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-semibold text-slate-900">Rúbrica</h5>
            <ul className="space-y-2">
              {plan.rubric.map((r, i) => (
                <li key={i} className="border border-slate-200 rounded-xl p-3">
                  <div className="text-sm text-slate-900 font-medium">{r.criterion}</div>
                  <div className="text-xs text-slate-600">Nivel: {r.level}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}

