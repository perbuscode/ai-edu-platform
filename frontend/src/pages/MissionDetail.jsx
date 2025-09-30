// src/pages/MissionDetail.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MissionRubricModal from "../components/missions/MissionRubricModal";
import { getMissionById } from "../data/missions";

export default function MissionDetail() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const [rubricOpen, setRubricOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [missionId]);

  const mission = getMissionById(missionId);

  if (!mission) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-semibold">Mision no encontrada</h1>
          <p className="text-sm text-slate-600">
            No encontramos la mision que intentas abrir. Regresa al mapa de
            competencias para elegir otra actividad.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-100 text-slate-900 text-sm font-medium"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const dataset = mission.dataset || [];
  const tasks = mission.tasks || [];
  const reflection = mission.reflection || [];
  const resources = mission.resources || [];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="self-start inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <span aria-hidden="true">&larr;</span>
            Volver al mapa
          </button>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Micro-proyecto
                </p>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {mission.title}
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  {mission.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                {mission.duration && (
                  <span className="inline-flex px-3 py-1 rounded-full bg-white text-slate-900 border border-slate-200">
                    Duracion {mission.duration}
                  </span>
                )}
                {mission.impact && (
                  <span className="inline-flex px-3 py-1 rounded-full bg-white text-slate-900 border border-slate-200">
                    {mission.impact}
                  </span>
                )}
                {mission.skillPoints != null && (
                  <span className="inline-flex px-3 py-1 rounded-full bg-white text-slate-900 border border-slate-200">
                    {mission.skillPoints} pts habilidad
                  </span>
                )}
              </div>
            </div>
            {mission.objective && (
              <div className="mt-4">
                <h2 className="text-sm font-semibold text-slate-700">
                  Objetivo
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {mission.objective}
                </p>
              </div>
            )}
            {mission.scenario && (
              <div className="mt-4">
                <h2 className="text-sm font-semibold text-slate-700">
                  Escenario
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {mission.scenario}
                </p>
              </div>
            )}
            {mission.deliverable && (
              <div className="mt-4 border border-slate-200 rounded-xl p-4 bg-white">
                <h2 className="text-sm font-semibold text-slate-700">
                  Entrega esperada
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {mission.deliverable}
                </p>
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium shadow hover:bg-sky-400"
                onClick={() => setRubricOpen(true)}
              >
                Ver rubrica
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => navigate(-1)}
              >
                Volver al mapa
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {dataset.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Dataset de trabajo
              </h2>
              <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                {dataset.map((item, index) => (
                  <li key={`${mission.id}-detail-dataset-${index}`}>{item}</li>
                ))}
              </ul>
            </section>
          )}
          {tasks.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Pasos sugeridos
              </h2>
              <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
                {tasks.map((item, index) => (
                  <li key={`${mission.id}-detail-task-${index}`}>{item}</li>
                ))}
              </ol>
            </section>
          )}
        </div>

        {reflection.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Preguntas para reflexionar
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
              {reflection.map((item, index) => (
                <li key={`${mission.id}-detail-reflection-${index}`}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {resources.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Recursos sugeridos
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
              {resources.map((resource, index) => (
                <li key={`${mission.id}-detail-resource-${index}`}>
                  {resource.url ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-600 hover:text-sky-500"
                    >
                      {resource.label || resource.url}
                    </a>
                  ) : (
                    resource.label
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <MissionRubricModal
        open={rubricOpen}
        mission={mission}
        onClose={() => setRubricOpen(false)}
      />
    </div>
  );
}
