// frontend/src/pages/Course.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ClassroomStepper from "../components/ClassroomStepper";
import StudyPlanTable from "../components/StudyPlanTable";
import { mockStudyPlan } from "../data/studyPlan.mock";
import { mockCourse } from "../data/course.mock";
import Topbar from "../components/Topbar";
import {
  ChevronFirst,
  ChevronLast,
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FolderOpen,
  ListChecks,
  ArrowLeft,
} from "lucide-react";

export default function Course() {
  const course = mockCourse;
  const steps = course.currentLesson.steps;
  const [step, setStep] = useState(1);
  const location = useLocation();
  const initialTab =
    location?.state?.openTab === "classroom" ? "classroom" : "overview";
  const [tab, setTab] = useState(initialTab);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("course:sidebar:collapsed") === "1";
    } catch {
      return false;
    }
  });
  const navigate = useNavigate();
  const leftOffsetClass = useMemo(
    () => (collapsed ? "left-10" : "left-56"),
    [collapsed]
  );
  const contentPadClass = useMemo(
    () => (collapsed ? "pl-10" : "pl-56"),
    [collapsed]
  );

  useEffect(() => {
    try {
      localStorage.setItem("course:sidebar:collapsed", collapsed ? "1" : "0");
    } catch (_error) {
      // noop
    }
  }, [collapsed]);
  const lessonId = course?.currentLesson?.id || "unknown";
  const studyPlan = mockStudyPlan;
  const totalPlanModules = useMemo(
    () => studyPlan.reduce((total, day) => total + day.modules.length, 0),
    [studyPlan]
  );
  const completedPlanModules = useMemo(
    () => Math.round((course.progress / 100) * totalPlanModules),
    [course.progress, totalPlanModules]
  );

  const tabs = useMemo(
    () => [
      { key: "overview", label: "Resumen" },
      { key: "studyplan", label: "Plan de estudio" },
      { key: "classroom", label: "Salón de clases" },
      { key: "materials", label: "Materiales" },
      { key: "deliverables", label: "Entregables" },
    ],
    []
  );

  const iconForTab = (key) => {
    switch (key) {
      case "studyplan":
        return <BookOpen size={18} aria-hidden />;
      case "classroom":
        return <GraduationCap size={18} aria-hidden />;
      case "materials":
        return <FolderOpen size={18} aria-hidden />;
      case "deliverables":
        return <ListChecks size={18} aria-hidden />;
      case "overview":
      default:
        return <LayoutDashboard size={18} aria-hidden />;
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem("ai-edu:last-lesson-id", lessonId);
    } catch (_error) {
      // noop
    }
  }, [lessonId]);

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen">
      {/* Course local sidebar with tabs (collapsible) */}
      <aside
        className={`fixed inset-y-0 left-0 ${collapsed ? "w-10" : "w-56"} bg-slate-900/80 border-r border-white/10 backdrop-blur z-40 transition-[width] duration-300 ease-in-out`}
      >
        <div
          className={`h-16 border-b border-white/10 ${collapsed ? "grid place-items-center px-0" : "relative flex items-center justify-end px-3"}`}
        >
          {!collapsed && (
            <button
              type="button"
              onClick={() => navigate("/")}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 rounded-md"
              aria-label="Ir al landing de Edvance"
            >
              <img
                src="/images/logo-edvance.png"
                alt="Edvance"
                className="h-20 md:h-30 w-auto"
              />
            </button>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-200 transition-colors"
            aria-label={
              collapsed ? "Expandir navegación" : "Contraer navegación"
            }
            title={collapsed ? "Expandir navegación" : "Contraer navegación"}
          >
            {collapsed ? (
              <ChevronLast size={16} aria-hidden />
            ) : (
              <ChevronFirst size={16} aria-hidden />
            )}
          </button>
        </div>
        <nav className="p-2 space-y-1 text-sm">
          {tabs.map((it) => (
            <button
              key={it.key}
              type="button"
              className={`w-full flex items-center ${collapsed ? "justify-center px-0 py-3" : "justify-start gap-2 px-3 py-2"} rounded hover:bg-white/10 transition-colors ${tab === it.key ? "nav-active" : ""}`}
              onClick={() => {
                setTab(it.key);
                try {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } catch (_error) {
                  // noop
                }
              }}
              aria-pressed={tab === it.key}
              aria-label={it.label}
              title={collapsed ? it.label : undefined}
            >
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-200 ${collapsed ? "" : "bg-white/5"}`}
              >
                {iconForTab(it.key)}
              </span>
              {collapsed ? (
                <span className="sr-only">{it.label}</span>
              ) : (
                <span className="text-left">{it.label}</span>
              )}
            </button>
          ))}
          <div className="pt-3 mt-3 border-t border-white/10">
            <button
              type="button"
              className={`w-full flex items-center justify-center ${collapsed ? "px-0 py-3" : "gap-2 px-3 py-2"} rounded bg-sky-600 hover:bg-sky-500 text-white text-sm transition-colors`}
              onClick={() => navigate("/dashboard")}
              aria-label="Volver al dashboard"
              title="Volver al dashboard"
            >
              {collapsed ? (
                <>
                  <span className="inline-flex h-9 w-9 items-center justify-center text-white">
                    <ArrowLeft size={16} aria-hidden />
                  </span>
                  <span className="sr-only">Volver al dashboard</span>
                </>
              ) : (
                <span className="w-full text-center">Volver al dashboard</span>
              )}
            </button>
          </div>
        </nav>
      </aside>

      <Topbar leftOffsetClass={leftOffsetClass} title="Salón de clases" />

      <main
        className={`${contentPadClass} pt-16 transition-[padding] duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">
              {course.title}
            </h1>
            <p className="mt-1 text-slate-300 text-sm max-w-2xl">
              {course.description}
            </p>
          </header>

          {tab === "overview" && (
            <section className="grid grid-cols-1 gap-6">
              <article className="bg-white text-slate-900 border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Progreso del curso
                </h3>
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-900">Completado</span>
                    <span className="text-sm font-medium text-green-600">
                      {course.progress}%
                    </span>
                  </div>
                  <div
                    className="w-full bg-slate-200 rounded-full h-2"
                    aria-hidden="true"
                  >
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${course.progress}%`,
                        background:
                          "linear-gradient(90deg,#4ade80 0%,#22c55e 100%)",
                      }}
                    />
                  </div>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <li className="border border-slate-200 rounded-lg px-3 py-2 text-slate-700">
                    Horas restantes:{" "}
                    <span className="font-medium">&mdash;</span>
                  </li>
                  <li className="border border-slate-200 rounded-lg px-3 py-2 text-slate-700">
                    Lección actual:{" "}
                    <span className="font-medium text-slate-900">
                      {course.currentLesson.title}
                    </span>
                  </li>
                  <li className="border border-slate-200 rounded-lg px-3 py-2 text-slate-700">
                    Próxima clase: <span className="font-medium">&mdash;</span>
                  </li>
                  <li className="border border-slate-200 rounded-lg px-3 py-2 text-slate-700">
                    ETA final: <span className="font-medium">&mdash;</span>
                  </li>
                </ul>
              </article>
            </section>
          )}

          {tab === "studyplan" && (
            <StudyPlanTable
              studyPlan={studyPlan}
              completedModules={completedPlanModules}
            />
          )}

          {tab === "classroom" && (
            <section className="space-y-6">
              <article className="bg-white text-slate-900 border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {course.currentLesson.title}
                    </h2>
                    <p className="text-sm text-slate-700">
                      Duración:{" "}
                      <span className="font-semibold text-slate-900">
                        {course.currentLesson.duration}
                      </span>
                    </p>
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
                    <h3 className="text-lg font-semibold mb-3">
                      Clase en video
                    </h3>
                    <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-black aspect-video mb-4">
                      <iframe
                        src="https://www.youtube.com/embed/TkN2i-_4N4g?si=UNdNT04cJoFrJYWD"
                        title="Clase de fundamentos frontend"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
                    >
                      Siguiente: Contenido
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Contenido de la clase
                    </h3>
                    <div className="prose max-w-none text-slate-800">
                      <p>
                        Los fundamentos del frontend se apoyan en la triada de
                        HTML, CSS y JavaScript. HTML nos permite describir la
                        estructura semántica para que las personas y los
                        navegadores comprendan el contenido.
                      </p>
                      <h4>HTML: estructura y accesibilidad</h4>
                      <p>
                        Organiza la página con etiquetas semánticas como{" "}
                        <code>header</code>, <code>main</code> y{" "}
                        <code>footer</code>; define jerarquías correctas de
                        encabezados y usa atributos <code>alt</code> y{" "}
                        <code>aria-*</code> para que cada elemento comunique su
                        propósito.
                      </p>
                      <h4>CSS: diseño adaptable</h4>
                      <p>
                        El estilo define la experiencia visual. Utiliza flexbox
                        y grid para crear layouts fluidos, declara variables CSS
                        para repetir colores y tipografías, y aplica media
                        queries para mantener la interfaz usable en móviles y
                        escritorio.
                      </p>
                      <h4>JavaScript: interacción y lógica</h4>
                      <p>
                        JavaScript conecta la interfaz con la lógica: escucha
                        eventos, manipula el DOM de forma declarativa y consume
                        APIs para actualizar datos sin recargar la página.
                        Divide la lógica en funciones o componentes
                        reutilizables.
                      </p>
                      <p>
                        Integra estas capas iterando: prototipa con HTML,
                        estiliza con CSS y añade comportamiento con JavaScript,
                        registrando aprendizajes en un cuaderno técnico.
                      </p>
                      <ul>
                        {course.currentLesson.outline.map((it, i) => (
                          <li key={i}>{it}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => setStep(1)}
                        className="border border-slate-200 px-4 py-2 rounded-lg text-sm"
                      >
                        Volver al video
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
                      >
                        Siguiente: Ejercicio
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Ejercicio guiado
                    </h3>
                    <div className="border border-dashed border-slate-300 rounded-lg p-4">
                      <p className="text-sm mb-2">
                        Resuelve el reto y envía tu respuesta:
                      </p>
                      <p className="text-sm text-slate-700 mb-3">
                        {course.currentLesson.exercise}
                      </p>
                      <textarea
                        className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm"
                        rows={5}
                        placeholder="Escribe aquí tu solución, pasos o reflexión..."
                      />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => setStep(2)}
                        className="border border-slate-200 px-4 py-2 rounded-lg text-sm"
                      >
                        Volver al contenido
                      </button>
                      <button
                        onClick={() => {
                          try {
                            alert("¡Clase marcada como completada!");
                          } catch (_error) {
                            // noop
                          }
                          setStep(1);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
                      >
                        Marcar clase como completada
                      </button>
                    </div>
                  </div>
                )}
              </article>
            </section>
          )}

          {tab === "materials" && (
            <section className="bg-white text-slate-900 border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Materiales del curso
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg grid place-items-center">
                    <span className="text-xs font-semibold text-slate-900">
                      PDF
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Guía de conceptos</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      2.3 MB
                    </p>
                  </div>
                  <button className="text-blue-600 dark:text-blue-300 text-sm font-medium">
                    Descargar
                  </button>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg grid place-items-center">
                    <span className="text-xs font-semibold text-slate-900">
                      ZIP
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Ejemplos de código</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      1.1 MB
                    </p>
                  </div>
                  <button className="text-blue-600 dark:text-blue-300 text-sm font-medium">
                    Descargar
                  </button>
                </li>
              </ul>
            </section>
          )}

          {tab === "deliverables" && (
            <section className="bg-white text-slate-900 border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Entregables
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start justify-between border border-slate-200 rounded-lg p-3">
                  <div>
                    <p className="font-medium text-slate-900">
                      Proyecto: Dashboard de Ventas
                    </p>
                    <p className="text-slate-600">
                      Entrega 1 · KPIs y DAX básicos
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-sky-100 text-sky-800">
                    Pendiente
                  </span>
                </li>
                <li className="flex items-start justify-between border border-slate-200 rounded-lg p-3">
                  <div>
                    <p className="font-medium text-slate-900">
                      Ejercicio: Time-Intelligence
                    </p>
                    <p className="text-slate-600">
                      CALCULATE, SAMEPERIODLASTYEAR, TOTALYTD
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                    En revisión
                  </span>
                </li>
                <li className="flex items-start justify-between border border-slate-200 rounded-lg p-3">
                  <div>
                    <p className="font-medium text-slate-900">
                      Tarea: Modelo de datos
                    </p>
                    <p className="text-slate-600">Relaciones y calendario</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">
                    Aprobado
                  </span>
                </li>
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
