"use client";

import { useEffect } from "react";

interface ShortcutHandlers {
    onSearch?: () => void;
    onNewNote?: () => void;
    onCloseSidebar?: () => void;
    onDelete?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in input fields
            const target = e.target as HTMLElement;
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
                // Only allow Escape in input fields
                if (e.key === "Escape" && handlers.onCloseSidebar) {
                    handlers.onCloseSidebar();
                }
                return;
            }

            // Cmd/Ctrl + K: Open search
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                handlers.onSearch?.();
            }

            // Cmd/Ctrl + N: Focus new note input
            if ((e.metaKey || e.ctrlKey) && e.key === "n") {
                e.preventDefault();
                handlers.onNewNote?.();
            }

            // Escape: Close sidebar
            if (e.key === "Escape") {
                handlers.onCloseSidebar?.();
            }

            // Delete or Backspace: Delete selected note (if handler provided)
            if ((e.key === "Delete" || e.key === "Backspace") && handlers.onDelete) {
                handlers.onDelete();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handlers]);
}
