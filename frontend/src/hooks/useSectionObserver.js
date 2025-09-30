import { useEffect } from "react";

export function useSectionObserver(ids, onActive) {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (!Array.isArray(ids) || ids.length === 0) return undefined;

    const elements = ids
      .map((id) =>
        typeof id === "string" ? document.getElementById(id) : null
      )
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const topId = visible[0]?.target?.id;
        if (topId && typeof onActive === "function") {
          onActive(topId);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.2, 0.6] }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [ids, onActive]);
}
