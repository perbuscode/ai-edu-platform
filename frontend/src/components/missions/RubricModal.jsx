// src/components/missions/RubricModal.jsx
import React, { useEffect, useRef } from "react";
import {
  openPlan,
  openQuiz,
  openExplanation,
  assistantPush,
} from "../../utils/assistant";

function handleNextAction(action) {
  if (!action) return;
  const payload = action.payload || {};
  switch (action.action) {
    case "PLAN_15":
      openPlan({ minutes: 15, ...payload });
      break;
    case "QUIZ":
      openQuiz(payload || { questions: 5 });
      break;
    case "REVIEW":
      assistantPush({
        tag: "Revision",
        title: action.label || "Revision sugerida",
        desc: payload?.desc || "",
      });
      break;
    case "EXPLAIN":
      openExplanation(payload || { topic: action.label });
      break;
    default:
      assistantPush({
        tag: "Accion",
        title: action.label || "Accion sugerida",
        desc: "",
      });
  }
}

export default function RubricModal({
  open,
  onClose,
  rubric,
  loading = false,
  level,
  onSaveToFeed,
  score,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timeout = setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose?.();
      }
    }
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rubric-title"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 focus:outline-none"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2
              id="rubric-title"
              className="text-lg font-semibold text-slate-900"
            >
              Rubrica del diagnostico
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Nivel alcanzado:{" "}
              <span className="font-semibold text-slate-900">
                {level || rubric?.level || "-"}
              </span>
              {typeof score === "number" ? ` Score: ${score}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (typeof onSaveToFeed === "function") {
                  onSaveToFeed();
                } else {
                  assistantPush({
                    tag: "Rubrica",
                    title: level ? `Nivel ${level}` : "Nivel",
                    desc:
                      score != null ? `Score: ${score}` : "Consulta la rubrica",
                  });
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50"
            >
              Guardar en feed
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-slate-600">Cargando rubrica...</p>
        ) : rubric ? (
          <>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-sm text-slate-800 border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">
                      Dimension
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Bajo</th>
                    <th className="px-4 py-3 text-left font-semibold">Medio</th>
                    <th className="px-4 py-3 text-left font-semibold">Alto</th>
                  </tr>
                </thead>
                <tbody>
                  {(rubric.criteria || []).map((criterion, index) => (
                    <tr
                      key={`${criterion.dimension || "criterion"}-${index}`}
                      className="border-t border-slate-200"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {criterion.dimension}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {criterion.low}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {criterion.mid}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {criterion.high}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(rubric.nextActions || []).length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                  Acciones sugeridas
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {rubric.nextActions.map((action, index) => (
                    <button
                      key={`${action.label || "action"}-${index}`}
                      type="button"
                      className="px-3 py-1.5 rounded-full border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => handleNextAction(action)}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="mt-6 text-sm text-slate-600">
            No se encontro informacion de rubrica para este nivel.
          </p>
        )}
      </div>
    </div>
  );
}
