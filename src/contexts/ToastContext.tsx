"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            px-4 py-3 rounded-lg shadow-lg backdrop-blur-md border
                            animate-in slide-in-from-right-5 fade-in duration-200
                            ${toast.type === "success" ? "bg-green-500/90 border-green-400 text-white" : ""}
                            ${toast.type === "error" ? "bg-destructive/90 border-destructive text-destructive-foreground" : ""}
                            ${toast.type === "info" ? "bg-card/90 border-border text-foreground" : ""}
                        `}
                        onClick={() => removeToast(toast.id)}
                    >
                        <div className="flex items-center gap-2">
                            {toast.type === "success" && <span>✓</span>}
                            {toast.type === "error" && <span>✕</span>}
                            {toast.type === "info" && <span>ℹ</span>}
                            <span className="text-sm font-medium">{toast.message}</span>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
