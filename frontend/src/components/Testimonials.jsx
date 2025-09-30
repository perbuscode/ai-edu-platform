// src/components/Testimonials.jsx
import React from "react";
import { testimonials } from "../data/testimonials.mock";

export default function Testimonials() {
  return (
    <section
      id="historias"
      className="py-8 md:py-10 bg-slate-900 scroll-mt-24 md:scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Historias reales de avance
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.id}
              className="bg-white rounded-2xl p-5 shadow-xl border border-slate-200"
            >
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-12 h-12 rounded-full ring-1 ring-slate-200"
                />
                <div>
                  <div className="font-semibold text-slate-900">{t.author}</div>
                  <div className="text-xs text-slate-600">
                    {t.country} • {t.course}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-slate-800 text-[15px] leading-relaxed">
                “{t.text}”
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
