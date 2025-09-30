// frontend/src/components/StudyPlanModal.jsx
import React, { Fragment, useEffect, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  BookmarkIcon,
  RocketLaunchIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export default function StudyPlanModal({ plan, isOpen, onClose, onSave }) {
  const modules = plan?.blocks || [];
  const skills = Array.isArray(plan?.skills) ? plan.skills.slice(0, 12) : [];
  const roles = Array.isArray(plan?.roles) ? plan.roles.slice(0, 3) : [];
  const salary = Array.isArray(plan?.salary) ? plan.salary.slice(0, 2) : [];

  const summary =
    plan?.summary ||
    "Un plan práctico y progresivo con proyectos aplicados para alcanzar tu objetivo.";

  const hoursTotal = useMemo(() => {
    if (!plan) return null;
    const hpw = Number(plan?.hoursPerWeek || 0);
    const weeks = Number(plan?.durationWeeks || plan?.weeks || 0);
    return hpw && weeks ? hpw * weeks : null;
  }, [plan]);

  // Body lock (evita scroll del fondo)
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

  function handleExportJSON() {
    const blob = new Blob([JSON.stringify(plan, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safe = (plan?.title || "plan-estudio")
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-");
    a.href = url;
    a.download = `${safe}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handlePrintPDF() {
    window.print();
  }

  function handleSave() {
    if (typeof onSave === "function") onSave(plan);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[9999] print:z-auto"
        onClose={onClose}
      >
        {/* Backdrop por debajo del panel */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60 z-[9998] print:hidden" />
        </Transition.Child>

        {/* Contenedor de portal/scroll general del modal (por encima del backdrop) */}
        <div className="fixed inset-0 overflow-y-auto z-[9999]">
          <div className="flex min-h-full items-center justify-center p-4 text-center print:block">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* Panel con z superior al backdrop */}
              <Dialog.Panel className="relative z-[10000] w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all print:shadow-none print:rounded-none print:max-w-none">
                {/* Header fijo */}
                <div className="flex items-start justify-between px-6 pt-6 print:hidden">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-bold leading-6 text-gray-900"
                    >
                      Tu Plan de Estudio
                    </Dialog.Title>
                    <p className="mt-2 text-lg text-gray-700">{plan?.title}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Objetivo:{" "}
                      <span className="font-medium text-gray-800">
                        {plan?.goal}
                      </span>{" "}
                      · Nivel:{" "}
                      <span className="font-medium text-gray-800">
                        {plan?.level}
                      </span>
                      {hoursTotal ? (
                        <>
                          {" "}
                          | Dedicación total:{" "}
                          <span className="font-medium text-gray-800">
                            {hoursTotal} h
                          </span>
                        </>
                      ) : null}
                    </p>
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

                {/* Contenido con scroll interno */}
                <div className="mt-4 px-6 pb-6 max-h-[70vh] overflow-y-auto pr-1">
                  {/* Hero / resumen */}
                  <div className="rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white p-5 print:border print:border-slate-200">
                    <div className="md:flex md:items-center md:justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-semibold">Resumen</h4>
                        <p className="opacity-90">{summary}</p>
                      </div>
                      <div className="mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="opacity-90">Duración</div>
                          <div className="font-semibold">
                            {plan?.durationWeeks || plan?.weeks} semanas
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="opacity-90">Horas / semana</div>
                          <div className="font-semibold">
                            {plan?.hoursPerWeek}
                          </div>
                        </div>
                        {roles?.length ? (
                          <div className="bg-white/10 rounded-lg p-3 col-span-2 md:col-span-1">
                            <div className="opacity-90">Rol objetivo</div>
                            <div className="font-semibold">{roles[0]}</div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Habilidades + roles/salario */}
                  <div className="mt-6 grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
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
                    </div>

                    <div className="md:col-span-1 space-y-3">
                      <h5 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                        Tu siguiente paso
                      </h5>

                      {roles?.length ? (
                        <div className="rounded-lg border border-slate-200 bg-white p-4">
                          <div className="flex items-center gap-2 text-slate-800 font-semibold">
                            <BriefcaseIcon className="h-5 w-5" />
                            Roles objetivo
                          </div>
                          <ul className="mt-2 text-sm text-slate-700 list-disc pl-5">
                            {roles.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {salary?.length ? (
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
                            *Estimaciones informativas. Pueden variar según
                            mercado, región y experiencia.
                          </p>
                        </div>
                      ) : null}

                      <button
                        type="button"
                        className="mt-2 inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
                        onClick={() => alert("Checklist inicial pronto 😉")}
                      >
                        <RocketLaunchIcon className="h-5 w-5" />
                        Empezar checklist
                      </button>
                    </div>
                  </div>

                  {/* Módulos */}
                  <div className="mt-6 space-y-5">
                    <h5 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                      Módulos del plan
                    </h5>
                    {modules.map((module, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                      >
                        <div className="flex items-center">
                          <BookOpenIcon className="h-6 w-6 text-sky-600 mr-3" />
                          <h4 className="text-lg font-semibold text-gray-800">
                            {module.title}
                          </h4>
                        </div>
                        <ul className="mt-3 ml-9 list-disc space-y-2 pl-5 text-gray-700">
                          {(module.bullets || []).map((lesson, lessonIndex) => (
                            <li key={lessonIndex} className="flex items-start">
                              <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{lesson}</span>
                            </li>
                          ))}
                        </ul>
                        {(module.project || module.role) && (
                          <div className="mt-3 ml-9 text-sm text-slate-600">
                            {module.project && (
                              <div>
                                <span className="font-medium text-slate-800">
                                  Proyecto:{" "}
                                </span>
                                {module.project}
                              </div>
                            )}
                            {module.role && (
                              <div>
                                <span className="font-medium text-slate-800">
                                  Rol simulado:{" "}
                                </span>
                                {module.role}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acciones fijas abajo */}
                <div className="px-6 pb-6 flex flex-wrap gap-3 justify-end print:hidden">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    onClick={handleExportJSON}
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    Descargar JSON
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    onClick={handlePrintPDF}
                  >
                    <PrinterIcon className="h-5 w-5" />
                    Exportar PDF
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
                    onClick={handleSave}
                  >
                    <BookmarkIcon className="h-5 w-5" />
                    Guardar en mi perfil
                  </button>
                </div>

                {/* Pie impresión */}
                <div className="hidden print:block mt-8 text-xs text-slate-500">
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
