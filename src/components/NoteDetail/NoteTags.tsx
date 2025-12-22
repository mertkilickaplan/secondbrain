import React from 'react';
import { Badge, Button } from '@/components/ui';

interface NoteTagsProps {
    tags: string[];
    isEditing: boolean;
    editTags: string[];
    newTag: string;
    filteredTags: string[];
    showTagDropdown: boolean;
    selectedTagIndex: number;
    onNewTagChange: (tag: string) => void;
    onAddTag: () => void;
    onRemoveTag: (tag: string) => void;
    onSelectTag: (tag: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onTagFocus: () => void;
    onTagBlur: () => void;
}

const NoteTags: React.FC<NoteTagsProps> = ({
    tags,
    isEditing,
    editTags,
    newTag,
    filteredTags,
    showTagDropdown,
    selectedTagIndex,
    onNewTagChange,
    onAddTag,
    onRemoveTag,
    onSelectTag,
    onKeyDown,
    onTagFocus,
    onTagBlur,
}) => {
    return (
        <div>
            <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Tags</h3>

            {isEditing ? (
                <div className="space-y-2 mb-4">
                    <div className="flex flex-wrap gap-2">
                        {editTags.map(tag => (
                            <Badge key={tag} variant="primary" className="flex items-center gap-1">
                                {tag}
                                <button
                                    onClick={() => onRemoveTag(tag)}
                                    className="hover:text-foreground"
                                >
                                    ×
                                </button>
                            </Badge>
                        ))}
                    </div>

                    <div className="relative">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => onNewTagChange(e.target.value)}
                                onKeyDown={onKeyDown}
                                onFocus={onTagFocus}
                                onBlur={onTagBlur}
                                className="flex-1 text-sm bg-muted/50 border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Add tag..."
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onAddTag}
                                className="bg-muted hover:bg-muted/80"
                            >
                                Add
                            </Button>
                        </div>

                        {/* Tag Dropdown */}
                        {showTagDropdown && filteredTags.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {filteredTags.map((tag, index) => (
                                    <button
                                        key={tag}
                                        onClick={() => onSelectTag(tag)}
                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${index === selectedTagIndex ? 'bg-muted' : ''
                                            }`}
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag: string) => (
                            <Badge key={tag} variant="default">
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default NoteTags;
