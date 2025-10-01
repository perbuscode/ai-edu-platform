// src/components/ChatPlanner.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import useChatWizard from "../hooks/useChatWizard.js";
import StudyPlanModal from "./StudyPlanModal.jsx";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext.jsx";
import { saveStudyPlan } from "../services/planService.js";
import { useToast } from "./Toast.jsx";
import { askGemini } from "../services/geminiClient"; // ⬅️ nuevo

export default function ChatPlanner() {
  const [input, setInput] = useState("");
  const { messages, loadingPlan, step, submitTurn } = useChatWizard();
  const { user } = useAuth();
  const toast = useToast();

  const [isPlanOpen, setPlanOpen] = useState(false);
  const [plan, setPlan] = useState(null);

  // ⬇️ Estados locales para la respuesta de Gemini vía Netlify Function
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [geminiError, setGeminiError] = useState("");
  const [geminiReply, setGeminiReply] = useState("");

  const suggestions = [
    "Power BI para BI Analyst",
    "Programación desde cero (frontend)",
    "Inglés para negocios (B2)",
  ];

  const placeholders = [
    "Ej: Power BI para analista",
    "¿Tienes experiencia previa? (sí/no o una breve descripción)",
    "¿Cuántas horas al día dedicarás?",
    "¿En cuántas semanas quieres lograrlo?",
  ];

  // ⬇️ Busca el último mensaje del asistente que contenga un plan
  const lastAssistantPlan = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m?.role === "assistant" && m?.plan) return m.plan;
    }
    return null;
  }, [messages]);

  // ⬇️ Abre el modal cuando llegue un plan nuevo
  useEffect(() => {
    if (lastAssistantPlan) {
      setPlan(lastAssistantPlan);
      setPlanOpen(true);
    }
  }, [lastAssistantPlan]);

  async function handleSavePlan(planToSave) {
    if (!user) {
      toast.error("Necesitas iniciar sesión para guardar tu plan.");
      return;
    }
    try {
      await saveStudyPlan(user.uid, planToSave);
      toast.success("¡Plan guardado en tu perfil!");
      setPlanOpen(false);
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error("No se pudo guardar el plan. Intenta de nuevo.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");

    // 1) tu flujo original (hook del asistente)
    submitTurn(text);

    // 2) además, consulta a Gemini por la Function (no interfiere con tu hook)
    setGeminiError("");
    setGeminiReply("");
    setGeminiLoading(true);
    try {
      const reply = await askGemini(text);
      setGeminiReply(reply || "");
    } catch (err) {
      console.error("Gemini (Function) error:", err);
      const msg = err?.message || "Error hablando con Gemini";
      setGeminiError(msg);
      toast.error(msg);
    } finally {
      setGeminiLoading(false);
    }
  }

  // Prefill externo
  useEffect(() => {
    const onPrefill = (ev) => {
      const text = ev?.detail?.text;
      if (!text) return;
      if (step === 0) {
        // Si estamos en el primer paso, dispara directo
        setInput("");
        submitTurn(text);
        // Y consulta a Gemini también
        (async () => {
          setGeminiError("");
          setGeminiReply("");
          setGeminiLoading(true);
          try {
            const reply = await askGemini(text);
            setGeminiReply(reply || "");
          } catch (err) {
            const msg = err?.message || "Error hablando con Gemini";
            setGeminiError(msg);
            toast.error(msg);
          } finally {
            setGeminiLoading(false);
          }
        })();
      } else {
        setInput(text);
      }
    };
    window.addEventListener("prefill-plan", onPrefill);
    return () => window.removeEventListener("prefill-plan", onPrefill);
  }, [step, submitTurn, toast]);

  const listRef = useRef(null);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    try {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } catch {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, geminiReply, geminiLoading, geminiError]);

  const imgPlaceholder = encodeURI(`data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='%230ea5e9'/>
          <stop offset='100%' stop-color='%237c3aed'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' rx='24' fill='url(%23g)'/>
      <g fill='white' fill-opacity='0.85' transform='translate(120,120)'>
        <rect x='0' y='0' width='420' height='16' rx='8'/>
        <rect x='0' y='32' width='360' height='12' rx='6' opacity='0.7'/>
        <rect x='0' y='52' width='300' height='12' rx='6' opacity='0.6'/>
        <rect x='0' y='92' width='420' height='16' rx='8'/>
        <rect x='0' y='124' width='380' height='12' rx='6' opacity='0.7'/>
      </g>
      <circle cx='640' cy='160' r='60' fill='white' fill-opacity='0.2'/>
      <text x='680' y='560' text-anchor='end' font-size='30' font-family='Inter,Arial' fill='white' fill-opacity='0.95' font-weight='700'>Plan de Estudio</text>
    </svg>`);

  return (
    <>
      <section
        id="plan"
        className="bg-slate-900 py-8 md:py-10 scroll-mt-24 md:scroll-mt-28"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Genera tu plan
            </h2>
          </div>

          <div className="mt-6 grid md:grid-cols-5 gap-6">
            {/* Ilustración */}
            <div className="hidden md:block md:col-span-2">
              <div className="w-full h-full rounded-2xl overflow-hidden">
                <img
                  src="/images/study-plan.png"
                  alt="Ilustración plan de estudio"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = imgPlaceholder;
                  }}
                />
              </div>
            </div>

            {/* Chat */}
            <div className="md:col-span-3 bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 relative h-[480px] flex flex-col overflow-hidden">
              <div
                ref={listRef}
                className="space-y-3 flex-1 overflow-auto pr-1"
              >
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
                      <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-semibold">
                        AI
                      </div>
                    )}
                    <div
                      className={
                        m.role === "assistant"
                          ? "rounded-2xl px-4 py-3 bg-slate-100 text-slate-900 shadow prose prose-sm max-w-none"
                          : "rounded-2xl px-4 py-3 bg-sky-600 text-white shadow"
                      }
                    >
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                    {m.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                        Tú
                      </div>
                    )}
                  </div>
                ))}

                {/* Burbuja adicional para la respuesta de la Function (Gemini 2.5) */}
                {(geminiLoading || geminiReply || geminiError) && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-semibold">
                      AI
                    </div>
                    <div className="rounded-2xl px-4 py-3 bg-slate-100 text-slate-900 shadow prose prose-sm max-w-none">
                      {geminiLoading && (
                        <span className="italic text-slate-500">
                          Gemini está escribiendo…
                        </span>
                      )}
                      {!geminiLoading && geminiError && (
                        <span className="text-red-600">
                          ⚠️ {geminiError}
                        </span>
                      )}
                      {!geminiLoading && !geminiError && geminiReply && (
                        <ReactMarkdown>{geminiReply}</ReactMarkdown>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="mt-4">
                <label htmlFor="chat-input" className="sr-only">
                  Entrada del chat
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 bg-white">
                    <input
                      id="chat-input"
                      className="flex-1 outline-none text-slate-900 bg-transparent placeholder-slate-500 placeholder:italic appearance-none"
                      placeholder={
                        placeholders[Math.min(step, placeholders.length - 1)]
                      }
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                    />
                  </div>
                  <button
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
                    disabled={loadingPlan || geminiLoading}
                    aria-busy={loadingPlan || geminiLoading || undefined}
                  >
                    {loadingPlan || geminiLoading ? "Generando…" : "Enviar"}
                  </button>
                </div>
              </form>

              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInput(s);
                      // dispara envío inmediato
                      setTimeout(() => {
                        const fakeEvent = { preventDefault() { } };
                        handleSubmit(fakeEvent);
                      }, 0);
                    }}
                    className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                    disabled={loadingPlan || geminiLoading}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal del plan */}
      <StudyPlanModal
        plan={plan}
        isOpen={isPlanOpen}
        onClose={() => setPlanOpen(false)}
        onSave={handleSavePlan}
        isAuthenticated={!!user}
      />
    </>
  );
}
