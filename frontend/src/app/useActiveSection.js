// src/app/useActiveSection.js
import { useCallback, useEffect, useRef, useState } from "react";

// Hook: tracks the id of the section currently in view.
// API: const { activeId, observe } = useActiveSection();
// - Call observe(el) in each section to register it with the observer.
// - activeId updates as the user scrolls.
export default function useActiveSection() {
  const [activeId, setActiveId] = useState("intro");
  const observerRef = useRef(null);
  const elementsRef = useRef(new Set());

  useEffect(() => {
    const opts = { root: null, rootMargin: "0px 0px -60% 0px", threshold: 0 };
    const handle = (entries) => {
      // When a section enters the viewport, mark it active.
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target?.id) {
          setActiveId(entry.target.id);
        }
      });
    };
    const obs = new IntersectionObserver(handle, opts);
    observerRef.current = obs;
    // Attach to currently registered elements (if any)
    elementsRef.current.forEach((el) => el && obs.observe(el));
    return () => {
      obs.disconnect();
      observerRef.current = null;
    };
  }, []);

  const observe = useCallback((el) => {
    if (!el) return () => {};
    elementsRef.current.add(el);
    if (observerRef.current) observerRef.current.observe(el);
    return () => {
      try {
        if (observerRef.current) observerRef.current.unobserve(el);
      } finally {
        elementsRef.current.delete(el);
      }
    };
  }, []);

  return { activeId, observe };
}

