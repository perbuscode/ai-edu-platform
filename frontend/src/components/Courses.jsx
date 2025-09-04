// src/components/Courses.jsx
import React from "react";

const svg = (title, scheme) => encodeURI(`data:image/svg+xml;utf8,
  <svg xmlns='http://www.w3.org/2000/svg' width='800' height='480' viewBox='0 0 800 480'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${scheme[0]}'/>
        <stop offset='100%' stop-color='${scheme[1]}'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(%23g)'/>
    <g fill='white' fill-opacity='0.2'>
      <circle cx='120' cy='120' r='80'/>
      <circle cx='220' cy='180' r='50'/>
      <circle cx='170' cy='240' r='70'/>
      <circle cx='650' cy='80' r='60'/>
      <circle cx='700' cy='160' r='40'/>
    </g>
    <g transform='translate(80,340)'>
      <rect x='0' y='0' width='360' height='18' rx='9' fill='white' fill-opacity='0.6' />
      <rect x='0' y='28' width='420' height='12' rx='6' fill='white' fill-opacity='0.35' />
      <rect x='0' y='48' width='280' height='12' rx='6' fill='white' fill-opacity='0.3' />
    </g>
    <text x='560' y='420' text-anchor='end' font-size='34' font-family='Inter,Arial' fill='white' fill-opacity='0.9' font-weight='700'>${title}</text>
  </svg>`);

const courses = [
  {
    title: "Introducción a la IA",
    description: "Fundamentos de IA y aplicaciones reales.",
    img: "/images/course-ai.png",
    placeholder: svg("Introducción a la IA", ["#0ea5e9", "#7c3aed"]) ,
  },
  {
    title: "Aprender a programar",
    description: "Domina lenguajes y bases de desarrollo.",
    img: "/images/course-code.jpg",
    placeholder: svg("Aprender a programar", ["#10b981", "#2563eb"]) ,
  },
  {
    title: "Cursos de idiomas",
    description: "Mejora tu inglés u otro idioma para negocios.",
    img: "/images/course-lang.jpg",
    placeholder: svg("Cursos de idiomas", ["#f59e0b", "#ef4444"]) ,
  },
];

export default function Courses() {
  const selectCourse = (title, e) => {
    if (e) e.preventDefault();
    try {
      window.dispatchEvent(new CustomEvent("prefill-plan", { detail: { text: title } }));
    } catch {}
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
    <section id="cursos" className="bg-slate-900 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Cursos destacados</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {courses.map((c, i) => (
            <article
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow-xl border border-slate-200 hover:shadow-2xl transition-shadow cursor-pointer"
              onClick={() => selectCourse(c.title)}
            >
              <img src={c.img} alt={c.title} className="w-full h-44 object-cover"
                   onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src=c.placeholder; }} />
              <div className="p-5">
                <h3 className="font-semibold text-gray-900">{c.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                <a
                  href="#plan"
                  onClick={(e)=>selectCourse(c.title, e)}
                  className="relative inline-flex items-center justify-center mt-4 text-sm font-medium px-3 py-1.5 rounded-md border border-sky-200 text-sky-700 hover:text-white overflow-hidden transition-[color,padding] duration-200 hover:px-3.5"
                >
                  <span className="absolute inset-y-0 left-0 w-0 bg-sky-600 transition-all duration-300 hover:w-full group-[&]:w-full"/>
                  <span className="relative z-10">Ver curso</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
