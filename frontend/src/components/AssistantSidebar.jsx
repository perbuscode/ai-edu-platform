// src/components/AssistantSidebar.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "./Toast";
import { LuSparkles, LuX, LuMessageCircle } from "react-icons/lu";
import LessonNotes from "./LessonNotes";

const COLLAPSED_WIDTH = 56;
const DEFAULT_ASSISTANT_WIDTH = 180;
const MAX_ASSISTANT_WIDTH = DEFAULT_ASSISTANT_WIDTH * 3;

const getStoredBoolean = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    if (raw === "1" || raw === "true") return true;
    if (raw === "0" || raw === "false") return false;
    return fallback;
  } catch {
    return fallback;
  }
};

const getStoredWidth = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = parseInt(raw, 10);
    if (Number.isFinite(parsed)) {
      return Math.min(Math.max(parsed, DEFAULT_ASSISTANT_WIDTH), MAX_ASSISTANT_WIDTH);
    }
  } catch {}
  return fallback;
};

export default function AssistantSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const anchoredPaths = [/^\/dashboard/, /^\/course/, /^\/cv/, /^\/practice-interview/, /^\/missions/];
  const topOffset = anchoredPaths.some((regex) => regex.test(location.pathname || "")) ? 56 : 0;

  const LESSON_NOTES_FALLBACK = "lesson-1";
  const getLessonIdFromStorage = () => {
    if (typeof window === "undefined") return LESSON_NOTES_FALLBACK;
    try {
      const stored = localStorage.getItem("ai-edu:last-lesson-id");
      if (stored) return stored;
    } catch {}
    return LESSON_NOTES_FALLBACK;
  };

  const [expanded, setExpanded] = useState(() => getStoredBoolean("assistant:sidebar:expanded", true));
  const [width, setWidth] = useState(() => getStoredWidth("assistant:sidebar:width", DEFAULT_ASSISTANT_WIDTH));
  const [isResizing, setIsResizing] = useState(false);
  const [feed, setFeed] = useState([]);
  const [chatMessages, setChatMessages] = useState(() => [
    { id: "welcome", author: "assistant", text: "¡Hola! Soy tu asistente Edvance. ¿En qué te ayudo hoy?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);

  const [notesOpen, setNotesOpen] = useState(false);
  const [notesLessonId, setNotesLessonId] = useState(() => getLessonIdFromStorage());

  const feedRef = useRef(null);
  const chatRef = useRef(null);
  const chatInputRef = useRef(null);
  const resizeStateRef = useRef(null);
  const wasDraggingRef = useRef(false);
  const moreButtonRef = useRef(null);
  const moreMenuRef = useRef(null);
  const pendingReplyRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem("assistant:sidebar:expanded", expanded ? "1" : "0"); } catch {}
  }, [expanded]);

  useEffect(() => {
    try { localStorage.setItem("assistant:sidebar:width", String(Math.round(width))); } catch {}
  }, [width]);

  useEffect(() => {
    try {
      const body = document.body;
      if (!body) return;
      const targetWidth = expanded ? width : COLLAPSED_WIDTH;
      body.classList.add("assistant-rail-active");
      body.classList.toggle("assistant-rail-expanded", expanded);
      body.classList.toggle("assistant-rail-collapsed", !expanded);
      body.style.setProperty("--assistant-rail-width", `${targetWidth}px`);
    } catch {}
  }, [expanded, width]);

  useEffect(() => () => {
    try {
      const body = document.body;
      if (!body) return;
      body.classList.remove("assistant-rail-active", "assistant-rail-expanded", "assistant-rail-collapsed");
      body.style.removeProperty("--assistant-rail-width");
    } catch {}
  }, []);

  useEffect(() => () => {
    if (pendingReplyRef.current) {
      clearTimeout(pendingReplyRef.current);
    }
  }, []);

  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;
    try { el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); } catch { el.scrollTop = el.scrollHeight; }
  }, [feed, expanded]);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [chatMessages, expanded]);

  useEffect(() => {
    if (!isResizing) return;

    function handleMove(event) {
      const point = event.touches ? event.touches[0] : event;
      if (!point) return;
      const data = resizeStateRef.current;
      if (!data) return;
      const delta = data.startX - point.clientX;
      if (Math.abs(delta) > 1) {
        wasDraggingRef.current = true;
      }
      let next = data.startWidth + delta;
      if (!Number.isFinite(next)) return;
      next = Math.min(Math.max(next, DEFAULT_ASSISTANT_WIDTH), MAX_ASSISTANT_WIDTH);
      setWidth(Math.round(next));
    }

    function stopResize() {
      resizeStateRef.current = null;
      setIsResizing(false);
      setTimeout(() => { wasDraggingRef.current = false; }, 140);
    }

    const body = document.body;
    const prevCursor = body ? body.style.cursor : undefined;
    const prevSelect = body ? body.style.userSelect : undefined;
    if (body) {
      body.style.cursor = "ew-resize";
      body.style.userSelect = "none";
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopResize);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", stopResize);
    window.addEventListener("touchcancel", stopResize);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stopResize);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", stopResize);
      window.removeEventListener("touchcancel", stopResize);
      if (body) {
        body.style.cursor = prevCursor || "";
        body.style.userSelect = prevSelect || "";
      }
    };
  }, [isResizing]);

  const ensureExpanded = useCallback(() => {
    setExpanded((prev) => {
      if (!prev) {
        setWidth((current) => Math.min(Math.max(current || DEFAULT_ASSISTANT_WIDTH, DEFAULT_ASSISTANT_WIDTH), MAX_ASSISTANT_WIDTH));
      }
      return true;
    });
  }, []);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => {
      if (prev) return false;
      setWidth((current) => Math.min(Math.max(current || DEFAULT_ASSISTANT_WIDTH, DEFAULT_ASSISTANT_WIDTH), MAX_ASSISTANT_WIDTH));
      return true;
    });
  }, []);

  const normalizeSuggestion = useCallback((payload) => {
    const { tag, title, desc, bullets } = payload || {};
    return {
      tag: tag || undefined,
      title: title || "Sugerencia",
      desc: desc || undefined,
      bullets: Array.isArray(bullets) ? bullets.filter(Boolean) : undefined,
    };
  }, []);

  const pushSuggestion = useCallback((payload) => {
    const item = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      ...normalizeSuggestion(payload),
    };
    setFeed((prev) => [...prev, item]);
    ensureExpanded();
  }, [ensureExpanded, normalizeSuggestion]);

  const appendAssistantMessage = useCallback((text) => {
    if (!text) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        author: "assistant",
        text,
      },
    ]);
    ensureExpanded();
  }, [ensureExpanded]);

  const openQuiz = useCallback((payload) => {
    appendAssistantMessage(
      payload?.message || "Listo, preparo un quiz de 5 preguntas para repasar lo que vimos. Abramos el Salón Virtual para comenzar."
    );
    navigate("/dashboard/salon-virtual");
    try { toast.info("Abriendo Quiz en Salón Virtual", 2500); } catch {}
  }, [appendAssistantMessage, navigate, toast]);

  const openExplanation = useCallback((payload) => {
    appendAssistantMessage(
      payload?.message || "Estoy preparando una explicación paso a paso para reforzar los conceptos clave. Veamos el contenido juntos."
    );
    navigate("/dashboard/salon-virtual");
  }, [appendAssistantMessage, navigate]);

  const openVirtualRoom = useCallback(() => {
    appendAssistantMessage("Abramos el Salón Virtual para seguir trabajando contigo.");
    navigate("/dashboard/salon-virtual");
    try { toast.info("Abriendo Salón Virtual", 2500); } catch {}
  }, [appendAssistantMessage, navigate, toast]);

  const openLessonNotes = useCallback((payload) => {
    const lessonId = payload?.lessonId || getLessonIdFromStorage();
    setNotesLessonId(lessonId);
    setNotesOpen(true);
    appendAssistantMessage(
      payload?.message || "Abrí tus notas locales para que captures dudas y aprendizajes cuando quieras."
    );
    ensureExpanded();
  }, [appendAssistantMessage, ensureExpanded]);

  const openPlan = useCallback((payload) => {
    try {
      const text = (payload && (payload.text || payload.objective)) || "Power BI para BI Analyst";
      window.dispatchEvent(new CustomEvent("prefill-plan", { detail: { text } }));
    } catch {}
    ensureExpanded();
  }, [ensureExpanded]);

  const openProjectReview = useCallback((payload) => {
    pushSuggestion({
      tag: "Revisión",
      title: payload?.title || "Revisión de proyecto",
      desc: payload?.desc || "Enviemos tu entrega para feedback.",
    });
    navigate("/dashboard/portafolio");
  }, [navigate, pushSuggestion]);

  const primaryActions = useMemo(() => ([
    { key: "quiz5", label: "Quiz 5", emoji: "❓", title: "Quiz de práctica (5)", onClick: () => openQuiz() },
    { key: "explicacion", label: "Explicación", emoji: "💡", title: "Explicar contenido", onClick: () => openExplanation() },
    { key: "notas", label: "Notas", emoji: "📝", title: "Abrir notas de la lección", onClick: () => openLessonNotes() },
    { key: "salon", label: "Salón Virtual", emoji: "🎥", title: "Abrir Salón Virtual", onClick: () => openVirtualRoom() },
  ]), [openExplanation, openLessonNotes, openQuiz, openVirtualRoom]);

  const extraActions = useMemo(() => ([
    {
      key: "resumen",
      label: "Resumir clase",
      emoji: "📝",
      onSelect: () => pushSuggestion({
        tag: "Resumen",
        title: "Resumen de la última sesión",
        desc: "Preparando puntos clave y próximos pasos.",
      }),
    },
    {
      key: "recursos",
      label: "Recurso recomendado",
      emoji: "📚",
      onSelect: () => pushSuggestion({
        tag: "Recursos",
        title: "Nuevos recursos sugeridos",
        bullets: ["Video de repaso de 10 minutos", "Artículo con ejemplos prácticos", "Ejercicio guiado"],
      }),
    },
    {
      key: "recordatorio",
      label: "Recordar práctica",
      emoji: "⏰",
      onSelect: () => {
        pushSuggestion({
          tag: "Recordatorio",
          title: "Agenda un repaso",
          desc: "Configura un repaso para mañana a las 8:00 p. m.",
        });
        try { toast.success("Recordatorio configurado en tu panel", 2200); } catch {}
      },
    },
  ]), [pushSuggestion, toast]);

  const handleAvatarToggle = useCallback(() => {
    toggleExpanded();
    setMoreOpen(false);
  }, [toggleExpanded]);

  const handleResizeStart = useCallback((event) => {
    const isMouseEvent = Object.prototype.hasOwnProperty.call(event, "button");
    if (isMouseEvent && event.button !== 0) return;
    const point = event.touches ? event.touches[0] : event;
    if (!point) return;
    event.preventDefault();
    event.stopPropagation();
    wasDraggingRef.current = false;
    if (!expanded) {
      ensureExpanded();
    }
    const baseWidth = expanded ? width : DEFAULT_ASSISTANT_WIDTH;
    const clampedWidth = Math.min(Math.max(baseWidth, DEFAULT_ASSISTANT_WIDTH), MAX_ASSISTANT_WIDTH);
    resizeStateRef.current = { startX: point.clientX, startWidth: clampedWidth };
    setWidth(clampedWidth);
    setIsResizing(true);
  }, [ensureExpanded, expanded, width]);

  const handleHandleClick = useCallback(() => {
    if (wasDraggingRef.current) {
      wasDraggingRef.current = false;
      return;
    }
    toggleExpanded();
  }, [toggleExpanded]);

  const handleMoreToggle = useCallback(() => {
    setMoreOpen((prev) => !prev);
  }, []);

  const handleMoreAction = useCallback((action) => {
    setMoreOpen(false);
    ensureExpanded();
    action.onSelect?.();
  }, [ensureExpanded]);

  const handleChatShortcut = useCallback(() => {
    ensureExpanded();
    setTimeout(() => {
      try { chatInputRef.current?.focus(); } catch {}
    }, 160);
  }, [ensureExpanded]);

  useEffect(() => {
    if (!moreOpen) return;

    const handlePointer = (event) => {
      const trigger = moreButtonRef.current;
      const menu = moreMenuRef.current;
      if (!trigger || !menu) return;
      if (!trigger.contains(event.target) && !menu.contains(event.target)) {
        setMoreOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointer, true);
    document.addEventListener("touchstart", handlePointer, true);
    document.addEventListener("keydown", handleKey, true);
    return () => {
      document.removeEventListener("mousedown", handlePointer, true);
      document.removeEventListener("touchstart", handlePointer, true);
      document.removeEventListener("keydown", handleKey, true);
    };
  }, [moreOpen]);

  useEffect(() => {
    if (!expanded) {
      setNotesOpen(false);
    }
  }, [expanded]);

  useEffect(() => {
    if (!notesOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setNotesOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [notesOpen]);

  const handleChatSubmit = useCallback((event) => {
    event.preventDefault();
    const value = chatInput.trim();
    if (!value) return;
    const timestamp = Date.now();
    const userMessage = { id: `user-${timestamp}`, author: "user", text: value };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    ensureExpanded();
    if (pendingReplyRef.current) {
      clearTimeout(pendingReplyRef.current);
      pendingReplyRef.current = null;
    }
    pendingReplyRef.current = setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          author: "assistant",
          text: `Estoy tomando nota de "${value}". Te compartiré recomendaciones en breve.`,
        },
      ]);
      pendingReplyRef.current = null;
    }, 450);
  }, [chatInput, ensureExpanded]);

  useEffect(() => {
    const api = {
      push: (s) => pushSuggestion(s),
      notify: (s) => { try { toast.info(s?.title || "Notificación", 2500); } catch {} },
      openQuiz: (p) => openQuiz(p),
      openPlan: (p) => openPlan(p),
      openExplanation: (p) => openExplanation(p),
      openProjectReview: (p) => openProjectReview(p),
      openVirtualRoom: () => openVirtualRoom(),
      openLessonNotes: (p) => openLessonNotes(p),
      open: () => ensureExpanded(),
      close: () => setExpanded(false),
      toggle: () => toggleExpanded(),
    };
    try { window.Assistant = Object.assign(window.Assistant || {}, api); } catch { window.Assistant = api; }
    return () => {};
  }, [ensureExpanded, openExplanation, openLessonNotes, openPlan, openProjectReview, openQuiz, openVirtualRoom, pushSuggestion, toast, toggleExpanded]);

  const sidebarWidth = expanded ? width : COLLAPSED_WIDTH;
  const unreadCount = feed.length;
  const compactBadgeContent = unreadCount > 99 ? "99+" : String(unreadCount);
  const showCompactBadge = !expanded && unreadCount > 0;
  const showExpandedDot = expanded && unreadCount > 0;
  const moreMenuPlacement = expanded ? "right-0 top-full mt-2 origin-top-right" : "right-full top-1/2 -translate-y-1/2 -mr-3 origin-right";

  const hasFeed = expanded && feed.length > 0;

  return (
    <aside
      id="assistant-sidebar"
      className={`fixed right-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-l border-slate-200/70 dark:border-slate-700/60 shadow-xl transition-[width,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
      aria-label="Tutor IA"
      aria-expanded={expanded}
      style={{ width: sidebarWidth, minWidth: COLLAPSED_WIDTH, maxWidth: MAX_ASSISTANT_WIDTH, top: topOffset, bottom: 0 }}
    >
      <div
        className={`absolute inset-y-0 left-0 w-[2px] ${expanded ? "cursor-ew-resize opacity-80" : "opacity-0"} bg-sky-500/50 hover:bg-sky-500/70 transition-opacity duration-300 ease-out`}
        onMouseDown={handleResizeStart}
        onTouchStart={handleResizeStart}
        onClick={handleHandleClick}
        aria-hidden="true"
        title={expanded ? "Contraer asistente" : "Expandir asistente"}
      />
      <header className="h-14 flex items-center px-2 border-b border-slate-200/70 dark:border-slate-700/60">
        <div className={`flex items-center w-full ${expanded ? "gap-3 justify-start" : "justify-center"}`}>
          <button
            type="button"
            onClick={handleAvatarToggle}
            className={`group relative inline-flex items-center ${expanded ? "gap-3 pr-2" : "justify-center"} focus:outline-none`}
            aria-label={expanded ? "Ocultar asistente" : "Mostrar asistente"}
            aria-expanded={expanded}
            title={expanded ? "Ocultar asistente" : "Mostrar asistente"}
          >
            <span className={`inline-flex items-center justify-center ${expanded ? "w-9 h-9" : "w-7 h-7"} rounded-full bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-md transition-transform duration-300 group-hover:scale-105`}>
              <LuSparkles size={expanded ? 18 : 16} />
            </span>
            {expanded && (
              <span className="select-none text-left">
                <span className="block text-sm font-semibold text-slate-900 dark:text-white">Tutor IA</span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-300">Haz clic para cerrar</span>
              </span>
            )}
            {showCompactBadge && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-semibold grid place-items-center shadow">
                {compactBadgeContent}
              </span>
            )}
            {!showCompactBadge && showExpandedDot && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white dark:border-slate-900" aria-hidden />
            )}
          </button>
        </div>
      </header>

      <div className="h-[calc(100%-3.5rem)] flex flex-col">
        <div className={`${expanded ? "px-3 py-3 space-y-2" : "px-1 py-2"} border-b border-slate-200/70 dark:border-slate-700/60`} aria-label="Acciones rápidas">
          {expanded && <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500/80">Acciones rápidas</p>}
          {expanded ? (
            <div className="flex flex-wrap gap-2 relative">
              {primaryActions.map((action) => (
                <button
                  key={action.key}
                  type="button"
                  className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/15 border border-slate-200/70 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  onClick={action.onClick}
                  title={action.title}
                >
                  <span aria-hidden>{action.emoji}</span>
                  <span>{action.label}</span>
                </button>
              ))}
              <div className="relative" ref={moreButtonRef}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-slate-200/70 dark:border-white/10 text-slate-600 dark:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  onClick={handleMoreToggle}
                  aria-haspopup="menu"
                  aria-expanded={moreOpen}
                  title="Mostrar más acciones"
                >
                  <span aria-hidden>⋯</span>
                  <span>Más</span>
                </button>
                {moreOpen && (
                  <div
                    ref={moreMenuRef}
                    className={`absolute z-30 ${moreMenuPlacement} min-w-[168px] rounded-xl border border-slate-200/70 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-lg p-2 space-y-1`}
                    role="menu"
                  >
                    {extraActions.map((action) => (
                      <button
                        key={action.key}
                        type="button"
                        onClick={() => handleMoreAction(action)}
                        className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-600 dark:text-slate-200 hover:bg-sky-50 hover:text-slate-900 dark:hover:bg-slate-800/80"
                        role="menuitem"
                      >
                        <span className="text-base" aria-hidden>{action.emoji}</span>
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 relative">
              {primaryActions.map((action) => (
                <button
                  key={`${action.key}-compact`}
                  type="button"
                  onClick={action.onClick}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
                  aria-label={action.title}
                  title={action.title}
                >
                  <span aria-hidden>{action.emoji}</span>
                </button>
              ))}
              <div className="relative" ref={moreButtonRef}>
                <button
                  type="button"
                  onClick={handleMoreToggle}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-200"
                  aria-label="Mostrar más acciones"
                  aria-expanded={moreOpen}
                  aria-haspopup="menu"
                >
                  <span aria-hidden>⋯</span>
                </button>
                {moreOpen && (
                  <div
                    ref={moreMenuRef}
                    className={`absolute z-30 ${moreMenuPlacement} min-w-[178px] rounded-xl border border-slate-200/70 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-lg p-2 space-y-1`}
                    role="menu"
                  >
                    {extraActions.map((action) => (
                      <button
                        key={`${action.key}-collapsed`}
                        type="button"
                        onClick={() => handleMoreAction(action)}
                        className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-600 dark:text-slate-200 hover:bg-sky-50 hover:text-slate-900 dark:hover:bg-slate-800/80"
                        role="menuitem"
                      >
                        <span className="text-base" aria-hidden>{action.emoji}</span>
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {hasFeed && (
            <div
              className="flex-1 overflow-auto"
              ref={feedRef}
              aria-live="polite"
              aria-label="Sugerencias del asistente"
            >
              <ul className="p-3 space-y-3">
                {feed.map((item) => (
                  <li key={item.id} className="rounded-xl border border-slate-200/70 dark.border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {item.tag && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-100 text-sky-800 dark:bg-sky-700/30 dark:text-sky-200">
                              {item.tag}
                            </span>
                          )}
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.title}</h4>
                        </div>
                        {item.desc && <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{item.desc}</p>}
                        {Array.isArray(item.bullets) && item.bullets.length > 0 && (
                          <ul className="mt-2 list-disc pl-5 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                            {item.bullets.map((bullet, index) => (
                              <li key={index}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="shrink-0">
                        <button
                          type="button"
                          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300"
                          aria-label="Descartar sugerencia"
                          onClick={() => setFeed((prev) => prev.filter((entry) => entry.id !== item.id))}
                        >
                          <LuX size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {expanded && (
            <div className={`${hasFeed ? 'mt-auto border-t' : 'flex-1 border-t'} border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/70 px-3 py-3 flex flex-col space-y-3`}
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Chat</div>
              <div ref={chatRef} className={`${hasFeed ? 'max-h-48' : 'flex-1'} overflow-y-auto space-y-2 pr-1 text-sm`}>
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.author === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-snug shadow-sm ${
                        msg.author === "user" ? "bg-sky-500 text-white" : "bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    placeholder="Escribe un mensaje..."
                    ref={chatInputRef}
                    className="w-full rounded-full border border-slate-200/70 dark:border-slate-600 bg-white/90 dark:bg-slate-800/90 px-3 py-2 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/80"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-sky-500 text-white px-3 py-2 text-sm font-medium shadow hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/80 disabled:opacity-60"
                  disabled={!chatInput.trim()}
                >
                  Enviar
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      {!expanded && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center z-10">
          <button
            type="button"
            onClick={handleChatShortcut}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-sky-900/40 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80 transition-transform hover:scale-105"
            aria-label="Abrir chat del asistente"
            title="Abrir chat del asistente"
          >
            <LuMessageCircle size={20} aria-hidden />
          </button>
        </div>
      )}

      {notesOpen && (
        <div className="absolute inset-0 z-50 bg-white/95 dark:bg-slate-900/95 border-l border-slate-200/70 dark:border-slate-700/60 shadow-2xl flex flex-col" role="dialog" aria-modal="true">
          <header className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-700/60">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notas de la lección</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Guardado local por lección · {notesLessonId}</p>
            </div>
            <button
              type="button"
              onClick={() => setNotesOpen(false)}
              className="inline-flex items-center justify-center rounded-full p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
              aria-label="Cerrar notas"
            >
              <LuX size={16} aria-hidden />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <LessonNotes lessonId={notesLessonId} className="border-0 shadow-none" />
          </div>
        </div>
      )}

    </aside>
  );
}

