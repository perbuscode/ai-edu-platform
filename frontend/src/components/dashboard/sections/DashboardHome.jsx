// src/components/dashboard/sections/DashboardHome.jsx
import React from "react";
import {
  mockCurrentCourse,
  mockStats,
  mockUpcoming,
  mockMaterials,
  mockActivity,
} from "../../../data/dashboard.mock";

export default function DashboardHome({
  currentCourse = mockCurrentCourse,
  stats = mockStats,
  upcoming = mockUpcoming,
  materials = mockMaterials,
  activity = mockActivity,
  onContinue,
}) {
  return (
    <div className="p-8 space-y-8">
      {/* Curso Actual */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
          Curso Actual
        </h3>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                    {currentCourse.name}
                  </h4>
                  <p className="text-gray-600 dark:text-slate-400">
                    {currentCourse.module}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                    Progreso del curso
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {currentCourse.progress}%
                  </span>
                </div>
                <div
                  className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2"
                  aria-hidden="true"
                >
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${currentCourse.progress}%`,
                      background:
                        "linear-gradient(90deg, #4ade80 0%, #22c55e 100%)",
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-slate-400">
                <span>⏱️ {currentCourse.remaining}</span>
                <span>📚 {currentCourse.lesson}</span>
              </div>
            </div>
            <button
              onClick={onContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Continuar la clase
            </button>
          </div>
        </div>
      </section>

      {/* Grid Secciones */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Progreso General */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Progreso General
            </h4>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <Row label="Cursos completados" value={stats.completed} />
            <Row label="Horas de estudio" value={stats.hours} />
            <Row label="Certificados" value={stats.certificates} />
          </div>
        </div>

        {/* Próximas Clases */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Próximas Clases
            </h4>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            {upcoming.map((u, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className={`w-2 h-2 ${u.dot} rounded-full`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                    {u.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {u.when}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Materiales */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Materiales
            </h4>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            {materials.map((m, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 ${m.bg} rounded-lg flex items-center justify-center`}
                >
                  <span className={`text-xs font-medium ${m.color}`}>
                    {m.tag}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                    {m.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {m.info}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Actividad Reciente */}
      <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
          Actividad Reciente
        </h4>
        <div className="space-y-4">
          {activity.map((a, i) => (
            <div key={i} className="flex items-start space-x-4">
              <div
                className={`w-10 h-10 ${a.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <svg
                  className={`w-5 h-5 ${a.iconColor}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                  {a.text}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {a.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600 dark:text-slate-400">{label}</span>
      <span className="font-semibold text-gray-900 dark:text-slate-100">
        {value}
      </span>
    </div>
  );
}
