// frontend/src/components/StudyPlan.jsx
import React, { useEffect, useMemo, useState } from "react";
import ClassroomStepper from "./ClassroomStepper";
import { mockCourse } from "../data/course.mock";
import { useAuth } from "../context/AuthContext";
import { saveLessonProgress, loadLessonProgress } from "../services/progress";
import jsPDF from "jspdf";

// Util simple para localStorage con guardas
function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function StudyPlan() {
  const { user } = useAuth();
  const course = mockCourse; // Solo lectura (mock)
  const steps = useMemo(() => {
    const arr = course?.currentLesson?.steps || [
      { id: "video", label: "Video" },
      { id: "content", label: "Contenido" },
      { id: "exercise", label: "Ejercicio" },
    ];
    // Normaliza
    return arr.map((s) =>
      typeof s === "string" ? { id: s.toLowerCase(), label: s } : s
    );
  }, [course]);

  const storageKey = `studyplan:${course?.id || "course"}`;

  const [currentStep, setCurrentStep] = useState(1); // 1..N
  const [completed, setCompleted] = useState(() => {
    const state = loadState(storageKey, { completed: [], notes: "" });
    return new Set(state.completed || []);
  });
  const [notes, setNotes] = useState(() => {
    const state = loadState(storageKey, { completed: [], notes: "" });
    return state.notes || "";
  });

  const total = steps.length;
  const completedCount = completed.size;
  const percent = Math.round((completedCount / Math.max(1, total)) * 100);

  // Sincronizar y guardar cambios (localStorage + Firestore si hay usuario)
  useEffect(() => {
    saveState(storageKey, { completed: Array.from(completed), notes });
    if (user) {
      const courseId = course?.id || 'course';
      const lessonId = course?.currentLesson?.id || 'lesson';
      saveLessonProgress({
        uid: user.uid,
        courseId,
        lessonId,
        data: { completedSteps: Array.from(completed), notes },
      }).catch(() => {});
    }
  }, [storageKey, completed, notes, user]);

  // Cargar progreso desde Firestore al iniciar sesión
  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!user) return;
      const courseId = course?.id || 'course';
      const lessonId = course?.currentLesson?.id || 'lesson';
      const data = await loadLessonProgress({ uid: user.uid, courseId, lessonId }).catch(() => null);
      if (!cancelled && data) {
        if (Array.isArray(data.completedSteps)) setCompleted(new Set(data.completedSteps));
        if (typeof data.notes === 'string') setNotes(data.notes);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [user]);

  // Reglas de desbloqueo secuencial
  const lastCompletedIndex = useMemo(() => {
    // Mayor índice consecutivo completado desde el principio (1-based)
    let idx = 0;
    for (let i = 0; i < steps.length; i++) {
      if (completed.has(steps[i].id)) idx = i + 1;
      else break;
    }
    return idx; // 0..N
  }, [steps, completed]);

  const maxUnlocked = Math.min(lastCompletedIndex + 1, total); // Puedes ir hasta el siguiente pendiente

  function canComplete(index) {
    // Puedes completar el paso i si todos los anteriores están completos
    return index <= 1 || steps.slice(0, index - 1).every((s) => completed.has(s.id));
  }

  function handleCompleteCurrent() {
    const i = currentStep;
    if (!canComplete(i)) return;
    const id = steps[i - 1].id;
    if (!completed.has(id)) {
      const next = new Set(completed);
      next.add(id);
      setCompleted(next);
      // Avanza automáticamente si no es el último
      if (i < total) setCurrentStep(i + 1);
    }
  }

  function handleGoTo(index) {
    // Permite volver a cualquiera ya completado y avanzar hasta maxUnlocked
    if (index < 1 || index > total) return;
    const id = steps[index - 1].id;
    if (completed.has(id) || index <= maxUnlocked) setCurrentStep(index);
  }

  function markLessonDone() {
    // Marca todos los pasos como completos
    const all = new Set(steps.map((s) => s.id));
    setCompleted(all);
  }

  function resetProgress() {
    setCompleted(new Set());
    setNotes("");
    setCurrentStep(1);
  }

  function downloadCertificatePDF() {
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      const w = doc.internal.pageSize.getWidth();
      const h = doc.internal.pageSize.getHeight();

      // Marco
      doc.setDrawColor(14,165,233);
      doc.setLineWidth(6);
      doc.rect(24, 24, w - 48, h - 48);
      doc.setDrawColor(56,189,248);
      doc.setLineWidth(2);
      doc.rect(44, 44, w - 88, h - 88);

      // Título
      doc.setTextColor(15,23,42);
      doc.setFont('helvetica','bold');
      doc.setFontSize(30);
      doc.text('Certificado de Finalización', w/2, 120, { align: 'center' });

      // Subtítulo
      doc.setFont('helvetica','normal');
      doc.setFontSize(14);
      doc.setTextColor(51,65,85);
      doc.text('AI Edu Platform certifica que', w/2, 160, { align: 'center' });

      // Nombre
      const name = user?.displayName || 'Estudiante';
      doc.setFont('helvetica','bold');
      doc.setFontSize(26);
      doc.setTextColor(17,24,39);
      doc.text(name, w/2, 195, { align: 'center' });

      // Detalle
      doc.setFont('helvetica','normal');
      doc.setFontSize(14);
      const courseTitle = course?.title || 'Plan de estudio';
      doc.text(`ha completado el plan: ${courseTitle}`, w/2, 225, { align: 'center' });

      // Fecha
      const date = new Date().toLocaleDateString();
      doc.setTextColor(71,85,105);
      doc.text(`${date}`, w/2, 255, { align: 'center' });

      // Sello
      doc.setFillColor(14,165,233);
      doc.circle(w - 170, h - 120, 50, 'F');
      doc.setTextColor(255,255,255);
      doc.setFontSize(16);
      doc.text('AI EDU', w - 170, h - 124, { align: 'center' });
      doc.setFontSize(12);
      doc.text('CERTIFICADO', w - 170, h - 104, { align: 'center' });

      doc.save('certificado.pdf');
    } catch {}
  }

  // Contenido por paso (placeholder con datos del mock)
  function renderStep() {
    const step = steps[currentStep - 1]?.id;
    if (step === "video") {
      return (
        <div>
          <h4 className="text-lg font-semibold mb-3">Clase en video</h4>
          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800 bg-black aspect-video mb-4 grid place-items-center">
            <span className="text-white/70 text-sm">[Player de video embebido]</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-300">Duración: {course?.currentLesson?.duration || "45 min"}</p>
        </div>
      );
    }
    if (step === "content") {
      return (
        <div>
          <h4 className="text-lg font-semibold mb-3">Contenido de la clase</h4>
          <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-slate-200 space-y-1">
            {(course?.currentLesson?.outline || []).map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      );
    }
    if (step === "exercise") {
      return (
        <div>
          <h4 className="text-lg font-semibold mb-3">Ejercicio guiado</h4>
          <p className="text-sm text-gray-700 dark:text-slate-200 mb-2">{course?.currentLesson?.exercise}</p>
          <label className="sr-only" htmlFor="exercise-notes">Tu solución o notas</label>
          <textarea
            id="exercise-notes"
            className="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg px-3 py-2 text-sm"
            rows={6}
            placeholder="Escribe aquí tu solución, pasos o reflexión..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="mt-3">
            <button
              type="button"
              onClick={markLessonDone}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
            >
              Marcar clase como completada
            </button>
          </div>
        </div>
      );
    }
    return null;
  }

  const stepId = steps[currentStep - 1]?.id;
  const canMark = canComplete(currentStep) && !completed.has(stepId);

  const nextLabel = currentStep < total ? `Siguiente: ${steps[currentStep]?.label}` : "Finalizar";
  const prevDisabled = currentStep <= 1;
  const nextDisabled = currentStep >= total ? false : !completed.has(stepId); // obliga a completar antes de avanzar

  return (
    <section aria-labelledby="studyplan-title" className="space-y-5">
      {/* Header y barra de progreso */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 id="studyplan-title" className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Plan de estudio
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-300">
              {course?.title} · Lección: {course?.currentLesson?.title || "Actual"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetProgress}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              Reiniciar progreso
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-slate-300">Completado</span>
            <span className="text-sm font-medium text-green-600">{percent}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2" aria-hidden="true">
            <div
              className="h-2 rounded-full"
              style={{ width: `${percent}%`, background: "linear-gradient(90deg,#4ade80 0%,#22c55e 100%)" }}
            />
          </div>
          <div className="sr-only" aria-live="polite">{percent}% completado</div>
        </div>
      </div>

      {/* Stepper */}
      <ClassroomStepper
        steps={steps}
        currentStep={currentStep}
        onStepChange={handleGoTo}
      />

      {/* Contenido del paso */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5">
        {renderStep()}

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleGoTo(currentStep - 1)}
            disabled={prevDisabled}
            className={`px-4 py-2 rounded-lg text-sm border border-gray-200 dark:border-slate-700 ${
              prevDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Anterior
          </button>

          <button
            type="button"
            onClick={handleCompleteCurrent}
            disabled={!canMark}
            className={`px-4 py-2 rounded-lg text-sm ${
              canMark
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-300 cursor-not-allowed"
            }`}
          >
            Marcar paso como completado
          </button>

          <button
            type="button"
            onClick={() => handleGoTo(currentStep + 1)}
            disabled={nextDisabled}
            className={`px-4 py-2 rounded-lg text-sm ${
              !nextDisabled
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-300 cursor-not-allowed"
            }`}
          >
            {nextLabel}
          </button>
          {percent === 100 && (
            <button
              type="button"
              onClick={downloadCertificatePDF}
              className="ml-auto px-4 py-2 rounded-lg text-sm bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Descargar certificado (PDF)
            </button>
          )}
        </div>
      </div>

      {/* Resumen de pasos */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5">
        <h4 className="text-sm font-semibold mb-3">Estado de pasos</h4>
        <ol className="space-y-2">
          {steps.map((s, i) => {
            const i1 = i + 1;
            const isDone = completed.has(s.id);
            const isCurrent = currentStep === i1;
            return (
              <li
                key={s.id}
                className="flex items-center justify-between border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2"
              >
                <span className="text-sm">
                  {i1}. {s.label}
                  {isCurrent && <span className="ml-2 text-xs text-blue-600">(Actual)</span>}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    isDone
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : i1 <= maxUnlocked
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-200"
                  }`}
                >
                  {isDone ? "Completado" : i1 <= maxUnlocked ? "Disponible" : "Bloqueado"}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
