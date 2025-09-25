// src/services/diagnostics.js
import { postJSON, getJSON } from '../utils/api';

const randomId = () => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {}
  return `diag_${Math.random().toString(36).slice(2)}`;
};

export async function startDiagnostic(userId, courseId) {
  const payload = await postJSON('/api/diagnostics/start', { userId, courseId });
  return normalizeAttempt(payload, userId, courseId);
}

export async function submitDiagnostic(attemptId, answers) {
  const payload = await postJSON('/api/diagnostics/submit', { attemptId, answers });
  return normalizeResult(payload, attemptId);
}

export async function getDiagnosticRubric(level) {
  const payload = await getJSON(`/api/diagnostics/rubric?level=${level}`);
  return normalizeRubric(payload, level);
}

function normalizeAttempt(data, userId, courseId) {
  if (!data || typeof data !== 'object') {
    return {
      attemptId: randomId(),
      userId,
      courseId,
      startedAt: new Date().toISOString(),
      status: 'started',
    };
  }
  return {
    attemptId: data.attemptId || data.id || randomId(),
    userId: data.userId || userId,
    courseId: data.courseId || courseId,
    startedAt: data.startedAt || new Date().toISOString(),
    status: data.status === 'submitted' ? 'submitted' : 'started',
  };
}

function normalizeResult(data, attemptId) {
  if (!data || typeof data !== 'object') {
    throw new Error('Respuesta invalida');
  }
  return {
    attemptId: data.attemptId || attemptId,
    score: Number.isFinite(data.score) ? data.score : 0,
    level: data.level || 'BASICO',
    recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
  };
}

function normalizeRubric(data, fallbackLevel) {
  if (!data || typeof data !== 'object') {
    throw new Error('Rubrica no disponible');
  }
  return {
    level: data.level || fallbackLevel,
    criteria: Array.isArray(data.criteria) ? data.criteria : [],
    nextActions: Array.isArray(data.nextActions) ? data.nextActions : [],
  };
}
