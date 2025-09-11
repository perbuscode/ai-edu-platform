// frontend/src/pages/Course.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ClassroomStepper from "../components/ClassroomStepper";
import { mockCourse } from "../data/course.mock";
import AiTutorStub from "../components/AiTutorStub";
import LessonNotes from "../components/LessonNotes";

export default function Course() {
  const course = mockCourse;
  const steps = course.currentLesson.steps;
  const [step, setStep] = useState(1);
  const location = useLocation();
  const initialTab = (location?.state?.openTab === 'classroom') ? 'classroom' : 'overview';
  const [tab, setTab] = useState(initialTab);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const lessonId = course?.currentLesson?.id || "unknown";
  const plan = useMemo(() => ({
    blocks: [
      { title: "Fundamentos & ETL", bullets: ["Power Query", "Modelo de datos", "Calendario & Time Intelligence"], project: "Dashboard de Ventas", role: "Jr. BI Analyst" },
      { title: "DAX & Storytelling", bullets: ["Medidas clave", "CALCULATE/FILTER", "Bookmarks/Tooltips"], project: "Dashboard Financiero", role: "BI Analyst" },
      { title: "Avanzado & Gobierno", bullets: ["RLS", "Automatización", "Optimización"], project: "RRHH Ejecutivo", role: "BI Developer" },
    ],
  }), []);

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen">
      {/* Course local sidebar with tabs (collapsible) */}
      <aside className={`fixed inset-y-0 left-0 ${collapsed ? 'w-16' : 'w-64'} bg-slate-900/80 border-r border-white/10 backdrop-blur z-40 transition-[width] duration-200`}> 
        <div className="h-16 flex items-center justify-between px-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-bg rounded-md grid place-items-center"><span className="text-white text-sm font-bold">AE</span></div>
            <span className={`${collapsed ? 'hidden' : 'text-sm font-semibold'}`}>AI Edu Platform</span>
          </div>
          <button
            className="p-1.5 rounded-md border border-white/10 text-slate-200 hover:bg-white/10"
            aria-label={collapsed ? 'Expandir navegación' : 'Colapsar navegación'}
            onClick={() => setCollapsed(v => !v)}
          >
            {collapsed ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h12M4 12h12M4 18h8"/></svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            )}
          </button>
        </div>
        <nav className="p-4 space-y-1 text-sm">
          {[
            { key: 'overview', label: 'Resumen' },
            { key: 'studyplan', label: 'Plan de estudio' },
            { key: 'classroom', label: 'Salón de clases' },
            { key: 'materials', label: 'Materiales' },
            { key: 'deliverables', label: 'Entregables' },
          ].map(it => (
            <button
              key={it.key}
              type="button"
              className={`w-full ${collapsed ? 'px-2 text-center' : 'px-3 text-left'} py-2 rounded hover:bg-white/10 ${tab===it.key ? 'nav-active' : ''}`}
              onClick={() => { setTab(it.key); try{ window.scrollTo({ top: 0, behavior: 'smooth' }); } catch{} }}
              aria-pressed={tab===it.key}
              aria-label={it.label}
              title={collapsed ? it.label : undefined}
            >
              <span className={`${collapsed ? 'hidden' : ''}`}>{it.label}</span>
              {collapsed ? <span className="text-xs font-medium">{it.label.charAt(0)}</span> : null}
            </button>
          ))}

          <div className="pt-3 mt-3 border-t border-white/10">
            <button
              type="button"
              className={`w-full ${collapsed ? 'px-2 text-center' : 'px-3 text-left'} py-2 rounded bg-sky-600 hover:bg-sky-500 text-white text-sm`}
              onClick={() => navigate('/dashboard')}
            >
              <span className={`${collapsed ? 'hidden' : ''}`}>Volver al dashboard</span>
              {collapsed ? <span className="text-xs font-medium">←</span> : null}
            </button>
          </div>
        </nav>
      </aside>

      <div className={`${collapsed ? 'pl-16' : 'pl-64'} transition-[padding] duration-200`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">{course.title}</h1>
            <p className="mt-1 text-slate-300 text-sm max-w-2xl">{course.description}</p>
          </header>

          {tab === 'overview' && (
            <section className="grid grid-cols-1 gap-6">
              <article className="bg-white text-slate-900 border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Progreso del curso</h3>
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">Completado</span>
                    <span className="text-sm font-medium text-green-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2" aria-hidden="true">
                    <div className="h-2 rounded-full" style={{ width: `${course.progress}%`, background: "linear-gradient(90deg,#4ade80 0%,#22c55e 100%)" }} />
                  </div>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <li className="border border-slate-200 rounded-lg px-3 py-2">Horas restantes: <span className="font-medium">—</span></li>
                  <li className="border border-slate-200 rounded-lg px-3 py-2">Lección actual: <span className="font-medium">{course.currentLesson.title}</span></li>
                  <li className="border border-slate-200 rounded-lg px-3 py-2">Próxima clase: <span className="font-medium">—</span></li>
                  <li className="border border-slate-200 rounded-lg px-3 py-2">ETA final: <span className="font-medium">—</span></li>
                </ul>
              </article>
            </section>
          )}

          {tab === 'studyplan' && (
            <section className="bg-white text-slate-900 border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Plan de estudio</h3>
              <div className="space-y-3">
                {plan.blocks.map((b, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4">
                    <div className="font-medium text-slate-900">{b.title}</div>
                    <ul className="list-disc pl-5 mt-2 text-sm text-slate-700 space-y-1">
                      {b.bullets.map((x, j) => <li key={j}>{x}</li>)}
                    </ul>
                    <div className="mt-2 text-sm text-slate-600">
                      <div><span className="text-slate-500">Proyecto:</span> {b.project}</div>
                      <div><span className="text-slate-500">Rol:</span> {b.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'classroom' && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <article className="bg-white text-slate-900 border border-slate-200 rounded-xl p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{course.currentLesson.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Duración: {course.currentLesson.duration}</p>
                </div>
              </div>

              <ClassroomStepper
                steps={steps}
                currentStep={step}
                onStepChange={setStep}
                className="mb-6"
              />

              {step === 1 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Clase en video</h3>
                  <div className="rounded-lg overflow-hidden border border-slate-200 bg-black aspect-video mb-4 grid place-items-center">
                    <span className="text-white/70 text-sm">[Player de video embebido]</span>
                  </div>
                  <button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium">Siguiente: Contenido</button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contenido de la clase</h3>
                  <div className="prose max-w-none text-slate-800">
                    <p>
                      En esta lección profundizamos en <strong>conceptos clave</strong> del desarrollo frontend y buenas prácticas.
                    </p>
                    <ul>
                      {course.currentLesson.outline.map((it, i) => (<li key={i}>{it}</li>))}
                    </ul>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button onClick={() => setStep(1)} className="border border-slate-200 px-4 py-2 rounded-lg text-sm">Volver al video</button>
                    <button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium">Siguiente: Ejercicio</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Ejercicio guiado</h3>
                  <div className="border border-dashed border-slate-300 rounded-lg p-4">
                    <p className="text-sm mb-2">Resuelve el reto y envía tu respuesta:</p>
                    <p className="text-sm text-slate-700 mb-3">{course.currentLesson.exercise}</p>
                    <textarea className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm" rows={5} placeholder="Escribe aquí tu solución, pasos o reflexión..." />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button onClick={() => setStep(2)} className="border border-slate-200 px-4 py-2 rounded-lg text-sm">Volver a contenido</button>
                    <button onClick={() => { try { alert('¡Clase marcada como completada!'); } catch {}; setStep(1); }} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium">Marcar clase como completada</button>
                  </div>
                </div>
              )}
            </article>

            {/* Right summary */}
            <aside className="bg-white text-slate-900 border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">Resumen del curso</h3>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-slate-300">Progreso</span>
                  <span className="text-sm font-medium text-green-600">{course.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2" aria-hidden="true">
                  <div className="h-2 rounded-full" style={{ width: `${course.progress}%`, background: "linear-gradient(90deg,#4ade80 0%,#22c55e 100%)" }} />
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2">Lección actual: <span className="font-medium">{course.currentLesson.title}</span></li>
                <li className="border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2">Duración: <span className="font-medium">{course.currentLesson.duration}</span></li>
              </ul>
              <div className="mt-6 space-y-4">
                <AiTutorStub lessonId={lessonId} />
                <LessonNotes lessonId={lessonId} />
              </div>
            </aside>
          </section>
          )}

          {tab === 'materials' && (
            <section className="bg-white text-slate-900 border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Materiales del curso</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg grid place-items-center"><span className="text-xs font-medium text-red-600 dark:text-red-300">PDF</span></div><div className="flex-1"><p className="text-sm font-medium">Guía de conceptos</p><p className="text-xs text-gray-500 dark:text-slate-400">2.3 MB</p></div><button className="text-blue-600 dark:text-blue-300 text-sm font-medium">Descargar</button></li>
                <li className="flex items-center gap-3"><div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg grid place-items-center"><span className="text-xs font-medium text-blue-700 dark:text-blue-300">ZIP</span></div><div className="flex-1"><p className="text-sm font-medium">Ejemplos de código</p><p className="text-xs text-gray-500 dark:text-slate-400">1.1 MB</p></div><button className="text-blue-600 dark:text-blue-300 text-sm font-medium">Descargar</button></li>
              </ul>
            </section>
          )}

          {tab === 'deliverables' && (
            <section className="bg-white text-slate-900 border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Entregables</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start justify-between border border-slate-200 rounded-lg p-3">
                  <div>
                    <p className="font-medium text-slate-900">Proyecto: Dashboard de Ventas</p>
                    <p className="text-slate-600">Entrega 1 • KPIs y DAX básicos</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-sky-100 text-sky-800">Pendiente</span>
                </li>
                <li className="flex items-start justify-between border border-slate-200 rounded-lg p-3">
                  <div>
                    <p className="font-medium text-slate-900">Ejercicio: Time-Intelligence</p>
                    <p className="text-slate-600">CALCULATE, SAMEPERIODLASTYEAR, TOTALYTD</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">En revisión</span>
                </li>
                <li className="flex items-start justify-between border border-slate-200 rounded-lg p-3">
                  <div>
                    <p className="font-medium text-slate-900">Tarea: Modelo de datos</p>
                    <p className="text-slate-600">Relaciones y calendario</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">Aprobado</span>
                </li>
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
