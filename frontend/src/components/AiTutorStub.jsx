// frontend/src/components/AiTutorStub.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * AiTutorStub
 * - UI de chat mínima sin backend (stub/mvp).
 * - No persiste mensajes; sólo eco y mensaje informativo.
 * - Expone un botón "Abrir en chat completo" que emite un evento
 *   window: 'open-ai-tutor' con { lessonId } para integración futura.
 */
export default function AiTutorStub({ lessonId = "unknown", className = "" }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hola, soy tu Tutor IA (stub). Aún sin IA real; pronto me integraré para ayudarte en esta lección.",
    },
  ]);

  const listRef = useRef(null);

  function send(text) {
    if (!text.trim()) return;
    const turn = text.trim();
    setMessages((m) => [
      ...m,
      { role: "user", content: turn },
      {
        role: "assistant",
        content:
          "¡Recibido! Por ahora soy un stub. Usa este espacio para anotar dudas y próximos pasos. Pronto responderé con IA.",
      },
    ]);
  }

  function onSubmit(e) {
    e.preventDefault();
    const t = input;
    setInput("");
    send(t);
  }

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    try {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } catch {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  function openFullChat() {
    try {
      const ev = new CustomEvent("open-ai-tutor", { detail: { lessonId } });
      window.dispatchEvent(ev);
    } catch (_error) {
      // noop
    }
  }

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl ${className}`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-sm">Tutor IA (stub)</h4>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Lección: {lessonId}
          </p>
        </div>
        <button
          onClick={openFullChat}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
        >
          Abrir en chat completo
        </button>
      </div>

      <div className="p-4">
        <div ref={listRef} className="space-y-3 max-h-56 overflow-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "assistant"
                  ? "flex items-start gap-2"
                  : "flex items-start gap-2 justify-end"
              }
            >
              {m.role === "assistant" && (
                <div className="w-6 h-6 rounded-full bg-sky-600 text-white grid place-items-center text-[10px] font-semibold">
                  AI
                </div>
              )}
              <div
                className={
                  m.role === "assistant"
                    ? "rounded-xl px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    : "rounded-xl px-3 py-2 bg-sky-600 text-white"
                }
              >
                <p className="text-xs leading-relaxed">{m.content}</p>
              </div>
              {m.role === "user" && (
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white grid place-items-center text-[10px] font-semibold">
                  Tú
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-3">
          <label className="sr-only" htmlFor="ai-tutor-input">
            Entrada del chat del tutor IA
          </label>
          <div className="flex gap-2">
            <input
              id="ai-tutor-input"
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              placeholder="Escribe una duda o idea..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="text-sm px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
