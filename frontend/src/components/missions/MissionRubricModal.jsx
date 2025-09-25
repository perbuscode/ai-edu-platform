// src/components/missions/MissionRubricModal.jsx
import React, { useEffect, useRef } from "react";

export default function MissionRubricModal({ open, onClose, mission }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timeout = setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [open, onClose]);

  if (!open || !mission) {
    return null;
  }

  const rubric = mission.rubric || { criteria: [] };
  const criteria = rubric.criteria || [];
  const dataset = mission.dataset || [];
  const tasks = mission.tasks || [];
  const reflection = mission.reflection || [];
  const resources = mission.resources || [];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/50 px-4" role="dialog" aria-modal="true">
      <div ref={dialogRef} tabIndex={-1} className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 focus:outline-none overflow-y-auto max-h-[90vh] relative z-[130]">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Rubrica: {mission.title}</h2>
            {mission.objective && <p className="text-sm text-slate-600 mt-1">Objetivo: {mission.objective}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              {mission.duration && <span className="inline-flex px-2 py-1 rounded-full bg-white text-slate-900 border border-slate-200">Duracion {mission.duration}</span>}
              {mission.impact && <span className="inline-flex px-2 py-1 rounded-full bg-white text-slate-900 border border-slate-200">{mission.impact}</span>}
              {mission.skillPoints != null && <span className="inline-flex px-2 py-1 rounded-full bg-white text-slate-900 border border-slate-200">{mission.skillPoints} pts habilidad</span>}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onClose?.()}
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm"
          >
            Cerrar
          </button>
        </div>

        {(dataset.length > 0 || tasks.length > 0) && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {dataset.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Datos de partida</h3>
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  {dataset.map((item, index) => (
                    <li key={`${mission.id}-dataset-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {tasks.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Pasos sugeridos</h3>
                <ol className="mt-2 space-y-2 text-sm text-slate-600 list-decimal list-inside">
                  {tasks.map((item, index) => (
                    <li key={`${mission.id}-task-${index}`}>{item}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {reflection.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Preguntas de reflexion</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 list-disc list-inside">
              {reflection.map((item, index) => (
                <li key={`${mission.id}-reflection-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Rubrica de ejemplo</h3>
          {rubric.intro && <p className="text-sm text-slate-600 mt-1">{rubric.intro}</p>}
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm text-slate-800 border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Dimension</th>
                  <th className="px-4 py-3 text-left font-semibold">Basico</th>
                  <th className="px-4 py-3 text-left font-semibold">Intermedio</th>
                  <th className="px-4 py-3 text-left font-semibold">Avanzado</th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((criterion, index) => (
                  <tr key={`${mission.id}-criterion-${index}`} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium text-slate-900">{criterion.dimension}</td>
                    <td className="px-4 py-3 text-slate-700">{criterion.basic}</td>
                    <td className="px-4 py-3 text-slate-700">{criterion.proficient}</td>
                    <td className="px-4 py-3 text-slate-700">{criterion.advanced}</td>
                  </tr>
                ))}
                {criteria.length === 0 && (
                  <tr>
                    <td className="px-4 py-3 text-slate-600" colSpan={4}>No hay criterios de rubrica configurados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {resources.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Recursos sugeridos</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 list-disc list-inside">
              {resources.map((resource, index) => (
                <li key={`${mission.id}-resource-${index}`}>
                  {resource.url ? (
                    <a href={resource.url} target="_blank" rel="noreferrer" className="text-sky-600 hover:text-sky-500">
                      {resource.label || resource.url}
                    </a>
                  ) : (
                    resource.label
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}



