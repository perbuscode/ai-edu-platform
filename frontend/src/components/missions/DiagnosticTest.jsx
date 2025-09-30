// src/components/missions/DiagnosticTest.jsx
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

const QUESTIONS = [
  {
    id: "q1",
    prompt: "¿Qué métrica usarías para comparar ventas acumuladas entre años?",
    options: [
      { value: "sum", label: "SUM en la tabla de ventas" },
      { value: "ytd", label: "TOTALYTD con CALCULATE" },
      { value: "avg", label: "AVERAGEX en la tabla calendar" },
    ],
  },
  {
    id: "q2",
    prompt:
      "Para limpiar datos duplicados en Power Query, ¿qué paso aplicarías?",
    options: [
      { value: "merge", label: "Combinar consultas" },
      { value: "remove", label: "Eliminar duplicados por columnas clave" },
      { value: "group", label: "Agrupar por categoría" },
    ],
  },
  {
    id: "q3",
    prompt:
      "¿Qué visual ayuda a explicar una tendencia con contexto narrativo?",
    options: [
      { value: "line", label: "Gráfico de líneas con anotaciones" },
      { value: "table", label: "Tabla con totales" },
      { value: "gauge", label: "Indicador de velocímetro" },
    ],
  },
  {
    id: "q4",
    prompt: "Para filtrar por rol sin afectar todo el modelo, ¿qué usarías?",
    options: [
      { value: "rls", label: "Roles de Row Level Security" },
      { value: "bookmark", label: "Bookmarks" },
      { value: "tooltip", label: "Tooltips personalizados" },
    ],
  },
  {
    id: "q5",
    prompt: "¿Qué paso seguirías después de presentar los hallazgos?",
    options: [
      { value: "share", label: "Compartir dashboard y programar refrescos" },
      { value: "close", label: "Cerrar el informe sin compartir" },
      { value: "export", label: "Exportar a CSV y eliminar modelo" },
    ],
  },
];

const DiagnosticTest = forwardRef(function DiagnosticTest(
  {
    attemptId,
    onSubmit,
    submitting = false,
    initialAnswers = {},
    onAnswersChange,
  },
  ref
) {
  const formRef = useRef(null);
  const [answers, setAnswers] = useState(() => ({ ...initialAnswers }));
  const [error, setError] = useState(null);

  useEffect(() => {
    setAnswers((prev) => ({ ...prev, ...initialAnswers }));
  }, [initialAnswers]);

  useImperativeHandle(ref, () => ({
    focusFirstQuestion() {
      const firstInput = formRef.current?.querySelector('input[type="radio"]');
      if (firstInput) {
        firstInput.focus();
      }
    },
  }));

  const answeredCount = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers]
  );

  function handleChange(questionId, value) {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: value };
      if (typeof onAnswersChange === "function") {
        onAnswersChange(next);
      }
      return next;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    if (answeredCount < QUESTIONS.length) {
      setError("Responde todas las preguntas antes de enviar.");
      return;
    }
    setError(null);
    const payload = QUESTIONS.map((q) => ({
      questionId: q.id,
      answer: answers[q.id],
    }));
    onSubmit?.(payload, answers);
  }

  return (
    <form
      ref={formRef}
      className="mt-4 space-y-4"
      onSubmit={handleSubmit}
      aria-label="Diagnóstico sugerido"
    >
      <input type="hidden" name="attemptId" value={attemptId} />
      {QUESTIONS.map((question, idx) => (
        <fieldset
          key={question.id}
          className="border border-slate-200 rounded-xl p-4"
        >
          <legend className="font-medium text-slate-900">
            {idx + 1}. {question.prompt}
          </legend>
          <div className="mt-3 space-y-2">
            {question.options.map((option) => {
              const inputId = `${question.id}-${option.value}`;
              return (
                <label
                  key={option.value}
                  htmlFor={inputId}
                  className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer"
                >
                  <input
                    id={inputId}
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={answers[question.id] === option.value}
                    onChange={() => handleChange(question.id, option.value)}
                    className="mt-0.5"
                    required={idx === 0}
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      {error && (
        <p className="text-sm text-rose-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-slate-600">
          Preguntas respondidas: {answeredCount} / {QUESTIONS.length}
        </p>
        <button
          type="submit"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium shadow hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-70"
          disabled={submitting}
        >
          {submitting ? "Enviando..." : "Enviar diagnóstico"}
        </button>
      </div>
    </form>
  );
});

export default DiagnosticTest;
