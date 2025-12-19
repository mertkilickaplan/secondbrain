"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import InputArea from "@/components/InputArea";
import GraphView from "@/components/GraphView";
import NoteDetail from "@/components/NoteDetail";
import SearchBar from "@/components/SearchBar";
import ExportImportModal from "@/components/ExportImportModal";
import UserMenu from "@/components/UserMenu";
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

      {/* Fixed Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-3 sm:px-6">
        {/* Left: Brand */}
        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent leading-tight">
            Second Brain Lite
          </h1>
          <p className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-widest opacity-70">
            AI Knowledge Map
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-2 justify-center"
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

          {/* Export/Import Button */}
          <button
            onClick={() => setIsExportImportOpen(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
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

          {/* User Menu (Theme + Sign Out) */}
          <UserMenu />
        </div>
      </header>

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
