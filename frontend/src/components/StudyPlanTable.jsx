// src/components/StudyPlanTable.jsx
import React from "react";

const renderDemandIndicators = (level = 0) => {
  const totalSquares = 5;
  const safeLevel = Math.max(0, Math.min(level, totalSquares));
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Demanda ${safeLevel} de ${totalSquares}`}
    >
      {Array.from({ length: totalSquares }).map((_, idx) => (
        <span
          key={idx}
          className={`h-2.5 w-2.5 rounded-sm ${idx < safeLevel ? "bg-slate-900" : "bg-slate-200"}`}
        />
      ))}
    </div>
  );
};

export default function StudyPlanTable({ studyPlan, completedModules }) {
  let moduleIndex = 0;

  return (
    <section className="bg-white text-slate-900 border border-slate-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">
        Plan de estudio
      </h3>
      <div className="space-y-8">
        {studyPlan.map((day, dayIndex) => (
          <article
            key={`${day.day}-${dayIndex}`}
            className="border border-slate-200 rounded-xl overflow-hidden shadow-sm"
          >
            <header className="bg-slate-100 px-4 py-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h4 className="text-base font-semibold text-slate-900">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm bg-slate-900 mr-2"
                  aria-hidden="true"
                />
                {day.day}
              </h4>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total: {day.totalHours}
              </span>
            </header>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-slate-800">
                <thead className="bg-slate-900 text-white text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Tema</th>
                    <th className="px-4 py-3 text-left font-semibold">Horas</th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Habilidad laboral
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Posición objetivo
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Salario (USD/h)
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Demanda
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Impacto
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Completada
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {day.modules.map((module) => {
                    const isCompleted = moduleIndex < completedModules;
                    moduleIndex += 1;
                    return (
                      <tr
                        key={`${day.day}-${module.topic}`}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {module.topic}
                        </td>
                        <td className="px-4 py-3">{module.hours}</td>
                        <td className="px-4 py-3">{module.skill}</td>
                        <td className="px-4 py-3">{module.role}</td>
                        <td className="px-4 py-3">{module.salary}</td>
                        <td className="px-4 py-3">
                          {renderDemandIndicators(module.demand)}
                        </td>
                        <td className="px-4 py-3">{module.impact}</td>
                        <td className="px-4 py-3">
                          {isCompleted ? "Si" : "No"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
