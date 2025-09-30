// src/utils/assistant.js
function getAssistant() {
  if (typeof window === "undefined") return null;
  return window.Assistant || null;
}

export function assistantPush(payload) {
  try {
    const api = getAssistant();
    if (api && typeof api.push === "function") {
      api.push(payload);
    } else {
      console.debug("[assistant] push", payload);
    }
  } catch (error) {
    console.debug("[assistant] push error", error);
  }
}

export function openPlan(payload) {
  try {
    const api = getAssistant();
    if (api && typeof api.openPlan === "function") {
      api.openPlan(payload);
    } else {
      console.debug("[assistant] openPlan", payload);
    }
  } catch (error) {
    console.debug("[assistant] openPlan error", error);
  }
}

export function openQuiz(payload) {
  try {
    const api = getAssistant();
    if (api && typeof api.openQuiz === "function") {
      api.openQuiz(payload);
    } else {
      console.debug("[assistant] openQuiz", payload);
    }
  } catch (error) {
    console.debug("[assistant] openQuiz error", error);
  }
}

export function openExplanation(payload) {
  try {
    const api = getAssistant();
    if (api && typeof api.openExplanation === "function") {
      api.openExplanation(payload);
    } else {
      console.debug("[assistant] openExplanation", payload);
    }
  } catch (error) {
    console.debug("[assistant] openExplanation error", error);
  }
}
