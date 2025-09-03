import React from "react";
import { FaSlidersH, FaTasks, FaUserFriends, FaBriefcase } from "react-icons/fa";

export default function ValueSection() {
  const items = [
    {
      icon: <FaSlidersH className="text-slate-700" />,
      title: "Personalización real",
      desc: "Plan adaptado a tu nivel, tiempo y meta.",
      accent: "bg-sky-400",
    },
    {
      icon: <FaTasks className="text-slate-700" />,
      title: "Proyectos reales",
      desc: "Entregables que validan tu aprendizaje.",
      accent: "bg-indigo-400",
    },
    {
      icon: <FaUserFriends className="text-slate-700" />,
      title: "Mentoría y seguimiento",
      desc: "Acompañamiento constante y ajustes en el camino.",
      accent: "bg-violet-400",
    },
    {
      icon: <FaBriefcase className="text-slate-700" />,
      title: "Preparación laboral",
      desc: "CV, entrevistas y portfolio orientado a empleabilidad.",
      accent: "bg-emerald-400",
    },
  ];

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Nuestro valor</h2>
        <p className="text-slate-600 mt-2">
          Plan hecho para ti • Ruta con proyectos • Tutoría y seguimiento • Preparación laboral
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <div
              key={i}
              className="relative rounded-2xl bg-white shadow-xl border border-slate-200 p-7"
            >
              <div className={`absolute -top-1 left-0 right-0 h-1.5 rounded-t-2xl ${it.accent}`} />
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-slate-100 grid place-items-center">
                  {it.icon}
                </div>
                <h3 className="font-semibold text-slate-900">{it.title}</h3>
              </div>
              <p className="text-slate-600 text-sm mt-3">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
