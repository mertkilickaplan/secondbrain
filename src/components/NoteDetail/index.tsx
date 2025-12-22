"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import DeleteConfirmModal from "./DeleteConfirmModal";
import NoteHeader from "./NoteHeader";
import NoteContent from "./NoteContent";
import NoteTags from "./NoteTags";
import NoteConnections from "./NoteConnections";

interface NoteDetailProps {
    node: any | null;
    edges: any[];
    allNodes: any[];
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

    // Tag autocomplete state
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const [filteredTags, setFilteredTags] = useState<string[]>([]);
    const [selectedTagIndex, setSelectedTagIndex] = useState(-1);

    const tags = node?.tags ? JSON.parse(node.tags) : [];

    // Fetch available tags on mount
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await fetch('/api/tags');
                if (res.ok) {
                    const data = await res.json();
                    setAvailableTags(data.tags || []);
                }
            } catch (error) {
                console.error('Failed to fetch tags:', error);
            }
        };
        fetchTags();
    }, []);

    // Filter tags based on input
    useEffect(() => {
        if (!newTag.trim()) {
            const filtered = availableTags.filter(tag => !editTags.includes(tag));
            setFilteredTags(filtered);
        } else {
            const filtered = availableTags.filter(tag =>
                tag.toLowerCase().includes(newTag.toLowerCase()) &&
                !editTags.includes(tag)
            );
            setFilteredTags(filtered);
        }
        setSelectedTagIndex(-1);
    }, [newTag, availableTags, editTags]);

    if (!node) return null;

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

    const handleSelectTag = (tag: string) => {
        if (!editTags.includes(tag)) {
            setEditTags([...editTags, tag]);
        }
        setNewTag("");
        setShowTagDropdown(false);
        setSelectedTagIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (selectedTagIndex >= 0 && filteredTags[selectedTagIndex]) {
                handleSelectTag(filteredTags[selectedTagIndex]);
            } else {
                handleAddTag();
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedTagIndex(prev =>
                prev < filteredTags.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedTagIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === "Escape") {
            setShowTagDropdown(false);
            setSelectedTagIndex(-1);
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

    const handleRetry = async () => {
        setIsRetrying(true);
        try {
            await fetch(`/api/notes/${node.id}/process`, { method: "POST" });
            if (onDataChange) onDataChange();
        } catch (e) {
            console.error("Retry failed", e);
        } finally {
            setIsRetrying(false);
        }
    };

    return (
        <aside className="w-full sm:w-80 md:w-96 h-[calc(100%-3.5rem)] border-l border-border bg-card/95 sm:bg-card/50 backdrop-blur-xl fixed sm:absolute right-0 top-14 bottom-0 shadow-2xl overflow-y-auto p-4 sm:p-6 z-30 transition-transform animate-in slide-in-from-right-10">
            <DeleteConfirmModal
                isOpen={showDeleteConfirm}
                isDeleting={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />

            <NoteHeader
                title={node.title}
                status={node.status}
                isEditing={isEditing}
                editTitle={editTitle}
                onTitleChange={setEditTitle}
                onEdit={handleStartEdit}
                onDelete={() => setShowDeleteConfirm(true)}
                onClose={onClose}
            />

            <div className="space-y-6">
                <NoteTags
                    tags={tags}
                    isEditing={isEditing}
                    editTags={editTags}
                    newTag={newTag}
                    filteredTags={filteredTags}
                    showTagDropdown={showTagDropdown}
                    selectedTagIndex={selectedTagIndex}
                    onNewTagChange={setNewTag}
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                    onSelectTag={handleSelectTag}
                    onKeyDown={handleKeyDown}
                    onTagFocus={() => setShowTagDropdown(true)}
                    onTagBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
                />

                <NoteContent
                    content={node.content}
                    summary={node.summary}
                    isEditing={isEditing}
                    editContent={editContent}
                    isSaving={isSaving}
                    status={node.status}
                    isRetrying={isRetrying}
                    onContentChange={setEditContent}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                    onRetry={handleRetry}
                />

                {!isEditing && (
                    <NoteConnections
                        nodeId={node.id}
                        edges={edges}
                        allNodes={allNodes}
                    />
                )}
            </div>
        </aside>
    );
}
