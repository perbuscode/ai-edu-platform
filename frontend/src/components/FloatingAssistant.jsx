// src/components/FloatingAssistant.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBot, LuMessageCircle, LuX, LuExternalLink } from "react-icons/lu";

export default function FloatingAssistant() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hola, soy tu asistente. ¿En qué te ayudo?" },
  ]);

  // Persist open state lightly to avoid flicker across navigations
  useEffect(() => {
    try {
      const saved = localStorage.getItem("assistant:open");
      if (saved) setOpen(saved === "1");
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("assistant:open", open ? "1" : "0"); } catch {}
  }, [open]);

  const listRef = useRef(null);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    try { el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); }
    catch { el.scrollTop = el.scrollHeight; }
  }, [messages, open]);

  function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    const userMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    // Simple echo/placeholder response
    const reply = inferQuickReply(text);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    }, 300);
  }

  const suggestions = useMemo(() => ([
    "Resúmeme esta sección",
    "Dame una pista",
    "Explícame de nuevo",
  ]), []);

  function inferQuickReply(text) {
    const t = text.toLowerCase();
    if (t.includes("salon") || t.includes("salón") || t.includes("virtual")) {
      return "Puedo abrir el Salón Virtual para ayudarte en profundidad.";
    }
    if (t.includes("pista")) return "Pista: identifica primero la métrica y su contexto.";
    if (t.includes("resumen") || t.includes("resume")) return "Resumen: prioriza los KPIs clave y su tendencia.";
    return "Entendido. ¿Quieres que abramos el Salón Virtual?";
  }

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.03] active:scale-95"
          aria-label="Abrir asistente"
        >
          <LuMessageCircle size={18} />
          <span className="hidden sm:inline">Asistente</span>
        </button>
      )}

      {open && (
        <div className="w-[92vw] sm:w-96 max-w-[92vw] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900/95 backdrop-blur text-slate-100 assistant-appear origin-bottom-right">
          <header className="flex items-center justify-between px-3 py-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-sky-600 text-white"><LuBot size={16} /></span>
              <span className="text-sm font-semibold">Asistente IA</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => navigate('/dashboard/salon-virtual')}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-white/10 hover:bg-white/15 transition-colors"
                title="Entrar al Salón Virtual"
              >
                <LuExternalLink size={14} />
                <span className="hidden sm:inline">Salón Virtual</span>
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Cerrar"
              >
                <LuX size={16} />
              </button>
            </div>
          </header>

          <div ref={listRef} className="max-h-80 overflow-auto px-3 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'assistant' ? 'flex items-start gap-3' : 'flex items-start gap-3 justify-end'}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px] font-semibold">AI</div>
                )}
                <div className={m.role === 'assistant' ? 'rounded-2xl px-3 py-2 bg-white/10 text-slate-100 shadow' : 'rounded-2xl px-3 py-2 bg-sky-600 text-white shadow'}>
                  <p className="text-sm leading-relaxed">{m.content}</p>
                </div>
                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-semibold">Tú</div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="px-3 pb-3">
            <div className="flex gap-2">
              <input
                className="flex-1 text-sm px-3 py-2 rounded-xl bg-white/10 placeholder-slate-400 outline-none border border-white/10 focus:border-sky-400 transition-colors"
                placeholder="Escribe tu mensaje…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Mensaje para el asistente"
              />
              <button type="submit" className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm transition-colors">Enviar</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => setInput(s)} className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                  {s}
                </button>
              ))}
              <button
                type="button"
                onClick={() => navigate('/dashboard/salon-virtual')}
                className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white transition-colors"
              >
                Entrar al Salón Virtual
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

