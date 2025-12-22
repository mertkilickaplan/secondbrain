"use client";

import { useState, useEffect, useRef } from "react";

interface SearchResult {
    id: string;
    title: string;
    summary: string | null;
    status: string;
    snippet?: string;  // Highlighted snippet from PostgreSQL
    rank?: number;     // Relevance score
    type?: string;     // Note type
}

interface SearchBarProps {
    onSelectNode: (nodeId: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

// Highlight search terms in text
function highlightText(text: string, query: string): string {
    if (!text || !query) return text;

    // Split query into words and create regex
    const words = query.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return text;

    const regex = new RegExp(`(${words.join('|')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-300 dark:bg-yellow-600 px-0.5 rounded">$1</mark>');
}

export default function SearchBar({ onSelectNode, isOpen, onClose }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Filter state
    const [selectedTag, setSelectedTag] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("");
    const [availableTags, setAvailableTags] = useState<string[]>([]);

    // Search history
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        if (!isOpen) {
            setQuery("");
            setResults([]);
            setSelectedIndex(0);
        } else {
            // Fetch available tags when opened
            const fetchTags = async () => {
                try {
                    const res = await fetch('/api/tags');
                    if (res.ok) {
                        const data = await res.json();
                        setAvailableTags(data.tags || []);
                    }
                } catch (e) {
                    console.error('Failed to fetch tags:', e);
                }
            };
            fetchTags();

            // Load search history
            const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            setSearchHistory(history);
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
                // Build query string with filters
                const params = new URLSearchParams({ q: query });
                if (selectedTag) params.append('tag', selectedTag);
                if (selectedStatus) params.append('status', selectedStatus);
                if (selectedType) params.append('type', selectedType);

                const res = await fetch(`/api/search?${params.toString()}`);
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
    }, [query, selectedTag, selectedStatus, selectedType]);

    const saveToHistory = (searchQuery: string) => {
        if (searchQuery.length < 2) return;

        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const updated = [searchQuery, ...history.filter((q: string) => q !== searchQuery)].slice(0, 10);
        localStorage.setItem('searchHistory', JSON.stringify(updated));
        setSearchHistory(updated);
    };

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
            saveToHistory(query);
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
                        placeholder={query.startsWith('#') ? "Search by tag..." : "Search notes... (use # for tags)"}
                        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                    />
                    {query.startsWith('#') && (
                        <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                            🏷️ Tag Search
                        </span>
                    )}
                    <kbd className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">ESC</kbd>
                </div>

                {/* Filters */}
                <div className="flex gap-2 p-3 border-b border-border bg-muted/30">
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="text-xs px-2 py-1.5 bg-card border border-border rounded outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">All Tags</option>
                        {availableTags.map(tag => (
                            <option key={tag} value={tag}>#{tag}</option>
                        ))}
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="text-xs px-2 py-1.5 bg-card border border-border rounded outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">All Status</option>
                        <option value="ready">✅ Ready</option>
                        <option value="processing">⏳ Processing</option>
                        <option value="error">❌ Error</option>
                    </select>

                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="text-xs px-2 py-1.5 bg-card border border-border rounded outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">All Types</option>
                        <option value="text">📝 Text</option>
                        <option value="url">🔗 URL</option>
                    </select>

                    {/* Clear filters button */}
                    {(selectedTag || selectedStatus || selectedType) && (
                        <button
                            onClick={() => {
                                setSelectedTag("");
                                setSelectedStatus("");
                                setSelectedType("");
                            }}
                            className="text-xs px-2 py-1.5 bg-card border border-border rounded hover:bg-muted transition-colors"
                            title="Clear filters"
                        >
                            ✕
                        </button>
                    )}
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

                    {/* Search History */}
                    {!isLoading && query.length === 0 && searchHistory.length > 0 && (
                        <div className="p-3">
                            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-1">Recent Searches</h3>
                            {searchHistory.map((historyQuery, i) => (
                                <button
                                    key={i}
                                    onClick={() => setQuery(historyQuery)}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded transition-colors flex items-center gap-2"
                                >
                                    <span className="text-muted-foreground">🕐</span>
                                    {historyQuery}
                                </button>
                            ))}
                        </div>
                    )}

                    {!isLoading && results.map((result: any, index) => {
                        const displayTitle = result.title && result.title !== "New Note" && result.title !== "Untitled"
                            ? result.title
                            : result.content?.slice(0, 50) + (result.content?.length > 50 ? "..." : "") || "Untitled";

                        return (
                            <button
                                key={result.id}
                                onClick={() => {
                                    onSelectNode(result.id);
                                    saveToHistory(query);
                                    onClose();
                                }}
                                className={`w-full text-left p-4 hover:bg-muted transition-colors border-b border-border last:border-b-0 ${index === selectedIndex ? "bg-muted" : ""
                                    }`}
                            >
                                {/* Title with highlighting */}
                                <div
                                    className="font-medium text-sm mb-1"
                                    dangerouslySetInnerHTML={{
                                        __html: highlightText(displayTitle, query)
                                    }}
                                />

                                {/* Snippet or summary with highlighting */}
                                {(result.snippet || result.summary) && (
                                    <p
                                        className="text-xs text-muted-foreground line-clamp-2"
                                        dangerouslySetInnerHTML={{
                                            __html: result.snippet || highlightText(result.summary, query)
                                        }}
                                    />
                                )}

                                {/* Type badge and relevance score */}
                                <div className="flex items-center gap-2 mt-1">
                                    {result.type && (
                                        <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                                            {result.type === 'url' ? '🔗 URL' : '📝 Text'}
                                        </span>
                                    )}
                                    {process.env.NODE_ENV === 'development' && result.rank && typeof result.rank === 'number' && (
                                        <span className="text-[10px] text-muted-foreground">
                                            Score: {result.rank.toFixed(3)}
                                        </span>
                                    )}
                                </div>
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
