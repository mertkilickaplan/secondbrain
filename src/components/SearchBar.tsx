"use client";

import { useState, useEffect, useRef } from "react";

interface SearchResult {
    id: string;
    title: string;
    summary: string | null;
    status: string;
}

interface SearchBarProps {
    onSelectNode: (nodeId: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchBar({ onSelectNode, isOpen, onClose }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        if (!isOpen) {
            setQuery("");
            setResults([]);
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Debounced search
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data.results || []);
                    setSelectedIndex(0);
                }
            } catch (e) {
                console.error("Search failed", e);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && results[selectedIndex]) {
            onSelectNode(results[selectedIndex].id);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-24 z-50" onClick={onClose}>
            <div
                className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-border">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-muted-foreground"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search notes..."
                        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                    />
                    <kbd className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">ESC</kbd>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto">
                    {isLoading && (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                            Searching...
                        </div>
                    )}

                    {!isLoading && query.length >= 2 && results.length === 0 && (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                            No results found
                        </div>
                    )}

                    {!isLoading && results.map((result: any, index) => {
                        // Use content snippet if title is generic
                        const displayTitle = result.title && result.title !== "New Note" && result.title !== "Untitled"
                            ? result.title
                            : result.content?.slice(0, 50) + (result.content?.length > 50 ? "..." : "") || "Untitled";

                        return (
                            <button
                                key={result.id}
                                onClick={() => {
                                    onSelectNode(result.id);
                                    onClose();
                                }}
                                className={`w-full text-left p-4 hover:bg-muted transition-colors border-b border-border last:border-b-0 ${index === selectedIndex ? "bg-muted" : ""
                                    }`}
                            >
                                <div className="font-medium text-sm mb-1">{displayTitle}</div>
                                {result.summary && (
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                        {result.summary}
                                    </p>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Footer hint */}
                <div className="p-3 border-t border-border bg-muted/50 flex items-center gap-4 text-xs text-muted-foreground">
                    <span><kbd className="bg-muted px-1 rounded">↑↓</kbd> navigate</span>
                    <span><kbd className="bg-muted px-1 rounded">Enter</kbd> select</span>
                    <span><kbd className="bg-muted px-1 rounded">Esc</kbd> close</span>
                </div>
            </div>
        </div>
    );
}
