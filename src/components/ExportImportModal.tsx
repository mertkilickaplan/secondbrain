"use client";

import { useState, useRef } from "react";
import { useToast } from "@/contexts/ToastContext";

interface ExportImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDataChange?: () => void;
}

export default function ExportImportModal({ isOpen, onClose, onDataChange }: ExportImportModalProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();

    if (!isOpen) return null;

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const res = await fetch("/api/export");
            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `secondbrain-export-${new Date().toISOString().split("T")[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                addToast("Export successful!", "success");
            } else {
                addToast("Export failed", "error");
            }
        } catch (e) {
            console.error("Export error", e);
            addToast("Export failed", "error");
        } finally {
            setIsExporting(false);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            const res = await fetch("/api/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                const result = await res.json();
                addToast(`Imported ${result.imported.notes} notes and ${result.imported.edges} connections`, "success");
                if (onDataChange) onDataChange();
                onClose();
            } else {
                addToast("Import failed", "error");
            }
        } catch (e) {
            console.error("Import error", e);
            addToast("Invalid file format", "error");
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Export / Import</h2>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                            ✕
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Export Section */}
                        <div className="p-4 border border-border rounded-lg">
                            <h3 className="font-medium mb-2">📤 Export Data</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Download all your notes and connections as a JSON file.
                            </p>
                            <button
                                onClick={handleExport}
                                disabled={isExporting}
                                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {isExporting ? "Exporting..." : "Download Backup"}
                            </button>
                        </div>

                        {/* Import Section */}
                        <div className="p-4 border border-border rounded-lg">
                            <h3 className="font-medium mb-2">📥 Import Data</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Import notes from a previously exported JSON file.
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="hidden"
                                id="import-file"
                            />
                            <label
                                htmlFor="import-file"
                                className={`block w-full py-2 px-4 text-center border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors cursor-pointer ${isImporting ? "opacity-50 pointer-events-none" : ""}`}
                            >
                                {isImporting ? "Importing..." : "Select File"}
                            </label>
                        </div>

                        {/* Warning */}
                        <p className="text-xs text-muted-foreground text-center">
                            ⚠️ Import will add new notes, not replace existing ones.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
