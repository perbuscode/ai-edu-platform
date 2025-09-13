// src/components/ChatPlanner.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { postJSON } from "../utils/api";
import { useToast } from "./Toast";

export default function ChatPlanner() {
  const { user } = useAuth();
  const toast = useToast();
  const db = useMemo(() => { try { return getFirestore(); } catch { return null; } }, []);

  const [input, setInput] = useState("");
  const [step, setStep] = useState(0); // 0: curso, 1: experiencia, 2: horas/día, 3: semanas
  const [answers, setAnswers] = useState({ course: "", experience: "", hours: "", weeks: "" });
  const [messages, setMessages] = useState([
    { role: "assistant", content: "¡Hola! Soy tu planificador. Primero, dime el curso o habilidad que quieres aprender." },
  ]);
  const [loadingPlan, setLoadingPlan] = useState(false);

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

  async function submitTurn(text) {
    const userMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    if (step === 0) {
      setAnswers((a) => ({ ...a, course: text }));
      setMessages((m) => [...m, { role: "assistant", content: "Genial. ¿Tienes experiencia previa en este tema?" }]);
      setStep(1);
    } else if (step === 1) {
      setAnswers((a) => ({ ...a, experience: text }));
      setMessages((m) => [...m, { role: "assistant", content: "Perfecto. ¿Cuántas horas al día podrías dedicar?" }]);
      setStep(2);
    } else if (step === 2) {
      setAnswers((a) => ({ ...a, hours: text }));
      setMessages((m) => [...m, { role: "assistant", content: "Última: ¿en cuántas semanas te gustaría lograrlo?" }]);
      setStep(3);
    } else {
      const next = { ...answers, weeks: text };
      setAnswers(next);
      try {
        setLoadingPlan(true);
        const payload = {
          objective: next.course,
          level: next.experience?.toLowerCase().includes('no') ? 'Inicial' : 'Intermedio',
          hoursPerWeek: Number(next.hours) || 6,
          weeks: Number(next.weeks) || 8,
        };
        const data = await postJSON('/plan', payload);
        const plan = data?.plan;
        if (!plan) throw new Error('Plan inválido');
        setMessages((m) => [...m, { role: "assistant", content: `¡Listo! Plan creado para: ${plan.title}` }]);
        toast.success('Plan generado con éxito');

        if (user && db) {
          try {
            const ref = doc(collection(db, `users/${user.uid}/plans`));
            await setDoc(ref, { plan, input: payload, createdAt: serverTimestamp(), source: plan.source || 'api' });
          } catch {}
        }
        try {
          const ev = new CustomEvent('open-plan-modal', { detail: { plan } });
          window.dispatchEvent(ev);
        } catch {}
      } catch (e) {
        console.error(e);
        toast.error('No se pudo generar el plan. Intenta más tarde.');
        setMessages((m) => [...m, { role: 'assistant', content: 'No pude generar el plan ahora. Te muestro un ejemplo.' }]);
        try { window.dispatchEvent(new Event('open-example-plan')); } catch {}
      } finally {
        setLoadingPlan(false);
      }
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
      if (step === 0) submitTurn(text); else setInput(text);
    };
    window.addEventListener("prefill-plan", onPrefill);
    return () => window.removeEventListener("prefill-plan", onPrefill);
  }, [step]);

  const listRef = useRef(null);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    try { el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); }
    catch { el.scrollTop = el.scrollHeight; }
  }, [messages]);

  // Sincroniza la altura del chat con la altura visible de la imagen
  const imageBoxRef = useRef(null);
  const [boxHeight, setBoxHeight] = useState(null);
  useEffect(() => {
    const updateBoxHeight = () => {
      const box = imageBoxRef.current;
      if (!box) return;
      const h = box.offsetHeight;
      if (h && h !== boxHeight) setBoxHeight(h);
    };
    updateBoxHeight();
    window.addEventListener('resize', updateBoxHeight);
    return () => window.removeEventListener('resize', updateBoxHeight);
  }, [boxHeight]);

  // Placeholder en caso de no existir la imagen local
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
      <text x='680' y='560' text-anchor='end' font-size='30' font-family='Inter,Arial' fill='white' fill-opacity='0.95' font-weight='700'>Study Plan</text>
    </svg>`);

  return (
    <section id="plan" className="bg-slate-900 py-8 md:py-10 scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Genera tu plan</h2>
          <PlannerHelpTip />
        </div>

        <div className="mt-6 grid md:grid-cols-5 gap-6 items-stretch">
          {/* Ilustración a la izquierda */}
          <div className="hidden md:block md:col-span-2 h-[380px] md:h-[420px]" ref={imageBoxRef}>
            <div className="w-full h-full rounded-2xl overflow-hidden">
              <img
                src="/images/study-plan.png"
                alt="Ilustración plan de estudio"
                className="w-full h-full object-contain object-center"
                onLoad={() => { try { const box = imageBoxRef.current; if (box) setBoxHeight(box.offsetHeight); } catch {} }}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = imgPlaceholder; }}
              />
            </div>
          </div>

          {/* Chat a la derecha */}
          <div className="md:col-span-3 bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 relative h-[380px] md:h-[420px] flex flex-col overflow-hidden" style={{ height: boxHeight ? `${boxHeight}px` : undefined, clipPath: 'inset(0% 0% 12% 0% round 16px)' }}>
            <div ref={listRef} className="space-y-3 flex-1 overflow-auto pr-1">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "assistant" ? "flex items-start gap-3" : "flex items-start gap-3 justify-end"}>
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-semibold">AI</div>
                  )}
                  <div className={m.role === "assistant" ? "rounded-2xl px-4 py-3 bg-slate-100 text-slate-900 shadow" : "rounded-2xl px-4 py-3 bg-sky-600 text-white shadow"}>
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
                    className="flex-1 outline-none text-slate-900 bg-transparent placeholder-slate-500 placeholder:italic appearance-none"
                    placeholder={placeholders[Math.min(step, placeholders.length-1)]}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    aria-label="Entrada del chat"
                  />
                </div>
                <button className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800" disabled={loadingPlan} aria-busy={loadingPlan || undefined}>
                  {loadingPlan ? 'Generando…' : 'Enviar'}
                </button>
              </div>
            </form>

            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => setInput(s)} className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlannerHelpTip() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const hideTimerRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('mousedown', onClick); };
  }, [open]);
  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => { if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; } setOpen(true); }}
      onMouseLeave={() => {
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        // Deja el menú visible unos segundos extra antes de ocultarlo
        hideTimerRef.current = setTimeout(() => { setOpen(false); hideTimerRef.current = null; }, 1500);
      }}
    >
      <button
        type="button"
        className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-300 text-slate-200 hover:text-white hover:border-white/70"
        aria-haspopup="dialog"
        aria-expanded={open || undefined}
        aria-controls="tip-planificador"
        aria-label="¿Qué hace este planificador?"
        onClick={() => setOpen((v)=>!v)}
        onKeyDown={(e)=>{ if (e.key==='Escape') setOpen(false); if (e.key==='Enter' || e.key===' ') { e.preventDefault(); setOpen((v)=>!v);} }}
      >
        <span className="font-semibold">?</span>
      </button>
      <div
        id="tip-planificador"
        role="dialog"
        aria-label="¿Qué hace este planificador?"
        aria-hidden={!open || undefined}
        className={`absolute left-full ml-2 top-0 w-64 sm:w-72 max-w-[80vw] rounded-xl bg-white shadow-2xl border border-slate-200 p-3 text-sm text-slate-700 z-10 origin-top-left transform-gpu transition-all duration-200 ease-out ${open ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}`}
      >
        <p className="font-semibold text-slate-900">Pasos rápidos y ejemplos</p>
        <ol className="mt-1 list-decimal pl-5 space-y-1">
          <li>Escribe tu objetivo (curso/rol).</li>
          <li>Responde: experiencia, horas/semana y semanas meta.</li>
          <li>Recibe el plan semanal y ajusta si necesitas.</li>
        </ol>
        <p className="mt-2 font-semibold text-slate-900">Ejemplo</p>
        <p>"Frontend desde cero, 7 h/sem, 10 sem".</p>
      </div>
    </div>
  );
}
