import React from "react";

const courses = [
  {
    title: "Introducción a la inteligencia artificial",
    description: "Aprende los fundamentos de la IA y sus aplicaciones.",
    image: "/images/ai.png",
    alt: "Panel con visualizaciones de inteligencia artificial",
  },
  {
    title: "Aprender a programar",
    description: "Domina los lenguajes de programación más populares.",
    image: "/images/programacion.png",
    alt: "Persona programando en un ordenador portátil",
  },
  {
    title: "Cursos de idiomas",
    description: "Mejora tus habilidades lingüísticas con nuestros cursos.",
    image: "/images/idiomas.png",
    alt: "Libros y material de estudio de idiomas",
  },
];

export default function Courses() {
  return (
    <section id="cursos" className="bg-slate-900 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Cursos destacados
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {courses.map((c, i) => (
            <article
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow-xl border border-slate-200"
            >
              <img
                src={c.image}
                alt={c.alt}
                className="h-44 w-full object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <h3 className="font-semibold text-gray-900">{c.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                <a
                  href="#"
                  className="inline-block mt-4 text-sm font-medium text-slate-800 hover:underline"
                >
                  Ver curso
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
