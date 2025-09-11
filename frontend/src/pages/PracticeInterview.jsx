// src/pages/PracticeInterview.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";

export default function PracticeInterview() {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 min-h-screen">
      <Topbar />
      <main className="pl-64 pt-16 pb-12">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Simulación de entrevista</h1>
            <button onClick={() => navigate('/dashboard#empleo')} className="px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm">Volver</button>
          </div>

          <section className="bg-white rounded-xl shadow border border-slate-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden">
                  <div className="absolute inset-0 grid place-items-center text-slate-300">Tu cámara</div>
                  <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                    <button className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20">Mic</button>
                    <button className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20">Cámara</button>
                    <button className="px-3 py-2 rounded-lg bg-rose-600 text-white text-sm">Finalizar</button>
                  </div>
                </div>
              </div>
              <div className="md:col-span-1">
                <div className="aspect-video bg-slate-200 rounded-xl grid place-items-center text-slate-600">Entrevistador</div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-slate-900">Guía</h3>
                  <ul className="mt-2 text-sm text-slate-700 list-disc pl-5">
                    <li>Preséntate brevemente (1 min).</li>
                    <li>Describe un proyecto reciente y tu rol.</li>
                    <li>Cuenta un reto técnico y cómo lo resolviste.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

