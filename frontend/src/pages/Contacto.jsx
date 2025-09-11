// src/pages/Contacto.jsx
import React from "react";

export default function Contacto() {
  return (
    <main className="pt-24 md:pt-28 bg-slate-900 min-h-screen">
      <div className="max-w-xl mx-auto px-4 md:px-6 py-10">
        <h1 className="text-3xl font-bold text-white">Contactar con un agente</h1>
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-slate-700">
          <p>¿Necesitas ayuda? Escríbenos y te responderemos pronto.</p>
          <ul className="text-sm list-disc pl-5">
            <li>Email: soporte@aiedu.example</li>
            <li>Horario: Lun–Vie, 9:00–18:00</li>
          </ul>
          <a href="#contacto" className="inline-block mt-2 text-sky-700 hover:underline">Ir al pie de página</a>
        </div>
      </div>
    </main>
  );
}

