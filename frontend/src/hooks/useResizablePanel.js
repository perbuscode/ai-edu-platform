// src/hooks/useResizablePanel.js
import { useState, useEffect, useRef, useCallback } from "react";

const getStoredWidth = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export function useResizablePanel({
  isExpanded,
  minWidth,
  maxWidth,
  collapsedWidth,
  initialWidth,
  storageKey,
}) {
  const [width, setWidth] = useState(() =>
    getStoredWidth(storageKey, initialWidth)
  );
  const [isResizing, setIsResizing] = useState(false);
  const resizeStateRef = useRef(null);
  const wasDraggingRef = useRef(false);

  // Persist width to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(Math.round(width)));
    } catch (_error) {
      // noop
    }
  }, [width, storageKey]);

  // Handle resize events
  useEffect(() => {
    if (!isResizing) return;

    const handleMove = (event) => {
      const point = event.touches ? event.touches[0] : event;
      if (!point) return;
      const data = resizeStateRef.current;
      if (!data) return;

      const delta = data.startX - point.clientX;
      if (Math.abs(delta) > 2) {
        wasDraggingRef.current = true;
      }

      let nextWidth = data.startWidth + delta;
      if (!Number.isFinite(nextWidth)) return;
      nextWidth = Math.min(Math.max(nextWidth, minWidth), maxWidth);
      setWidth(Math.round(nextWidth));
    };

    const stopResize = () => {
      setIsResizing(false);
      resizeStateRef.current = null;
      // Reset drag flag after a short delay to allow click event to process
      setTimeout(() => {
        wasDraggingRef.current = false;
      }, 100);
    };

    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopResize);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", stopResize);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stopResize);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", stopResize);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, minWidth, maxWidth]);

  const startResize = useCallback(
    (event) => {
      const isMouseEvent = "button" in event;
      if (isMouseEvent && event.button !== 0) return;

      const point = event.touches ? event.touches[0] : event;
      if (!point) return;

      event.preventDefault();
      wasDraggingRef.current = false;
      resizeStateRef.current = { startX: point.clientX, startWidth: width };
      setIsResizing(true);
    },
    [width]
  );

  const panelWidth = isExpanded ? width : collapsedWidth;

  return { panelWidth, isResizing, startResize, wasDraggingRef };
}
