// src/sections/Courses.jsx
import React, { useEffect, useMemo, useRef } from "react";

const mockCourses = [
  { id: "frontend", title: "Desarrollo Web Frontend", description: "HTML, CSS, React y patrones.", progress: 68 },
  { id: "powerbi", title: "Master Power BI", description: "ETL, modelado, DAX y storytelling.", progress: 25 },
];

export default function Courses({ observe, courses, onOpenCourse, onOpenCerts }) {
  const ref = useRef(null);
  useEffect(() => (observe ? observe(ref.current) : undefined), [observe]);
  const data = useMemo(() => courses && Array.isArray(courses) ? courses : mockCourses, [courses]);

  return (
    <section id="cursos" ref={ref} className="scroll-mt-20 bg-white rounded-xl shadow-xl border border-slate-200 p-6 text-slate-900">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Mis cursos</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((c) => (
          <article key={c.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-1">{c.title}</h4>
            <p className="text-slate-600 text-sm mb-4">{c.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-emerald-700 font-medium">{c.progress}% completado</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenCourse ? onOpenCourse(c) : null}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-sm font-medium shadow hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 whitespace-nowrap"
                  title="Ver curso"
                >
                  Ver curso
                </button>
                <button
                  onClick={() => {
                    if (onOpenCerts) {
                      onOpenCerts();
                      return;
                    }
                    const el = document.getElementById('certificaciones');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      try { window.history.replaceState(null, '', '#certificaciones'); } catch {}
                    }
                  }}
                  title="Ir a Certificaciones"
                  className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-300 hover:bg-slate-50"
                >
                  Certificado
                </button>
              </div>
            </div>
          </article>
        ))}

        {data.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
            Aún no tienes cursos asignados.
          </div>
        )}
      </div>

      {/* Navegación inferior eliminada */}
    </section>
  );
}
