// src/hooks/useScrollToHash.js
import { useEffect } from "react";

export function useScrollToHash(deps = []) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (!hash) return;

    let attempts = 0;
    const maxAttempts = 12;

    function tryScroll() {
      attempts += 1;
      const el = document.getElementById(hash);
      if (el) {
        try {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch {
          el.scrollIntoView();
        }
        return;
      }
      if (attempts < maxAttempts) {
        requestAnimationFrame(tryScroll);
      }
    }

    requestAnimationFrame(tryScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
