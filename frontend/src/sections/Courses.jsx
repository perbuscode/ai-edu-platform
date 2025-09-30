// src/sections/Courses.jsx
import React, { useEffect, useMemo, useRef } from "react";
import { useDashboard } from "../context/DashboardProvider";

const Skeleton = () => (
  <div
    className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] mt-4 animate-pulse"
    aria-hidden="true"
  >
    {[0, 1].map((index) => (
      <div
        key={index}
        className="bg-white rounded-xl border border-slate-200 p-6 space-y-3"
      >
        <div className="h-6 w-16 bg-slate-200 rounded" />
        <div className="h-5 w-3/4 bg-slate-200 rounded" />
        <div className="h-4 w-full bg-slate-200 rounded" />
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="col-span-full bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
    Aún no tienes cursos asignados.
  </div>
);

const ErrorPanel = ({ msg, onRetry }) => (
  <div
    className="mt-4 text-sm text-rose-500 flex items-center gap-2"
    role="status"
    aria-live="polite"
  >
    <span>Error: {msg}</span>
    <button
      type="button"
      className="underline font-medium text-rose-500 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
      onClick={onRetry}
    >
      Reintentar
    </button>
  </div>
);

export default function Courses({ observe, onOpenCourse, onOpenCerts }) {
  const sectionRef = useRef(null);
  useEffect(
    () => (observe ? observe(sectionRef.current) : undefined),
    [observe]
  );

  const { courses, loading, error, refresh } = useDashboard();

  const normalizedCourses = useMemo(() => {
    if (!Array.isArray(courses)) return [];
    return courses.map((course) => ({
      id: course.id,
      title: course.title ?? course.name ?? "Curso",
      description: course.description ?? course.summary ?? "",
      progress: course.progress ?? course.pct ?? 0,
    }));
  }, [courses]);

  let content;
  if (loading) {
    content = <Skeleton />;
  } else if (error) {
    content = <ErrorPanel msg={error} onRetry={refresh} />;
  } else if (normalizedCourses.length === 0) {
    content = (
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] mt-4">
        <EmptyState />
      </div>
    );
  } else {
    content = (
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] mt-4">
        {normalizedCourses.map((course) => (
          <article
            key={course.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
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
              <span className="text-sm text-brand-primary font-medium whitespace-nowrap">
                {course.progress}% completado
              </span>
            </div>
            <h4 className="text-lg font-semibold text-slate-900 leading-tight">
              {course.title}
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {course.description}
            </p>
            <div className="mt-auto grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => (onOpenCourse ? onOpenCourse(course) : null)}
                className="w-full px-3 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium text-center shadow hover:bg-brand-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
              >
                Ver curso
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onOpenCerts) {
                    onOpenCerts();
                    return;
                  }
                  const element = document.getElementById("certificaciones");
                  if (element) {
                    try {
                      element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    } catch (_error) {
                      element.scrollIntoView();
                    }
                  }
                }}
                title="Ir a Certificaciones"
                className="w-full px-3 py-2 rounded-lg text-sm font-medium text-center border border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
              >
                Certificado
              </button>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <section
      id="cursos"
      ref={sectionRef}
      className="scroll-mt-20 bg-white rounded-xl shadow-xl border border-slate-200 p-6 text-slate-900"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold text-slate-900">Mis cursos</h3>
      </div>
      <p className="text-sm text-slate-600">
        Gestiona módulos y certificaciones activas.
      </p>
      {content}
    </section>
  );
}
