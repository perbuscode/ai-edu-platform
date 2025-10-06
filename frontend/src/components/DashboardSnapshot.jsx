import React from "react";
import { useDashboard } from "../context/DashboardProvider";

export default function DashboardSnapshot() {
  const { metrics, courses, skillsMap, loading } = useDashboard();

  if (loading) {
    return <div className="p-4 text-slate-500">Cargando panel…</div>;
  }

  return (
    <div className="space-y-6">
      <section>
        <h3 className="font-semibold mb-2">Métricas</h3>
        {metrics ? (
          <pre className="text-xs bg-slate-900/60 p-3 rounded overflow-auto">
            {JSON.stringify(metrics, null, 2)}
          </pre>
        ) : (
          <div className="text-slate-500">Sin datos de métricas (API no disponible).</div>
        )}
      </section>

      <section>
        <h3 className="font-semibold mb-2">Cursos</h3>
        {Array.isArray(courses) && courses.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {courses.map((c, i) => (
              <li key={i}>{typeof c === "string" ? c : c?.title || JSON.stringify(c)}</li>
            ))}
          </ul>
        ) : (
          <div className="text-slate-500">Sin datos de cursos (API no disponible).</div>
        )}
      </section>

      <section>
        <h3 className="font-semibold mb-2">Mapa de habilidades</h3>
        {skillsMap ? (
          <pre className="text-xs bg-slate-900/60 p-3 rounded overflow-auto">
            {JSON.stringify(skillsMap, null, 2)}
          </pre>
        ) : (
          <div className="text-slate-500">Sin datos del mapa de habilidades (API no disponible).</div>
        )}
      </section>
    </div>
  );
}
