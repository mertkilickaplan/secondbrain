"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import InputArea from "@/components/InputArea";
import GraphView from "@/components/GraphView";
import NoteDetail from "@/components/NoteDetail";
import ThemeToggle from "@/components/ThemeToggle";
import SearchBar from "@/components/SearchBar";
import ExportImportModal from "@/components/ExportImportModal";
import { GraphSkeleton } from "@/components/Skeleton";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import type { GraphData, GraphNode } from "@/types";

export default function Home() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/graph");
      if (res.ok) {
        const graphData = await res.json();
        setData(graphData);
      }
    } catch (error) {
      console.error("Failed to fetch graph data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    setIsSidebarOpen(true);
  };

  const handleNoteAdded = () => {
    // Refresh graph after adding a note
    fetchData();
  };

  const handleSelectNodeById = (nodeId: string) => {
    const node = data.nodes.find((n: any) => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      setIsSidebarOpen(true);
    }
  };

  // Keyboard shortcuts handlers
  const shortcutHandlers = useMemo(() => ({
    onSearch: () => setIsSearchOpen(true),
    onCloseSidebar: () => {
      if (isSearchOpen) {
        setIsSearchOpen(false);
      } else if (isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    },
    onNewNote: () => {
      // Focus the input area
      const textarea = document.querySelector("textarea");
      if (textarea) textarea.focus();
    },
  }), [isSearchOpen, isSidebarOpen]);

  useKeyboardShortcuts(shortcutHandlers);

  return (
    <main className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden relative">

      {/* Header / Brand (Absolute Top Left) */}
      <div className="absolute top-2 sm:top-4 left-3 sm:left-6 z-10 pointer-events-none select-none">
        <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Second Brain Lite
        </h1>
        <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest opacity-70">
          AI Knowledge Map
        </p>
      </div>

      {/* Header Buttons (Top Right) */}
      <div className="fixed top-2 sm:top-4 right-3 sm:right-6 z-40 flex items-center gap-2">
        {/* Export/Import Button */}
        <button
          onClick={() => setIsExportImportOpen(true)}
          className="p-2 rounded-lg bg-card/80 backdrop-blur-md border border-border hover:bg-muted transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
          aria-label="Export/Import data"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>

        {/* Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="p-2 rounded-lg bg-card/80 backdrop-blur-md border border-border hover:bg-muted transition-colors flex items-center gap-2 min-w-[44px] min-h-[44px] justify-center"
          aria-label="Search notes"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <kbd className="hidden sm:inline text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>

      {/* Input Area (Centered Top) */}
      <InputArea onNoteAdded={handleNoteAdded} />

      {/* Graph Area (Full Screen) */}
      <div className="flex-1 relative cursor-crosshair">
        {isLoading ? (
          <GraphSkeleton />
        ) : data.nodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none">
            <div className="text-center">
              <p className="mb-2">Your brain is empty.</p>
              <p className="text-xs opacity-50">Write a note above to start connecting dots.</p>
              <p className="text-xs opacity-30 mt-4">Press <kbd className="bg-muted px-1 rounded">⌘K</kbd> to search</p>
            </div>
          </div>
        ) : (
          <GraphView data={data} onNodeClick={handleNodeClick} />
        )}
      </div>

      {/* Search Modal */}
      <SearchBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectNode={handleSelectNodeById}
      />

      {/* Export/Import Modal */}
      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        onDataChange={fetchData}
      />

      {/* Detail Sidebar (Right Overlay) */}
      {isSidebarOpen && (
        <NoteDetail
          node={selectedNode}
          edges={data.links}
          allNodes={data.nodes}
          onClose={() => setIsSidebarOpen(false)}
          onDataChange={fetchData}
        />
      )}
    </main>
  );
}
