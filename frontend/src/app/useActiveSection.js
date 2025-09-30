// src/app/useActiveSection.js
import { useCallback, useEffect, useRef, useState } from "react";
import { useSectionObserver } from "../hooks/useSectionObserver";

// Hook: tracks the id of the section currently in view using IntersectionObserver.
// API: const { activeId, observe } = useActiveSection();
// - Call observe(ref.current) in each section to register by DOM element.
// - activeId updates as the user scrolls and is safe for server-side rendering.
export default function useActiveSection(initialActiveId = "intro") {
  const [ids, setIds] = useState([]);
  const [activeId, setActiveId] = useState(initialActiveId);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useSectionObserver(ids, setActiveId);

  const observe = useCallback((element) => {
    if (!element?.id) return () => {};

    setIds((prev) => {
      if (prev.includes(element.id)) return prev;
      return [...prev, element.id];
    });

    return () => {
      if (!mountedRef.current) return;
      setIds((prev) => prev.filter((id) => id !== element.id));
    };
  }, []);

  return { activeId, observe };
}
