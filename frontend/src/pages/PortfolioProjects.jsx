// src/pages/PortfolioProjects.jsx
import React, { useMemo, useState } from "react";
import Topbar from "../components/Topbar";
import {
  mockProjects as projects,
  mockProjectDetails as sampleDetails,
} from "../data/projects.mock";

function ProjectCard({ project, onPreview }) {
  return (
    <article className="border border-slate-200 rounded-2xl bg-white shadow-sm p-5 flex flex-col gap-3">
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-slate-600">{project.desc}</p>
      </div>
      <div className="flex items-center gap-2">
        {project.status && (
          <span
            className={`px-2 py-1 text-xs rounded-full ${project.status.bg} ${project.status.text}`}
          >
            {project.status.label}
          </span>
        )}
        <button
          onClick={() => onPreview(project)}
          className="ml-auto px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Ver proyecto
        </button>
      </div>
    </article>
  );
}

export default function PortfolioProjects() {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const details = useMemo(
    () => ({
      title: selected?.title || sampleDetails.goal,
      goal: sampleDetails.goal,
      impact: sampleDetails.impact,
      stack: sampleDetails.stack,
      metrics: sampleDetails.metrics,
    }),
    [selected]
  );

  const closeModal = () => {
    setOpen(false);
    setSelected(null);
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100">
      <Topbar leftOffsetClass="left-0" showLogo title="Portafolio" />
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-6">
          <section className="bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  Portafolio de proyectos
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Comparte dashboards, modelos y casos de negocio listos para
                  mostrar a reclutadores.
                </p>
              </div>
              <button className="px-3 py-2 rounded-lg bg-slate-900 text-sm text-white hover:bg-slate-800">
                Agregar nuevo
              </button>
            </header>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  onPreview={(item) => {
                    setSelected(item);
                    setOpen(true);
                  }}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-3xl w-full rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Vista previa
                </p>
                <h2 className="text-lg font-semibold text-slate-900">
                  {details.title}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cerrar
              </button>
            </div>
            <div className="px-6 py-5 space-y-5 text-sm text-slate-700">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Objetivo
                </h3>
                <p className="mt-1 text-sm text-slate-700">{details.goal}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Impacto logrado
                </h3>
                <ul className="mt-2 space-y-2 list-disc pl-5">
                  {details.impact.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Stack utilizado
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {details.stack.map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-1 rounded-lg bg-slate-100 text-xs text-slate-700"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Métricas clave
                  </h4>
                  <dl className="mt-2 space-y-1 text-sm text-slate-700">
                    {details.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="flex items-center justify-between gap-4"
                      >
                        <dt>{metric.label}</dt>
                        <dd className="font-medium text-slate-900">
                          {metric.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
