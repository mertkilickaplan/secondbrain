import React from "react";
import { Button, Badge } from "@/components/ui";

interface NoteHeaderProps {
  title: string;
  status: string;
  isEditing: boolean;
  editTitle: string;
  onTitleChange: (title: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const NoteHeader: React.FC<NoteHeaderProps> = ({
  title,
  status,
  isEditing,
  editTitle,
  onTitleChange,
  onEdit,
  onDelete,
  onClose,
}) => {
  return (
    <>
      <div className="flex justify-between items-start mb-6">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-xl font-bold bg-transparent border-b border-primary outline-none w-full mr-2"
            placeholder="Note title..."
          />
        ) : (
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            {title || "Untitled Note"}
          </h2>
        )}
        <button
          onClick={onClose}
          aria-label="Close note details"
          className="text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Action Buttons */}
      {!isEditing && (
        <div className="flex gap-2 mb-4">
          <Button variant="secondary" size="sm" onClick={onEdit} className="flex-1">
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete} className="flex-1">
            Delete
          </Button>
        </div>
      )}
    </>
  );
};

export default NoteHeader;
