// src/components/missions/DiagnosticCard.jsx
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useToast } from "../Toast";
import DiagnosticTest from "./DiagnosticTest";
import RubricModal from "./RubricModal";
import {
  startDiagnostic,
  submitDiagnostic,
  getDiagnosticRubric,
} from "../../services/diagnostics";
import { track } from "../../utils/analytics";
import { assistantPush } from "../../utils/assistant";

const STATUS = {
  IDLE: "idle",
  STARTING: "starting",
  IN_PROGRESS: "in_progress",
  SUBMITTING: "submitting",
  COMPLETED: "completed",
};

const STORAGE_PREFIX = "diagnostic";

function buildStorageKeys(userId, courseId) {
  const base = `${STORAGE_PREFIX}:${userId || "anon"}:${courseId || "default"}`;
  return {
    attempt: `${base}:lastAttemptId`,
    level: `${base}:lastLevel`,
    score: `${base}:lastScore`,
  };
}

function statusLabel(status) {
  switch (status) {
    case STATUS.STARTING:
      return "Iniciando...";
    case STATUS.IN_PROGRESS:
      return "En progreso";
    case STATUS.SUBMITTING:
      return "Enviando...";
    case STATUS.COMPLETED:
      return "Completado";
    default:
      return "Listo para iniciar";
  }
}

