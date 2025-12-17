"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import InputArea from "@/components/InputArea";
import GraphView from "@/components/GraphView";
import NoteDetail from "@/components/NoteDetail";
import ThemeToggle from "@/components/ThemeToggle";
import SearchBar from "@/components/SearchBar";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export default function Home() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/graph");
      if (res.ok) {
        const graphData = await res.json();
        setData(graphData);
      }
    } catch (error) {
      console.error("Failed to fetch graph data", error);
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
      <div className="absolute top-4 left-6 z-10 pointer-events-none select-none">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Second Brain Lite
        </h1>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-70">
          AI Knowledge Map
        </p>
      </div>

      {/* Theme Toggle (Top Right) */}
      <ThemeToggle />

      {/* Search Button (Top Right, before theme toggle) */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="fixed top-4 right-16 z-40 p-2 rounded-lg bg-card/80 backdrop-blur-md border border-border hover:bg-muted transition-colors flex items-center gap-2"
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

      {/* Input Area (Centered Top) */}
      <InputArea onNoteAdded={handleNoteAdded} />

      {/* Graph Area (Full Screen) */}
      <div className="flex-1 relative cursor-crosshair">
        {data.nodes.length === 0 ? (
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

