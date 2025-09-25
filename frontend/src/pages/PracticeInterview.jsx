// src/pages/PracticeInterview.jsx
import React, { useState } from "react";
import Topbar from "../components/Topbar";

const sessionTips = [
  "Presentate en un minuto con tu propuesta de valor.",
  "Describe un proyecto reciente, tu rol y el impacto logrado.",
  "Comparte un reto tecnico y como lo resolviste paso a paso.",
  "Explica un aprendizaje clave y como lo aplicaste despues.",
];

const followUps = [
  "Que te motivo a trabajar en este proyecto?",
  "Como defines el exito en tu rol actual?",
  "Que indicadores usaste para medir resultados?",
];

export default function PracticeInterview() {
  const [openGuide, setOpenGuide] = useState(false);

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100">
      <Topbar leftOffsetClass="left-0" showLogo title="Simulacion de entrevista" />
      <main className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-6">
          <section className="bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
            <header className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Simulacion de entrevista</h1>
                <p className="mt-1 text-sm text-slate-600">Practica respuestas, lenguaje corporal y metricas clave antes de tu entrevista real.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setOpenGuide(true)}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Guia rapida
                </button>
                <button className="px-3 py-2 rounded-lg bg-slate-900 text-sm text-white hover:bg-slate-800">Iniciar grabacion</button>
              </div>
            </header>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="aspect-video w-full rounded-2xl bg-slate-900/90 text-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 grid place-items-center text-lg font-medium tracking-wide">
                    Entrevistador
                  </div>
                  <div className="absolute bottom-4 right-4 text-xs uppercase tracking-[0.3em] text-white/70">Live</div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800">Audio</button>
                  <button className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800">Video</button>
                  <button className="px-3 py-2 rounded-lg bg-rose-500 text-white text-sm hover:bg-rose-400">Finalizar sesion</button>
                  <span className="text-xs text-slate-500">Consejo: manten contacto visual y responde en 2 minutos.</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="aspect-video w-full rounded-xl bg-slate-200 grid place-items-center text-sm text-slate-600">
                    Tu camara
                  </div>
                  <p className="mt-3 text-xs text-slate-500">Verifica encuadre, iluminacion y tono de voz antes de responder.</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h2 className="text-sm font-semibold text-slate-900">Guia de la sesion</h2>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
                    {sessionTips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h3 className="text-sm font-semibold text-slate-900">Preguntas de seguimiento</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
                    {followUps.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-slate-500">Practica como cerrar con metricas y aprendizajes.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      {openGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4" role="dialog" aria-modal="true" onClick={() => setOpenGuide(false)}>
          <div
            className="max-w-md w-full rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Guia rapida</h2>
                <p className="text-xs text-slate-500">Consejos para destacar en tu entrevista.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenGuide(false)}
                className="px-2 py-1 text-sm rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                Cerrar
              </button>
            </header>
            <div className="px-5 py-4 space-y-3 text-sm text-slate-700">
              <p>Aplica estos puntos antes y durante la sesion:</p>
              <ul className="space-y-2 list-disc pl-5">
                {sessionTips.map((tip) => (
                  <li key={`guide-${tip}`}>{tip}</li>
                ))}
              </ul>
              <p className="text-xs text-slate-500">Respira, escucha con atencion y aterriza tus respuestas en indicadores.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