const DiagnosticCard = forwardRef(function DiagnosticCard(
  { userId, courseId },
  ref
) {
  const toast = useToast();
  const [status, setStatus] = useState(STATUS.IDLE);
  const [attempt, setAttempt] = useState(null);
  const [result, setResult] = useState(null);
  const [answersDraft, setAnswersDraft] = useState(null);
  const [rubricOpen, setRubricOpen] = useState(false);
  const [rubricData, setRubricData] = useState(null);
  const [rubricLoading, setRubricLoading] = useState(false);
  const testRef = useRef(null);

  const storageKeys = useMemo(
    () => buildStorageKeys(userId, courseId),
    [userId, courseId]
  );

  useEffect(() => {
    try {
      if (!userId || !courseId) return;
      const storedAttemptId = localStorage.getItem(storageKeys.attempt);
      const storedLevel = localStorage.getItem(storageKeys.level);
      const storedScore = localStorage.getItem(storageKeys.score);

      if (storedLevel && storedScore) {
        const parsedScore = Number(storedScore);
        setResult({
          attemptId: storedAttemptId || null,
          level: storedLevel,
          score: Number.isFinite(parsedScore) ? parsedScore : 0,
          recommendations: [],
        });
        setStatus(STATUS.COMPLETED);
        if (storedAttemptId) {
          setAttempt({
            attemptId: storedAttemptId,
            userId,
            courseId,
            startedAt: new Date().toISOString(),
            status: "submitted",
          });
        }
      } else if (storedAttemptId) {
        setAttempt({
          attemptId: storedAttemptId,
          userId,
          courseId,
          startedAt: new Date().toISOString(),
          status: "started",
        });
        setStatus(STATUS.IN_PROGRESS);
      }
    } catch (error) {
      console.debug("[diagnostic] init error", error);
    }
  }, [
    storageKeys.attempt,
    storageKeys.level,
    storageKeys.score,
    userId,
    courseId,
  ]);

  function focusTest() {
    if (
      testRef.current &&
      typeof testRef.current.focusFirstQuestion === "function"
    ) {
      testRef.current.focusFirstQuestion();
    }
  }

  async function ensureAttempt({
    trackStart = false,
    trackInitiated = false,
    forceNew = false,
    focus = true,
  } = {}) {
    if (!userId || !courseId) {
      toast.error("Debes iniciar sesión para realizar el diagnostico.");
      return null;
    }

    const hasStarted = attempt && attempt.status === "started";
    if (hasStarted && !forceNew) {
      setStatus(STATUS.IN_PROGRESS);
      if (trackInitiated) {
        track("diagnostic_initiated", {
          userId,
          courseId,
          attemptId: attempt.attemptId,
        });
      }
      if (focus) focusTest();
      return attempt;
    }

    setStatus(STATUS.STARTING);
    try {
      if (forceNew) {
        localStorage.removeItem(storageKeys.level);
        localStorage.removeItem(storageKeys.score);
        setResult(null);
      }
      const data = await startDiagnostic(userId, courseId);
      setAttempt(data);
      localStorage.setItem(storageKeys.attempt, data.attemptId);
      setAnswersDraft(null);
      setStatus(STATUS.IN_PROGRESS);
      if (trackStart) {
        track("diagnostic_start", {
          userId,
          courseId,
          attemptId: data.attemptId,
        });
      }
      if (trackInitiated) {
        track("diagnostic_initiated", {
          userId,
          courseId,
          attemptId: data.attemptId,
        });
      }
      if (focus) focusTest();
      return data;
    } catch (error) {
      console.debug("[diagnostic] start error", error);
      toast.error("No se pudo iniciar. Intenta de nuevo");
      setStatus(result ? STATUS.COMPLETED : STATUS.IDLE);
      return null;
    }
  }

  async function handlePrimaryClick() {
    const forceNew = status === STATUS.COMPLETED;
    await ensureAttempt({
      trackStart: true,
      focus: true,
      forceNew,
      trackInitiated: forceNew,
    });
  }

  async function handleSecondaryClick() {
    if (status === STATUS.SUBMITTING || status === STATUS.STARTING) return;
    if (status === STATUS.COMPLETED) {
      const confirmRestart = window.confirm(
        "Ya completaste el diagnostico. Deseas iniciar un nuevo intento?"
      );
      if (!confirmRestart) {
        handleViewRubric();
        return;
      }
      await ensureAttempt({
        trackStart: true,
        trackInitiated: true,
        forceNew: true,
        focus: true,
      });
      return;
    }
    if (status === STATUS.IN_PROGRESS && attempt) {
      track("diagnostic_initiated", {
        userId,
        courseId,
        attemptId: attempt.attemptId,
      });
      focusTest();
      return;
    }
    await ensureAttempt({
      trackInitiated: true,
      trackStart: status === STATUS.IDLE,
      focus: true,
    });
  }

  async function handleSubmitAnswers(answerArray, answerMap) {
    if (!attempt) return;
    setAnswersDraft(answerMap);
    setStatus(STATUS.SUBMITTING);
    try {
      const payload = await submitDiagnostic(attempt.attemptId, answerArray);
      setResult(payload);
      setStatus(STATUS.COMPLETED);
      setAttempt((prev) => (prev ? { ...prev, status: "submitted" } : null));
      localStorage.setItem(storageKeys.level, payload.level);
      localStorage.setItem(storageKeys.score, String(payload.score));
      track("diagnostic_submitted", {
        userId,
        courseId,
        attemptId: payload.attemptId,
        score: payload.score,
        level: payload.level,
      });
      assistantPush({
        tag: "Diagnostico",
        title: "Resultado disponible",
        desc: `Nivel ${payload.level} - Score ${payload.score}`,
      });
    } catch (error) {
      console.debug("[diagnostic] submit error", error);
      toast.error("No se pudo enviar el diagnostico. Reintenta, por favor.");
      setStatus(STATUS.IN_PROGRESS);
    }
  }

  async function handleViewRubric() {
    if (!result?.level) {
      toast.info("Completa el diagnostico para ver la rubrica.");
      return;
    }
    setRubricOpen(true);
    if (rubricData && rubricData.level === result.level) {
      track("rubric_viewed", { userId, courseId, level: result.level });
      return;
    }
    setRubricLoading(true);
    try {
      const data = await getDiagnosticRubric(result.level);
      setRubricData(data);
      setRubricLoading(false);
      track("rubric_viewed", { userId, courseId, level: data.level });
    } catch (error) {
      console.debug("[diagnostic] rubric error", error);
      toast.error("No se pudo cargar la rubrica");
      setRubricLoading(false);
    }
  }

  const primaryLabel = useMemo(() => {
    if (status === STATUS.SUBMITTING) return "Enviando...";
    if (status === STATUS.STARTING) return "Iniciando...";
    if (status === STATUS.COMPLETED) return "Reintentar diagnostico";
    if (status === STATUS.IN_PROGRESS) return "Continuar diagnostico";
    return "Realizar diagnostico";
  }, [status]);

  const canPrimary = status !== STATUS.SUBMITTING && status !== STATUS.STARTING;
  const canSecondary =
    status !== STATUS.SUBMITTING && status !== STATUS.STARTING;

  const shouldRenderCard =
    status !== STATUS.IDLE || !!attempt || !!answersDraft || !!result;

  const handleSaveRubric = () => {
    if (!result) return;
    assistantPush({
      tag: "Rubrica",
      title: `Nivel ${result.level}`,
      desc: result.score != null ? `Score ${result.score}` : "",
    });
  };
  useImperativeHandle(ref, () => ({
    startDiagnostic: handlePrimaryClick,
    viewRubric: handleViewRubric,
  }));

  if (!shouldRenderCard) {
    return null;
  }

  return (
    <article
      className="mt-8 border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col gap-4"
      id="diagnostico-card"
    >
      <div className="flex items-center gap-2 flex-nowrap overflow-x-auto">
        <button
          type="button"
          onClick={handlePrimaryClick}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium shadow hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-70 whitespace-nowrap"
          disabled={!canPrimary}
        >
          {primaryLabel}
        </button>
        <button
          type="button"
          onClick={handleSecondaryClick}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-70 whitespace-nowrap"
          disabled={!canSecondary}
        >
          Iniciar
        </button>
        <button
          type="button"
          onClick={handleViewRubric}
          className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 whitespace-nowrap"
          disabled={!result}
        >
          Ver rubrica
        </button>
      </div>

      {(status === STATUS.IN_PROGRESS || status === STATUS.SUBMITTING) && (
        <DiagnosticTest
          ref={testRef}
          attemptId={attempt?.attemptId}
          initialAnswers={answersDraft || {}}
          onSubmit={handleSubmitAnswers}
          submitting={status === STATUS.SUBMITTING}
          onAnswersChange={setAnswersDraft}
        />
      )}

      {status === STATUS.COMPLETED && result && (
        <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4 text-sm text-emerald-800">
          <p className="font-semibold text-emerald-900">
            Diagnostico completado
          </p>
          <p className="mt-1">
            Nivel {result.level} - Score {result.score}
          </p>
          {result.recommendations && result.recommendations.length > 0 && (
            <ul className="mt-2 list-disc list-inside space-y-1">
              {result.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <RubricModal
        open={rubricOpen}
        onClose={() => setRubricOpen(false)}
        rubric={rubricData}
        loading={rubricLoading}
        level={result?.level}
        score={result?.score}
        onSaveToFeed={handleSaveRubric}
      />
    </article>
  );
});

export default DiagnosticCard;
