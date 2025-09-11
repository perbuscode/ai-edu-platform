// src/components/dashboard/sections/CourseView.jsx
import React, { useState } from "react";

export default function CourseView({ courseName = "Nombre del curso" }) {
  const [tab, setTab] = useState("overview");
  const [step, setStep] = useState(1);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-100">{courseName}</h2>
      </div>

      <div className="hidden" aria-hidden />

      <div className="space-y-8">
        {tab === "overview" && (
          <section id="tab-overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <article className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Progreso del curso </h3>
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-slate-300">Completado</span>
                    <span className="text-sm font-medium text-green-600">—</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2" aria-hidden="true">
                    <div className="h-2 rounded-full" style={{ width: "0%", background: "linear-gradient(90deg,#4ade80 0%,#22c55e 100%)" }} />
                  </div>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <li className="border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2">⏱️ Horas restantes: <span className="font-medium">—</span></li>
                  <li className="border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2">📚 Leccion actual: <span className="font-medium">—</span></li>
                  <li className="border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2">📅 Próxima clase: <span className="font-medium">—</span></li>
                  <li className="border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2">🏁 ETA final: <span className="font-medium">—</span></li>
                </ul>
              </article>
            </div>
          </section>
        )}

        {tab === "classroom" && (
          <section id="tab-classroom">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                {[1,2,3].map((i)=> (
                  <React.Fragment key={i}>
                    <div className={`w-6 h-6 rounded-full grid place-items-center ${step===i? 'text-white bg-blue-600' : 'text-gray-600 bg-gray-200 dark:bg-slate-800 dark:text-slate-300'}`}>{i}</div>
                    {i<3 && <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800" />}
                  </React.Fragment>
                ))}
              </div>

              {step === 1 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Clase en video</h3>
                  <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800 bg-black aspect-video mb-4 grid place-items-center">
                    <span className="text-white/70 text-sm">[Player de video embebido]</span>
                  </div>
                  <button onClick={()=>setStep(2)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium">Siguiente: Contenido</button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contenido de la clase</h3>
                  <div className="prose max-w-none text-gray-800 dark:text-slate-200">
                    <p>En esta lección profundizamos en <strong>conceptos clave</strong> y buenas prácticas.</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button onClick={()=>setStep(1)} className="border border-gray-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm">Volver al video</button>
                    <button onClick={()=>setStep(3)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium">Siguiente: Ejercicio</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Ejercicio guiado</h3>
                  <div className="border border-dashed border-gray-300 dark:border-slate-700 rounded-lg p-4">
                    <p className="text-sm mb-2">Resuelve el reto y envía tu respuesta:</p>
                    <textarea className="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg px-3 py-2 text-sm" rows="5" placeholder="Escribe aquí tu solución, pasos o reflexión..."></textarea>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button onClick={()=>setStep(2)} className="border border-gray-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm">Volver a contenido</button>
                    <button onClick={()=>{ alert('¡Clase marcada como completada!'); setStep(1); }} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium">Marcar clase como completada</button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {tab === "studyplan" && (
          <section id="tab-studyplan">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Plan de estudio</h3>
              <ol className="space-y-3">
                <li className="flex items-center justify-between border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2"><span>1. Introducción</span><span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Completado</span></li>
                <li className="flex items-center justify-between border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2"><span>2. Fundamentos</span><span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">En curso</span></li>
                <li className="flex items-center justify-between border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2"><span>3. Proyecto práctico</span><span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-200">Pendiente</span></li>
              </ol>
            </div>
          </section>
        )}

        {tab === "materials" && (
          <section id="tab-materials">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Materiales del curso</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg grid place-items-center"><span className="text-xs font-medium text-red-600 dark:text-red-300">PDF</span></div><div className="flex-1"><p className="text-sm font-medium">Guía de conceptos</p><p className="text-xs text-gray-500 dark:text-slate-400">2.3 MB</p></div><button className="text-blue-600 dark:text-blue-300 text-sm font-medium">Descargar</button></li>
              </ul>
            </div>
          </section>
        )}
      </div>

      {/* Tabs selector controlled by Sidebar via parent */}
      <TabController value={tab} onChange={setTab} />
    </div>
  );
}

function TabController() { return null; }

