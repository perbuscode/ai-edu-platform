// src/utils/analytics.js
export function track(eventName, payload = {}) {
  try {
    if (
      typeof window !== "undefined" &&
      window.analytics &&
      typeof window.analytics.track === "function"
    ) {
      window.analytics.track(eventName, payload);
      return;
    }
  } catch (error) {
    console.debug("[analytics] track error", error);
  }
  try {
    console.debug([analytics], payload);
  } catch (_error) {
    // noop
  }
}
