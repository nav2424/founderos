"use client";

import { useEffect } from "react";

export function useKeyboardShortcuts(handlers: {
  onOpenAssistant?: () => void;
  onGoDashboard?: () => void;
  onGoTasks?: () => void;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === "k") {
        e.preventDefault();
        handlers.onOpenAssistant?.();
      }
      if (meta && e.shiftKey && e.key === "D") {
        e.preventDefault();
        handlers.onGoDashboard?.();
      }
      if (meta && e.shiftKey && e.key === "T") {
        e.preventDefault();
        handlers.onGoTasks?.();
      }
      if (meta && e.shiftKey && e.key === "A") {
        e.preventDefault();
        handlers.onOpenAssistant?.();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handlers]);
}
