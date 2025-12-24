import React from "react";
import { Button } from "@/components/ui";

interface NoteContentProps {
  content: string;
  summary: string | null;
  isEditing: boolean;
  editContent: string;
  isSaving: boolean;
  status: string;
  isRetrying: boolean;
  canUseAI: boolean;
  onContentChange: (content: string) => void;
  onSave: (reprocess: boolean) => void;
  onCancel: () => void;
  onRetry: () => void;
}

const NoteContent: React.FC<NoteContentProps> = ({
  content,
  summary,
  isEditing,
  editContent,
  isSaving,
  status,
  isRetrying,
  canUseAI,
  onContentChange,
  onSave,
  onCancel,
  onRetry,
}) => {
  return (
    <div>
      {/* Status Indicators - Only show if user has AI access */}
      {canUseAI && (status === "processing" || isRetrying) && (
        <div className="mb-4 bg-muted/50 p-3 rounded-lg border border-border animate-pulse">
          <p className="text-xs text-center font-medium">
            {isRetrying ? "Retrying analysis..." : "AI is processing this note..."}
          </p>
        </div>
      )}

      {canUseAI && status === "error" && !isRetrying && (
        <div className="mb-4 bg-destructive/10 p-3 rounded-lg border border-destructive/20">
          <p className="text-xs text-destructive font-medium mb-2">AI processing failed.</p>
          <button
            onClick={onRetry}
            className="w-full text-xs bg-destructive/20 hover:bg-destructive/30 text-destructive py-1.5 rounded transition-colors"
          >
            Retry Processing
          </button>
        </div>
      )}

      <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">My Note</h3>

      {isEditing ? (
        <>
          <textarea
            value={editContent}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full text-sm bg-muted/50 border border-border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[100px]"
            placeholder="Note content..."
          />
          <div className="flex gap-2 mt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={onCancel}
              disabled={isSaving}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onSave(false)}
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSave(true)}
            disabled={isSaving}
            className="w-full mt-2 border border-primary/30 text-primary hover:bg-primary/10"
          >
            Save & Reprocess AI
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {content}
          </p>

          {canUseAI && summary && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                status === "error"
                  ? "bg-red-500/5 border-2 border-dashed border-red-500/40"
                  : "bg-primary/10 border border-primary/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <h3
                  className={`text-xs font-semibold uppercase ${
                    status === "error" ? "text-red-500" : "text-primary"
                  }`}
                >
                  AI Summary
                </h3>
                {status === "error" && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-500/20 text-red-600 dark:text-red-400 rounded">
                    FAILED
                  </span>
                )}
              </div>
              <p className="text-xs text-foreground/80 italic">{summary}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NoteContent;
