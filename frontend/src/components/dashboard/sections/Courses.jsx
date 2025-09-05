// src/components/dashboard/sections/Courses.jsx
import React from "react";

export default function Courses({ courses = [], onOpenCourse }) {
  return (
    <div className="p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Mis Cursos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c, i) => (
          <article key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{c.title}</h4>
            <p className="text-gray-600 text-sm mb-4">{c.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600 font-medium">{c.progress}% completado</span>
              <div className="flex items-center gap-2">
                <button onClick={()=>onOpenCourse?.(c.title)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">Ver curso</button>
                <button disabled={c.progress < 100} title={c.progress<100? 'Completa el curso para habilitar el certificado' : 'Descargar certificado'} className={`px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 ${c.progress<100 ? 'opacity-50 cursor-not-allowed' : ''}`}>Certificado</button>
              </div>
            </div>
          </article>
        ))}
        {courses.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            Aún no tienes cursos asignados.
          </div>
        )}
      </div>
    </div>
  );
}
