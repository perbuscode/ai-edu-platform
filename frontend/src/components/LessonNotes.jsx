// frontend/src/components/LessonNotes.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { saveNotes, loadNotes } from "../services/progress";

/**
 * LessonNotes
 * - Notas por lección con persistencia en localStorage.
 * - Clave: `${prefix}${lessonId}`.
 */
export default function LessonNotes({
  lessonId = "unknown",
  className = "",
  storageKeyPrefix = "ai-edu:lesson-notes:",
  placeholder = "Escribe tus notas, dudas o ideas...",
}) {
  const { user } = useAuth();
  const storageKey = useMemo(() => `${storageKeyPrefix}${lessonId}`, [storageKeyPrefix, lessonId]);
  const [text, setText] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const [dirty, setDirty] = useState(false);

  // Load saved notes (Firestore si disponible, luego local)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (user) {
        const cloud = await loadNotes({ uid: user.uid, lessonId }).catch(() => '');
        if (!cancelled && typeof cloud === 'string' && cloud.length > 0) {
          setText(cloud);
          setDirty(false);
          setSavedAt(new Date());
          return;
        }
      }
      try {
        const v = localStorage.getItem(storageKey);
        setText(typeof v === 'string' ? v : '');
        setDirty(false);
        setSavedAt(v ? new Date() : null);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [storageKey, user, lessonId]);

  // Auto-save with small debounce
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(async () => {
      try {
        localStorage.setItem(storageKey, text);
        if (user) {
          await saveNotes({ uid: user.uid, lessonId, text });
        }
        setSavedAt(new Date());
        setDirty(false);
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [dirty, text, storageKey, user, lessonId]);

  function onChange(e) {
    setText(e.target.value);
    setDirty(true);
  }

  async function onSaveClick() {
    try {
      localStorage.setItem(storageKey, text);
      if (user) await saveNotes({ uid: user.uid, lessonId, text });
      setSavedAt(new Date());
      setDirty(false);
    } catch {}
  }

  function onClear() {
    setText("");
    setDirty(true);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }

  return (
    <div className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-slate-800">
        <h4 className="font-semibold text-sm">Notas de la lección</h4>
        <p className="text-xs text-gray-500 dark:text-slate-400">Guardado local por lección</p>
      </div>
      <div className="p-4">
        <label className="sr-only" htmlFor="lesson-notes-textarea">Notas</label>
        <textarea
          id="lesson-notes-textarea"
          className="w-full h-36 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
          placeholder={placeholder}
          value={text}
          onChange={onChange}
        />

        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-slate-400" aria-live="polite">
            {dirty ? (
              <span>Cambios sin guardar…</span>
            ) : savedAt ? (
              <span>Guardado {savedAt.toLocaleTimeString()}</span>
            ) : (
              <span>Sin notas guardadas</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              Borrar
            </button>
            <button
              onClick={onSaveClick}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
            >
              Guardar ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
