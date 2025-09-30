// src/components/FloatingAssistant.jsx (compatibility stub)
import React, { useEffect } from "react";

// This component used to render a floating AI assistant. It has been
// replaced by the right-side AssistantSidebar. We keep this file so that
// existing imports do not break. It renders nothing and exposes a helper to
// open the new sidebar if any legacy code attempts to trigger it.
export default function FloatingAssistant() {
  useEffect(() => {
    try {
      window.openFloatingAssistant = () => {
        try {
          window.Assistant?.open?.();
        } catch (_error) {
          // noop
        }
      };
    } catch (_error) {
      // noop
    }
    try {
      console.debug("[Assistant] FloatingAssistant hidden; sidebar active.");
    } catch (_error) {
      // noop
    }
  }, []);
  return null;
}
