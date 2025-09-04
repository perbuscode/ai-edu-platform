// src/components/ChatPlanner.jsx
import React, { useEffect, useRef, useState } from "react";

export default function ChatPlanner() {
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0); // 0: curso, 1: experiencia, 2: horas/día, 3: semanas/objetivo
  const [answers, setAnswers] = useState({ course: "", experience: "", hours: "", weeks: "" });
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "¡Hola! Soy tu planificador. Primero, dime el curso o habilidad que quieres aprender.",
    },
  ]);

  const suggestions = [
    "Power BI para BI Analyst",
    "Programación desde cero (frontend)",
    "Inglés para negocios (B2)",
  ];

  const placeholders = [
    "Ej: Power BI para analista",
    "¿Tienes experiencia previa? (sí/no o breve)",
    "¿Cuántas horas al día dedicarás?",
    "¿En cuántas semanas quieres lograrlo?",
  ];

  function submitTurn(text) {
    const userMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    if (step === 0) {
      setAnswers((a) => ({ ...a, course: text }));
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Genial. ¿Tienes experiencia previa en este tema?" },
      ]);
      setStep(1);
    } else if (step === 1) {
      setAnswers((a) => ({ ...a, experience: text }));
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Perfecto. ¿Cuántas horas al día podrías dedicar?" },
      ]);
      setStep(2);
    } else if (step === 2) {
      setAnswers((a) => ({ ...a, hours: text }));
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Última: ¿en cuántas semanas te gustaría lograrlo?" },
      ]);
      setStep(3);
    } else {
      setAnswers((a) => ({ ...a, weeks: text }));
      const title = (answers.course || text || "tu objetivo");
      const planText = `✅ Plan creado para: ${title}. (MVP: ejemplo simulado)`;
      setMessages((m) => [
        ...m,
        { role: "assistant", content: planText },
      ]);
      // Abrir el modal del plan de ejemplo como cuando se hace clic en "Ver plan de ejemplo"
      try {
        window.dispatchEvent(new Event("open-example-plan"));
      } catch {}
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    submitTurn(text);
  }

  function generatePlan() {
    const title = answers.course || "tu objetivo";
    const planText = `✅ Plan creado para: ${title}. (MVP: ejemplo simulado)`;
    setMessages((m) => [...m, { role: "assistant", content: planText }]);
  }

  // Prefill from Courses
  useEffect(() => {
    const onPrefill = (ev) => {
      const text = ev?.detail?.text;
      if (!text) return;
      // If already provided course, just set input; else record as first turn
      if (step === 0) {
        submitTurn(text);
      } else {
        setInput(text);
      }
    };
    window.addEventListener("prefill-plan", onPrefill);
    return () => window.removeEventListener("prefill-plan", onPrefill);
  }, [step]);

  const listRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    try {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } catch {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <section id="plan" className="bg-slate-900 py-12 md:py-16 scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Genera tu plan</h2>
          <span className="text-xs md:text-sm text-white/70">MVP interactivo</span>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6 items-start">
          {/* Chat panel */}
          <div className="bg-white rounded-2xl p-5 shadow-2xl border border-slate-200">
            <div ref={listRef} className="space-y-3 max-h-[360px] overflow-auto pr-1">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "assistant"
                      ? "flex items-start gap-3"
                      : "flex items-start gap-3 justify-end"
                  }
                >
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-semibold">AI</div>
                  )}
                  <div
                    className={
                      m.role === "assistant"
                        ? "rounded-2xl px-4 py-3 bg-slate-100 text-slate-900 shadow"
                        : "rounded-2xl px-4 py-3 bg-sky-600 text-white shadow"
                    }
                  >
                    <p className="text-sm leading-relaxed">{m.content}</p>
                  </div>
                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">Tú</div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <label className="sr-only">Entrada del chat</label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 bg-white">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-500" aria-hidden="true"><path fill="currentColor" d="M4 4h16v12H5.17L4 17.17V4Zm2 4h12v2H6V8Zm0 4h8v2H6v-2Zm14 6H8v2h12v-2Z"/></svg>
                  <input
                    className="flex-1 outline-none text-slate-900 placeholder-slate-400"
                    placeholder={placeholders[Math.min(step, placeholders.length-1)]}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    aria-label="Entrada del chat"
                  />
                </div>
                <button className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800">
                  Enviar
                </button>
              </div>
            </form>

            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                >
                  {s}
                </button>
              ))}
            </div>
            {/* Autogenera al completar preguntas; botón no necesario */}
          </div>

          {/* Summary panel */}
          <div className="rounded-2xl p-5 shadow-xl bg-white border border-sky-100">
            <h3 className="font-semibold text-sky-700">¿Qué hace este planificador?</h3>
            <ul className="mt-2 text-sm space-y-1 text-slate-700 list-disc pl-5">
              <li>Convierte tu objetivo en un plan por bloques.</li>
              <li>Incluye proyectos reales y criterios de evaluación.</li>
              <li>Te da foco semanal con entregables claros.</li>
            </ul>
            <div className="mt-4 rounded-xl bg-sky-50 p-3 text-sm text-slate-700 border border-sky-100">
              Consejo: sé específico: “Power BI para BI Analyst junior en retail, 6-8h/semana”.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
