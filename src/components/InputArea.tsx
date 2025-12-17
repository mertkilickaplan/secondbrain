"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function InputArea({ onNoteAdded }: { onNoteAdded: () => void }) {
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<"text" | "url">("text");

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!content.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: content,
                    type: mode,
                    url: mode === "url" ? content : undefined,
                }),
            });

            if (res.ok) {
                const note = await res.json();
                setContent("");
                onNoteAdded(); // Immediate refresh to show node

                // Fire-and-forget process
                fetch(`/api/notes/${note.id}/process`, { method: "POST" });

                // Poll once after a few seconds to catch edges
                setTimeout(() => {
                    onNoteAdded();
                }, 4000);
            }
        } catch (error) {
            console.error("Failed to add note", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-2xl z-20 px-4">
            <div className="bg-card/80 backdrop-blur-md border border-border rounded-xl shadow-lg p-3 transition-all focus-within:ring-2 focus-within:ring-primary/50">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">

                    <div className="flex items-center gap-2 mb-1">
                        <button
                            type="button"
                            onClick={() => setMode("text")}
                            className={cn(
                                "text-xs px-2 py-1 rounded transition-colors",
                                mode === "text" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            Text
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("url")}
                            className={cn(
                                "text-xs px-2 py-1 rounded transition-colors",
                                mode === "url" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            URL
                        </button>
                    </div>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={mode === "text" ? "What's on your mind?" : "Paste a URL..."}
                        className="w-full bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground min-h-[3rem]"
                        rows={mode === "url" ? 1 : 2}
                    />

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading || !content.trim()}
                            className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? "Connecting dots..." : "Add to Brain"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
