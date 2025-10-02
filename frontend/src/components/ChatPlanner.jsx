// frontend/src/components/ChatPlanner.jsx
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import useChatWizard from "../hooks/useChatWizard.js";
import StudyPlanModal from "./StudyPlanModal.jsx";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext.jsx";
import { saveStudyPlan, generatePlan } from "../services/planService.js";
import { useToast } from "./Toast.jsx";

/** Convierte el plan "simple" del backend
 *  {
 *    objective, level, hoursPerWeek, weeks,
 *    weeksPlan: [{week, goals[], resources[], tasks[]}]
 *  }
 *  a un shape "rico" que muchos modales esperan
 *  {
 *    title, goal, level, hoursPerWeek, durationWeeks,
 *    blocks: [{ title, bullets, project, role, lessonHours[], projectHours }],
 *    rubric, skills, roles, salary, summary
 *  }
 */
function normalizePlanForModal(raw) {
  if (!raw || typeof raw !== "object") return null;

  const objective = raw.objective ?? "Plan de estudio";
  const level = raw.level ?? "No especificado";
  const hoursPerWeek = Number(raw.hoursPerWeek ?? 6) || 6;
  const durationWeeks = Number(raw.weeks ?? raw.durationWeeks ?? 4) || 4;

  const blocks =
    Array.isArray(raw.weeksPlan)
      ? raw.weeksPlan.map(w => {
          const title = `Semana ${w.week ?? "?"}`;
          const bullets = Array.isArray(w.goals) ? w.goals : [];
          // si hay N bullets y no vienen horas, rellena con 0
          const lessonHours = new Array(bullets.length).fill(0);
          return {
            title,
            bullets,
            project: "",     // si luego agregas proyectos, se llena
            role: "",        // idem
            lessonHours,     // 1:1 con bullets
            projectHours: 0, // 0 si no hay proyecto
          };
        })
      : [];

  return {
    title: `Plan: ${objective}`,
    goal: objective,
    level,
    hoursPerWeek,
    durationWeeks,
    blocks,
    rubric: Array.isArray(raw.rubric) ? raw.rubric : [],
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    roles: Array.isArray(raw.roles) ? raw.roles : [],
    salary: Array.isArray(raw.salary) ? raw.salary : [],
    summary:
      typeof raw.summary === "string"
        ? raw.summary
        : `Plan de ${durationWeeks} semanas a ${hoursPerWeek} h/semana.`,
    // Conserva el original por si el modal quiere leer el plan simple:
    _raw: raw,
  };
}

export default function ChatPlanner() {
  const [input, setInput] = useState("");
  const { messages, loadingPlan, step, submitTurn } = useChatWizard();
  const { user } = useAuth();
  const toast = useToast();

  const [isPlanOpen, setPlanOpen] = useState(false);
  const [plan, setPlan] = useState(null);
  const generatingRef = useRef(false); // evita llamadas duplicadas

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

  // Respuestas del usuario (últimas 4)
  const userAnswers = useMemo(() => {
    const ans = messages.filter(m => m.role === "user").map(m => m.content || m.text || "");
    return ans.slice(-4);
  }, [messages]);

  // Si el hook ya adjunta un plan en un mensaje del asistente, úsalo:
  const wizardPlan = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m?.role === "assistant" && m?.plan) return m.plan;
    }
    return null;
  }, [messages]);

  // Abrir modal si el hook ya inyectó un plan (por compatibilidad)
  useEffect(() => {
    if (!wizardPlan) return;
    const normalized = normalizePlanForModal(wizardPlan) || wizardPlan;
    setPlan(normalized);
    setPlanOpen(true);
  }, [wizardPlan]);

  // 🚀 Plan “seguro”: en cuanto haya 4 respuestas, llama a /plan tú mismo,
  // así no dependes de que el hook adjunte m.plan.
  const maybeGeneratePlan = useCallback(async () => {
    if (generatingRef.current) return;
    if (wizardPlan) return; // ya lo trajo el hook
    if (userAnswers.length < 4) return;

    const [objective, level, hoursStr, weeksStr] = userAnswers;
    const hoursPerWeek = Number(hoursStr);
    const weeks = Number(weeksStr);

    if (!objective || !Number.isFinite(hoursPerWeek) || !Number.isFinite(weeks)) return;

    try {
      generatingRef.current = true;
      const rawPlan = await generatePlan(
        { objective, level, hoursPerWeek, weeks },
        { timeoutMs: 120000, retries: 0, allowAbort: false }
      );
      const normalized = normalizePlanForModal(rawPlan) || rawPlan;
      setPlan(normalized);
      setPlanOpen(true);
    } catch (err) {
      console.error("[ChatPlanner] Error generando plan /plan:", err);
      toast.error(err?.message || "No se pudo generar el plan. Intenta de nuevo.");
    } finally {
      generatingRef.current = false;
    }
  }, [userAnswers, wizardPlan, toast]);

  useEffect(() => { maybeGeneratePlan(); }, [maybeGeneratePlan]);

  async function handleSavePlan(planToSave) {
    // Tu servicio saveStudyPlan(plan) no recibe uid; guarda localmente o
    // más adelante podrás conectarlo a un endpoint real.
    try {
      await saveStudyPlan(
        {
          objective: planToSave?._raw?.objective ?? planToSave?.goal ?? "Plan",
          level: planToSave?.level ?? "No especificado",
          hoursPerWeek: planToSave?.hoursPerWeek ?? 6,
          weeks: planToSave?.durationWeeks ?? planToSave?._raw?.weeks ?? 4,
        },
        { timeoutMs: 120000 }
      );
      toast.success("¡Plan guardado!");
      setPlanOpen(false);
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error("No se pudo guardar el plan. Intenta de nuevo.");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    submitTurn(text);
  }

  useEffect(() => {
    const onPrefill = (ev) => {
      const text = ev?.detail?.text;
      if (!text) return;
      if (step === 0) submitTurn(text);
      else setInput(text);
    };
    window.addEventListener("prefill-plan", onPrefill);
    return () => window.removeEventListener("prefill-plan", onPrefill);
  }, [step, submitTurn]);

  const listRef = useRef(null);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    try {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } catch {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

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
              <div ref={listRef} className="space-y-3 flex-1 overflow-auto pr-1">
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
                      placeholder={placeholders[Math.min(step, placeholders.length - 1)]}
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
                    disabled={loadingPlan || generatingRef.current}
                    aria-busy={loadingPlan || generatingRef.current || undefined}
                  >
                    {loadingPlan || generatingRef.current ? "Generando…" : "Enviar"}
                  </button>
                </div>
              </form>

              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                    disabled={loadingPlan || generatingRef.current}
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
