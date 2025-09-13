// src/components/Testimonials.jsx
import React from "react";

const genericAvatar = encodeURI(`data:image/svg+xml;utf8,
  <svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='%230ea5e9'/>
        <stop offset='100%' stop-color='%237c3aed'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' rx='48' fill='url(%23g)'/>
    <g fill='white' opacity='0.9' transform='translate(20,20)'>
      <circle cx='28' cy='20' r='12'/>
      <path d='M8 48c0-11 9-20 20-20s20 9 20 20v4H8v-4z'/>
    </g>
  </svg>`);

export default function Testimonials() {
  const items = [
    { text: "Conseguí mi primer rol de BI mostrando dashboards de alto impacto en entrevistas.", author: "Ana González", country: "🇨🇴 Colombia", course: "Analista de Datos (Power BI)" },
    { text: "Pasé de dudar a construir y lanzar microproyectos cada semana.", author: "Carlos Medina", country: "🇲🇽 México", course: "Aprender a programar" },
    { text: "Me sentí acompañada y evaluada con criterios claros hasta lograr mi objetivo.", author: "Laura Pérez", country: "🇪🇸 España", course: "Cursos de idiomas" },
  ];

  return (
    <section id="historias" className="py-8 md:py-10 bg-slate-900 scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Historias reales de avance</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <article key={i} className="bg-white rounded-2xl p-5 shadow-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <img src={genericAvatar} alt={`Avatar genérico`} className="w-12 h-12 rounded-full ring-1 ring-slate-200" />
                <div>
                  <div className="font-semibold text-slate-900">{t.author}</div>
                  <div className="text-xs text-slate-600">{t.country} • {t.course}</div>
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
