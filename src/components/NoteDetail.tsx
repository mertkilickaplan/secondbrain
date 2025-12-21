"use client";

import { useState } from "react";
import { useToast } from "@/contexts/ToastContext";

interface NoteDetailProps {
    node: any | null;
    edges: any[];
    allNodes: any[]; // To resolve target IDs
    onClose: () => void;
    onDataChange?: () => void;
}

export default function NoteDetail({ node, edges, allNodes, onClose, onDataChange }: NoteDetailProps) {
    const { addToast } = useToast();
    const [isRetrying, setIsRetrying] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editTags, setEditTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Initialize tags when entering edit mode or node changes
    /* eslint-disable react-hooks/exhaustive-deps */
    const tags = node?.tags ? JSON.parse(node.tags) : [];

    if (!node) return null;

    // Filter edges connected to this node
    const relatedEdges = edges.filter(e => e.source === node.id || e.target === node.id);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/notes/${node.id}`, { method: "DELETE" });
            if (res.ok) {
                addToast("Note deleted successfully", "success");
                onClose();
                if (onDataChange) onDataChange();
            } else {
                addToast("Failed to delete note", "error");
            }
        } catch (e) {
            console.error("Delete failed", e);
            addToast("Failed to delete note", "error");
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleStartEdit = () => {
        setEditTitle(node.title || "");
        setEditContent(node.content || "");
        setEditTags(tags);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditTitle("");
        setEditContent("");
        setEditTags([]);
        setNewTag("");
    };

    const handleAddTag = () => {
        if (!newTag.trim()) return;
        if (!editTags.includes(newTag.trim())) {
            setEditTags([...editTags, newTag.trim()]);
        }
        setNewTag("");
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setEditTags(editTags.filter(t => t !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSaveEdit = async (reprocess: boolean = false) => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/notes/${node.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: editTitle,
                    content: editContent,
                    tags: editTags,
                    reprocess,
                }),
            });

            if (res.ok) {
                setIsEditing(false);
                if (reprocess) {
                    // Trigger reprocessing
                    fetch(`/api/notes/${node.id}/process`, { method: "POST" });
                    addToast("Note saved, AI reprocessing...", "info");
                } else {
                    addToast("Note saved successfully", "success");
                }
                if (onDataChange) onDataChange();
            } else {
                addToast("Failed to save note", "error");
            }
        } catch (e) {
            console.error("Save failed", e);
            addToast("Failed to save note", "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <aside className="w-full sm:w-80 md:w-96 h-[calc(100%-3.5rem)] border-l border-border bg-card/95 sm:bg-card/50 backdrop-blur-xl fixed sm:absolute right-0 top-14 bottom-0 shadow-2xl overflow-y-auto p-4 sm:p-6 z-30 transition-transform animate-in slide-in-from-right-10">
            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-2xl max-w-sm mx-4">
                        <h3 className="text-lg font-bold mb-2">Delete Note?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            This action cannot be undone. All connections to this note will also be removed.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2 text-sm rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-start mb-6">
                {isEditing ? (
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-xl font-bold bg-transparent border-b border-primary outline-none w-full mr-2"
                        placeholder="Note title..."
                    />
                ) : (
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                        {node.title || "Untitled Note"}
                    </h2>
                )}
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground flex-shrink-0">
                    ✕
                </button>
            </div>

            {/* Action Buttons */}
            {!isEditing && (
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={handleStartEdit}
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                        ✏️ Edit
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        🗑️ Delete
                    </button>
                </div>
            )}

            {/* Status Indicators */}
            {(node.status === "processing" || isRetrying) && (
                <div className="mb-4 bg-muted/50 p-3 rounded-lg border border-border animate-pulse">
                    <p className="text-xs text-center font-medium">
                        {isRetrying ? "Retrying analysis..." : "AI is processing this note..."}
                    </p>
                </div>
            )}

            {node.status === "error" && !isRetrying && (
                <div className="mb-4 bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                    <p className="text-xs text-destructive font-medium mb-2">AI processing failed.</p>
                    <button
                        onClick={async () => {
                            setIsRetrying(true);
                            try {
                                await fetch(`/api/notes/${node.id}/process`, { method: "POST" });
                                if (onDataChange) onDataChange();
                            } catch (e) {
                                console.error("Retry failed", e);
                            } finally {
                                setIsRetrying(false);
                            }
                        }}
                        className="w-full text-xs bg-destructive/20 hover:bg-destructive/30 text-destructive py-1.5 rounded transition-colors"
                    >
                        Retry Processing
                    </button>
                </div>
            )}

            <div className="space-y-6">
                {/* Tags Section */}
                <div>
                    <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Tags</h3>
                    {isEditing ? (
                        <div className="space-y-2 mb-4">
                            <div className="flex flex-wrap gap-2">
                                {editTags.map(tag => (
                                    <span key={tag} className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        {tag}
                                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-foreground">×</button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 text-sm bg-muted/50 border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Add tag..."
                                />
                                <button onClick={handleAddTag} className="text-xs px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg transition-colors">Add</button>
                            </div>
                        </div>
                    ) : (
                        tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {tags.map((tag: string) => (
                                    <span key={tag} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full border border-border">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )
                    )}
                </div>

                {/* Content */}
                <div>
                    <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">My Note</h3>
                    {isEditing ? (
                        <>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full text-sm bg-muted/50 border border-border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[100px]"
                                placeholder="Note content..."
                            />
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={handleCancelEdit}
                                    className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleSaveEdit(false)}
                                    className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Saving..." : "Save"}
                                </button>
                            </div>
                            <button
                                onClick={() => handleSaveEdit(true)}
                                className="w-full mt-2 text-xs px-3 py-1.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                                disabled={isSaving}
                            >
                                Save & Reprocess AI
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                {node.content}
                            </p>
                            {node.type === "url" && (
                                <a href={node.url} target="_blank" rel="noreferrer" className="text-xs text-primary underline mt-1 block">
                                    Open Link ↗
                                </a>
                            )}
                        </>
                    )}
                </div>


                {/* Summary */}
                {node.summary && !isEditing && (
                    <div className={`p-3 rounded-lg ${node.status === 'error'
                        ? 'bg-red-500/5 border-2 border-dashed border-red-500/40'
                        : 'bg-primary/10 border border-primary/20'
                        }`}>
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className={`text-xs font-semibold uppercase ${node.status === 'error'
                                ? 'text-red-500'
                                : 'text-primary'
                                }`}>
                                AI Summary
                            </h3>
                            {node.status === 'error' && (
                                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-500/20 text-red-600 dark:text-red-400 rounded">
                                    FAILED
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-foreground/80 italic">
                            {node.summary}
                        </p>
                    </div>
                )}


                {/* Connections */}
                {!isEditing && (
                    <div>
                        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                            Connections
                            <span className="bg-muted text-[10px] px-1.5 py-0.5 rounded-full">{relatedEdges.length}</span>
                        </h3>

                        <div className="space-y-3">
                            {relatedEdges.length === 0 ? (
                                <p className="text-xs text-muted-foreground">No connections yet.</p>
                            ) : (
                                relatedEdges.map((edge) => {
                                    const isSource = edge.source === node.id;
                                    const otherId = isSource ? edge.target : edge.source;
                                    // Note: react-force-graph transforms source/target to objects, so handle both ID or object
                                    const otherIdString = typeof otherId === 'object' ? otherId.id : otherId;

                                    const otherNode = allNodes.find(n => n.id === otherIdString);
                                    if (!otherNode) return null;

                                    return (
                                        <div key={edge.id} className="group border border-border rounded-lg p-3 hover:border-primary/50 transition-colors">
                                            <div className="font-medium text-sm mb-1">{otherNode.title}</div>
                                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                                {edge.explanation}
                                            </p>
                                            <div className="flex justify-between items-center text-[10px] text-muted-foreground/50">
                                                <span>Similarity: {Math.round(edge.similarity * 100)}%</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
