// src/sections/SkillsWallet.jsx
import React, { useEffect, useRef } from "react";

export default function SkillsWallet({ observe }) {
  const ref = useRef(null);
  useEffect(() => (observe ? observe(ref.current) : undefined), [observe]);
  return (
    <section
      id="wallet"
      ref={ref}
      className="scroll-mt-20 bg-white rounded-xl shadow-xl border border-slate-200 p-6 text-slate-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Skills Wallet - Evidencia verificable
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Comparte un link/QR verificable con tus evidencias y rúbricas.
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <button className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm">
            Copiar enlace
          </button>
          <button className="px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm">
            Descargar PDF
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* QR / Link */}
        <div className="md:col-span-1">
          <div className="w-full aspect-square bg-slate-100 rounded-xl border border-slate-200 grid place-items-center">
            <span className="text-slate-400 text-xs">[ QR ]</span>
          </div>
          <div className="mt-3 flex gap-2 md:hidden">
            <button className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm">
              Copiar enlace
            </button>
            <button className="px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm">
              Descargar PDF
            </button>
          </div>
        </div>

        {/* Evidencias */}
        <div className="md:col-span-2">
          <h4 className="font-medium text-slate-900">Evidencias</h4>
          <ul className="mt-2 space-y-3 text-sm">
            <li className="flex items-start justify-between border border-slate-200 rounded-lg p-3">
              <div>
                <p className="font-medium text-slate-900">
                  Dashboard de Ventas (Proyecto)
                </p>
                <p className="text-slate-600">
                  Rúbrica: Correctitud 4/6 · UX 4/6 · Performance 3/6
                </p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">
                Aprobado
              </span>
            </li>
            <li className="flex items-start justify-between border border-slate-200 rounded-lg p-3">
              <div>
                <p className="font-medium text-slate-900">
                  Quiz DAX Intermedio
                </p>
                <p className="text-slate-600">Score: 82/100 · Tiempo: 11 min</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-sky-100 text-sky-800">
                Verificable
              </span>
            </li>
            <li className="flex items-start justify-between border border-slate-200 rounded-lg p-3">
              <div>
                <p className="font-medium text-slate-900">
                  Inglés B2 (Speaking)
                </p>
                <p className="text-slate-600">Demo call grabada · 6 min</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                En revisión
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Navegación inferior eliminada */}
    </section>
  );
}
