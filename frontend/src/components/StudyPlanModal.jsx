// frontend/src/components/StudyPlanModal.jsx
import React, { Fragment, useEffect, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import {
  XMarkIcon,
  BookOpenIcon,
  DocumentTextIcon,
  PrinterIcon,
  BookmarkIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

// Helpers
function ensureArray(x) {
  return Array.isArray(x) ? x : [];
}
function isMacroProjectTitle(title = "") {
  return /macroproyecto\s*final/i.test(title);
}

// Usa horas del backend si existen; estima si no
function useDurations(plan) {
  return useMemo(() => {
    if (!plan) return { perLesson: {}, perProject: {} };
    const modules = Array.isArray(plan.blocks) ? plan.blocks : [];

    const perLesson = {};
    const perProject = {};
    let hasProvided = false;

    modules.forEach((m, mi) => {
      const lessons = ensureArray(m?.bullets);
      const lessonHours = ensureArray(m?.lessonHours);

      if (
        lessonHours.length === lessons.length &&
        lessonHours.some((v) => Number(v) > 0)
      ) {
        hasProvided = true;
        lessonHours.forEach((h, li) => {
          perLesson[`${mi}:${li}`] = Number(h) || 0;
        });
      }
      if (
        m?.project &&
        isFinite(Number(m?.projectHours)) &&
        Number(m.projectHours) > 0
      ) {
        hasProvided = true;
        perProject[`${mi}`] = Number(m.projectHours) || 0;
      }
    });

    if (hasProvided) return { perLesson, perProject };

    // Estimación si no hay datos
    const hpw = Number(plan.hoursPerWeek || 0);
    const weeks = Number(plan.durationWeeks || plan.weeks || 0);
    const hoursTotal = hpw && weeks ? hpw * weeks : 0;
    if (!hoursTotal) return { perLesson: {}, perProject: {} };

    const lessonShare = 0.7;
    const projectShare = 0.3;

    const lessonsCount = modules.reduce(
      (acc, m) => acc + ensureArray(m?.bullets).length,
      0
    );
    const projectsCount = modules.reduce(
      (acc, m) => acc + (m?.project ? 1 : 0),
      0
    );

    const hoursForLessons = Math.max(0, hoursTotal * lessonShare);
    const hoursForProjects = Math.max(0, hoursTotal * projectShare);

    const perLessonUnit = lessonsCount ? hoursForLessons / lessonsCount : 0;
    const perProjectUnit = projectsCount ? hoursForProjects / projectsCount : 0;

    modules.forEach((m, mi) => {
      ensureArray(m?.bullets).forEach((_, li) => {
        perLesson[`${mi}:${li}`] = perLessonUnit;
      });
      if (m?.project) perProject[`${mi}`] = perProjectUnit;
    });

    return { perLesson, perProject };
  }, [plan]);
}

export default function StudyPlanModal({
  plan,
  isOpen,
  onClose,
  onSave,
  isAuthenticated = false,
  authPath = "/#register",
}) {
  const modules = ensureArray(plan?.blocks);
  const skills = ensureArray(plan?.skills).slice(0, 12);
  const roles = ensureArray(plan?.roles).slice(0, 3);
  const salary = ensureArray(plan?.salary).slice(0, 2);

  const hoursTotal = useMemo(() => {
    if (!plan) return null;
    const hpw = Number(plan?.hoursPerWeek || 0);
    const weeks = Number(plan?.durationWeeks || plan?.weeks || 0);
    return hpw && weeks ? hpw * weeks : null;
  }, [plan]);

  const { perLesson, perProject } = useDurations(plan);

  // Bloquear scroll de fondo
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  if (!plan) return null;

  function handlePrintPDF() {
    window.print();
  }

  function handleSave() {
    if (typeof onSave === "function") onSave(plan);
  }

  const Label = ({ children }) => (
    <span className="text-sm font-semibold text-slate-600">{children}</span>
  );

  const Metric = ({ label, value }) => (
    <div className="rounded-lg px-3 py-3 bg-white/10">
      <div className="text-sm opacity-90 leading-tight">{label}</div>
      <div className="text-base font-semibold whitespace-normal break-words leading-tight">
        {value}
      </div>
    </div>
  );

  const HoursBadge = ({ hours }) =>
    hours ? (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-slate-200 text-slate-700">
        <ClockIcon className="h-3.5 w-3.5" />
        {Number(hours).toFixed(Number(hours) % 1 !== 0 ? 1 : 0)} h
      </span>
    ) : null;

  const IABadge = () => (
    <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
      IA
    </span>
  );

  // Detecta bullet IA:
  const isIABullet = (text = "") => /^IA\s*:/i.test(text.trim());

  // ¿Hay rol objetivo?
  const primaryRole = roles?.[0] || "";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[9999] print:z-auto" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60 z-[9998] print:hidden" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto z-[9999]">
          <div className="flex min-h-full items-center justify-center p-4 text-center print:block">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative z-[10000] w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all print:shadow-none print:rounded-none print:max-w-none">

                {/* Header */}
                <div className="flex items-start justify-between px-6 pt-6 print:hidden">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-bold leading-6 text-gray-900"
                    >
                      Tu plan de estudio
                    </Dialog.Title>

                    <div className="mt-3 text-sm text-gray-700 space-y-1">
                      <p>
                        <Label>Objetivo:</Label>{" "}
                        <span className="font-medium text-gray-900">{plan?.goal}</span>
                      </p>
                      <p>
                        <Label>Nivel:</Label>{" "}
                        <span className="font-medium text-gray-900">{plan?.level}</span>
                      </p>
                      {hoursTotal ? (
                        <p>
                          <Label>Dedicación total:</Label>{" "}
                          <span className="font-medium text-gray-900">{hoursTotal} h</span>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="ml-4 rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Cerrar</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* CONTENIDO */}
                <div className="mt-4 px-6 pb-6 max-h-[70vh] overflow-y-auto pr-1">

                  {/* Resumen */}
                  <section className="rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white p-5 print:border print:border-slate-200">
                    <h4 className="text-xl font-semibold mb-2">Resumen</h4>
                    <p className="opacity-95 text-justify leading-relaxed">
                      {typeof plan?.summary === "string" && plan.summary.trim().length
                        ? plan.summary
                        : "Un plan práctico y progresivo con proyectos aplicados para alcanzar tu objetivo."}
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-3 max-w-xl">
                      <Metric
                        label="Duración"
                        value={`${plan?.durationWeeks || plan?.weeks} semanas`}
                      />
                      <Metric
                        label="Horas / semana"
                        value={`${plan?.hoursPerWeek}`}
                      />
                      {primaryRole ? (
                        <Metric label="Rol objetivo" value={primaryRole} />
                      ) : null}
                    </div>
                  </section>

                  {/* Habilidades */}
                  <section className="mt-6">
                    <h5 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                      Habilidades que desarrollarás
                    </h5>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {skills.length ? (
                        skills.map((s, i) => (
                          <span
                            key={i}
                            className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-500 text-sm">
                          Se mostrarán aquí a partir de los módulos.
                        </p>
                      )}
                    </div>
                  </section>

                  {/* Roles y salarios */}
                  {(roles.length || salary.length) && (
                    <section className="mt-6 space-y-4">
                      {roles.length ? (
                        <div className="rounded-lg border border-slate-200 bg-white p-4">
                          <div className="flex items-center gap-2 text-slate-800 font-semibold">
                            {/* briefcase removed as requested earlier; kept clean */}
                            Roles que puedes desempeñar
                          </div>
                          <ul className="mt-2 text-sm text-slate-700 list-disc pl-5">
                            {roles.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {salary.length ? (
                        <div className="rounded-lg border border-slate-200 bg-white p-4">
                          <div className="flex items-center gap-2 text-slate-800 font-semibold">
                            <CurrencyDollarIcon className="h-5 w-5" />
                            Rangos salariales estimados
                          </div>
                          <ul className="mt-2 text-sm text-slate-700 space-y-1">
                            {salary.map((s, i) => (
                              <li key={i}>
                                <span className="font-medium">{s.role}</span>:{" "}
                                {s.currency} {Number(s.min).toLocaleString()} –{" "}
                                {Number(s.max).toLocaleString()} / {s.period}
                                {s.region ? ` · ${s.region}` : ""}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-2 text-xs text-slate-500">
                            *Estimaciones informativas. Pueden variar según mercado, región y experiencia.
                          </p>
                        </div>
                      ) : null}
                    </section>
                  )}

                  {/* Módulos */}
                  <section className="mt-6 space-y-5">
                    <h5 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                      Módulos del plan
                    </h5>

                    {modules.map((module, mi) => {
                      const lessons = ensureArray(module?.bullets);
                      const project = module?.project;
                      const macro = isMacroProjectTitle(module?.title) || mi === modules.length - 1;

                      return (
                        <div
                          key={mi}
                          className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <BookOpenIcon className="h-6 w-6 text-sky-600 mr-3" />
                              <h4 className="text-lg font-semibold text-gray-800">
                                {module.title}
                              </h4>
                            </div>
                          </div>

                          {/* Temas */}
                          <ul className="mt-3 ml-9 list-disc space-y-2 pl-5 text-gray-700">
                            {lessons.map((lesson, li) => {
                              const isIA = isIABullet(lesson);
                              return (
                                <li key={li} className="flex items-start gap-2">
                                  <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <span className="mr-2">
                                      {lesson}
                                    </span>
                                    {isIA && <IABadge />}
                                  </div>
                                  <HoursBadge hours={perLesson[`${mi}:${li}`]} />
                                </li>
                              );
                            })}
                          </ul>

                          {/* Proyecto destacado */}
                          {project && (
                            <div
                              className={
                                "mt-4 ml-9 rounded-xl border p-4 shadow-sm " +
                                (macro
                                  ? "border-transparent bg-gradient-to-r from-amber-100 to-rose-100"
                                  : "border-sky-200 bg-white")
                              }
                              style={macro ? { boxShadow: "0 0 0 1px rgba(251, 191, 36, 0.5) inset" } : undefined}
                            >
                              <div className={"flex items-center gap-2 font-semibold " + (macro ? "text-rose-700" : "text-sky-700")}>
                                <ClipboardDocumentListIcon className="h-5 w-5" />
                                {macro ? "Macroproyecto final" : "Proyecto del módulo"}
                                <div className="ml-auto">
                                  <HoursBadge hours={perProject[`${mi}`]} />
                                </div>
                              </div>
                              <p className="mt-2 text-sm text-slate-700">
                                {project}
                              </p>
                              {module.role && (
                                <p className="mt-2 text-xs text-slate-500">
                                  Rol simulado:{" "}
                                  <span className="font-medium text-slate-700">
                                    {module.role}
                                  </span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </section>
                </div>

                {/* Acciones */}
                <div className="px-6 pb-6 flex flex-wrap gap-3 justify-end print:hidden">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    onClick={handlePrintPDF}
                  >
                    <PrinterIcon className="h-5 w-5" />
                    Exportar PDF
                  </button>

                  {isAuthenticated ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                      onClick={handleSave}
                    >
                      <BookmarkIcon className="h-5 w-5" />
                      Guardar en mi perfil
                    </button>
                  ) : (
                    <Link
                      to={authPath}
                      onClick={onClose}
                      className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      Crear cuenta y guardar
                    </Link>
                  )}
                </div>

                {/* Pie impresión */}
                <div className="hidden print:block mt-8 text-xs text-slate-500 px-6 pb-6">
                  Generado con ChatPlanner · {new Date().toLocaleDateString()}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
