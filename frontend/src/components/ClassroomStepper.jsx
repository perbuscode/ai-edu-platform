// frontend/src/components/ClassroomStepper.jsx
import React from "react";

/**
 * Stepper simple para clases: muestra pasos y permite cambiar entre ellos.
 * - Controlado: requiere props `currentStep` (1..N) y `onStepChange`.
 * - `steps`: array de strings u objetos { id, label }.
 */
export default function ClassroomStepper({
  steps = ["Video", "Contenido", "Ejercicio"],
  currentStep = 1,
  onStepChange = () => {},
  className = "",
}) {
  const items = steps.map((s) =>
    typeof s === "string" ? { id: s.toLowerCase(), label: s } : s
  );

  const total = items.length;

  function statusOf(i) {
    if (i < currentStep) return "done"; // completado
    if (i === currentStep) return "current";
    return "todo";
  }

  function goTo(i) {
    if (i >= 1 && i <= total && i !== currentStep) onStepChange(i);
  }

  return (
    <div
      className={`w-full ${className}`}
      role="navigation"
      aria-label="Progreso de la clase"
    >
      <div className="flex items-center gap-3 select-none" aria-hidden>
        {items.map((step, idx) => {
          const i = idx + 1;
          const st = statusOf(i);
          const isCurrent = st === "current";
          const isDone = st === "done";
          const baseClasses =
            "w-7 h-7 rounded-full grid place-items-center text-xs font-semibold transition-colors";
          const colorClasses = isCurrent
            ? "bg-blue-600 text-white"
            : isDone
              ? "bg-green-600 text-white"
              : "bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-300";
          return (
            <React.Fragment key={step.id || step.label || i}>
              <button
                type="button"
                className={`${baseClasses} ${colorClasses}`}
                onClick={() => goTo(i)}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Paso ${i}: ${step.label}`}
              >
                {i}
              </button>
              {i < total && (
                <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800" />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="sr-only" aria-live="polite">
        Paso {currentStep} de {total}
      </div>
    </div>
  );
}
