import React, { useState } from "react";

export default function PlanPreview({ plan }) {
  if (!plan) return null;

  const {
    title,
    level,
    duration,
    hours,
    focus,
    skill,
    blocks = [],
    summary = [],
    details = { roles: [], note: "" },
  } = plan;

  const [showDetails, setShowDetails] = useState(false);

  return (
    <section className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-2xl">
      {/* Encabezado meta */}
      <div className="px-6 py-5 border-b border-slate-200">
        <h3 className="text-xl md:text-2xl font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600 mt-1">
          Nivel: <span className="font-medium">{level}</span> • Duración:{" "}
          <span className="font-medium">{duration}</span> • Dedicación:{" "}
          <span className="font-medium">{hours}</span> • Enfoque:{" "}
          <span className="font-medium">{focus}</span>
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Habilidad objetivo: <span className="font-medium">{skill}</span>
        </p>
      </div>

      {/* Bloques (módulos) */}
      <div className="p-6 grid md:grid-cols-2 gap-6">
        {blocks.map((b, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 shadow p-5">
            <h4 className="font-semibold text-slate-900">{b.title}</h4>
            <ul className="mt-3 space-y-2 list-disc pl-5 text-sm text-slate-700">
              {b.bullets.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
            <div className="mt-3 text-sm">
              <span className="inline-block rounded-full bg-slate-900 text-white px-2.5 py-1">
                Proyecto: {b.project}
              </span>
            </div>
            <p className="text-sm text-slate-700 mt-3">
              Rol objetivo: <span className="font-medium">{b.role}</span>{" "}
              {b.salaryRef && (
                <span className="text-slate-500">({b.salaryRef} ref.)</span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Resumen de valor */}
      {summary?.length > 0 && (
        <div className="px-6 pb-2">
          <h4 className="font-semibold text-slate-900">Qué te llevas</h4>
          <ul className="mt-2 mb-4 grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-700 list-disc pl-5">
            {summary.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA + Mostrar detalles */}
      <div className="px-6 pb-5 flex flex-wrap gap-3">
        <a
          href="#"
          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800"
          onClick={(e) => {
            e.preventDefault();
            alert("Descarga de PDF (placeholder MVP)");
          }}
        >
          Descargar PDF
        </a>
        <a
          href="#"
          className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-800 hover:bg-slate-50"
          onClick={(e) => {
            e.preventDefault();
            alert("Agendar tutoría (placeholder MVP)");
          }}
        >
          Agendar tutoría
        </a>

        <button
          className="ml-auto px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-800 hover:bg-slate-50"
          onClick={() => setShowDetails((v) => !v)}
          aria-expanded={showDetails}
        >
          {showDetails ? "Ocultar detalle" : "Ver detalle completo"}
        </button>
      </div>

      {/* Detalle expandible: roles/salarios/demanda */}
      {showDetails && (
        <div className="px-6 pb-6">
          <h4 className="font-semibold text-slate-900">Detalle laboral</h4>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-[620px] w-full text-sm">
              <thead>
                <tr className="text-left text-slate-600">
                  <th className="py-2">Rol</th>
                  <th className="py-2">Salario ref.</th>
                  <th className="py-2">Demanda</th>
                  <th className="py-2">Impacto</th>
                </tr>
              </thead>
              <tbody>
                {details.roles.map((r, i) => (
                  <tr key={i} className="border-t border-slate-200">
                    <td className="py-2">{r.role}</td>
                    <td className="py-2">{r.salary}</td>
                    <td className="py-2">{r.demand}</td>
                    <td className="py-2">{r.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {details.note && (
            <p className="text-xs text-slate-500 mt-2">{details.note}</p>
          )}
        </div>
      )}
    </section>
  );
}
