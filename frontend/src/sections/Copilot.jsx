// src/sections/Copilot.jsx
import React, { useEffect, useRef } from "react";

export default function Copilot({ observe }) {
  const ref = useRef(null);
  useEffect(() => (observe ? observe(ref.current) : undefined), [observe]);
  return (
    <section id="copilot" ref={ref} className="scroll-mt-20 bg-white rounded-xl shadow-xl border border-slate-200 p-6 text-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Co-pilot de proyectos</h3>
          <p className="text-sm text-slate-600 mt-1">Analiza tu entrega, sugiere mejoras y recalcula un puntaje de calidad.</p>
        </div>
        <a href="#intro" className="hidden md:inline-flex px-3 py-2 rounded-lg bg-slate-900 text-white text-sm">Volver al inicio</a>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Resumen */}
        <div className="md:col-span-1 border border-slate-200 rounded-lg p-4">
          <h4 className="font-medium text-slate-900">Resumen de análisis</h4>
          <ul className="mt-2 text-sm space-y-1">
            <li>Claridad: <span className="font-semibold">58</span></li>
            <li>Orden visual: <span className="font-semibold">55</span></li>
            <li>Mensaje ejecutivo: <span className="font-semibold">52</span></li>
            <li className="mt-2">Total: <span className="font-semibold">55</span></li>
          </ul>
        </div>

        {/* Observaciones */}
        <div className="md:col-span-1 border border-slate-200 rounded-lg p-4">
          <h4 className="font-medium text-slate-900">Observaciones</h4>
          <ul className="mt-2 text-sm space-y-2">
            <li className="flex items-start gap-2"><span className="mt-1 w-2 h-2 rounded-full bg-red-500"></span> Falta unidad "USD" en el gráfico principal.</li>
            <li className="flex items-start gap-2"><span className="mt-1 w-2 h-2 rounded-full bg-yellow-500"></span> Demasiados gráficos en una vista (ruido).</li>
          </ul>
        </div>

        {/* Parches */}
        <div className="md:col-span-1 border border-slate-200 rounded-lg p-4">
          <h4 className="font-medium text-slate-900">Parches sugeridos</h4>
          <div className="mt-2 space-y-3 text-sm">
            <div className="border border-slate-200 rounded-lg p-3">
              <p className="font-medium">Añadir unidades al gráfico</p>
              <p className="text-slate-600">Ej.: "Ventas totales (USD)"</p>
              <div className="mt-2 flex gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs">Aplicar</button>
                <button className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-800 text-xs">Posponer</button>
              </div>
            </div>
            <div className="border border-slate-200 rounded-lg p-3">
              <p className="font-medium">Reducir ruido visual</p>
              <ul className="mt-1 list-disc pl-5 text-slate-700">
                <li>Dejar 1 panel de KPIs + 2 gráficos clave</li>
                <li>Paleta accesible AA</li>
                <li>Títulos y unidades en ejes</li>
              </ul>
              <div className="mt-2">
                <button className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs">Marcar como aplicado</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación inferior eliminada */}
    </section>
  );
}

