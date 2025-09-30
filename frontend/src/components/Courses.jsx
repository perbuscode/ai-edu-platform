// src/components/Courses.jsx
import React from "react";
import { featuredCourses } from "../data/courses.mock";

export default function Courses() {
  const selectCourse = (title, e) => {
    if (e) e.preventDefault();
    try {
      window.dispatchEvent(
        new CustomEvent("prefill-plan", { detail: { text: title } })
      );
    } catch (_error) {
      // noop
    }
    // Robust scroll to chat section
    const go = () => {
      const el = document.getElementById("plan");
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.hash = "#plan";
      }
    };
    go();
    // Fallback in case hash change is needed to mount/position
    setTimeout(go, 50);
  };
  return (
    <section
      id="cursos"
      className="bg-slate-900 py-8 md:py-10 scroll-mt-24 md:scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Cursos destacados
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {featuredCourses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl overflow-hidden shadow-xl border border-slate-200 hover:shadow-2xl transition-shadow cursor-pointer"
              onClick={() => selectCourse(c.title)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  selectCourse(c.title);
                }
              }}
              role="button"
              tabIndex="0"
            >
              <img
                src={c.img}
                alt={c.title}
                className="w-full h-44 object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = c.placeholder;
                }}
              />
              <div className="p-5">
                <h3 className="font-semibold text-gray-900">{c.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                <a
                  href="#plan"
                  onClick={(e) => selectCourse(c.title, e)}
                  className="group relative inline-flex items-center justify-center mt-4 text-sm font-medium px-3 py-1.5 rounded-md border border-sky-300 hover:border-sky-700 text-sky-700 hover:text-white overflow-hidden transition-colors duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <span className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-sky-600 to-indigo-600 transition-all duration-300 ease-out group-hover:w-full" />
                  <span className="relative z-10">Ver curso</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
