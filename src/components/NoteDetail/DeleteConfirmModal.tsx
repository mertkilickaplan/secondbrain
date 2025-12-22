import React from 'react';
import { Button, Modal } from '@/components/ui';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    isDeleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    isDeleting,
    onConfirm,
    onCancel,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onCancel}>
            <p className="text-sm mb-6">
                Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div className="flex gap-3">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onCancel}
                    disabled={isDeleting}
                    className="flex-1"
                >
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="flex-1"
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </Button>
            </div>
        </Modal>
    );
};

export default DeleteConfirmModal;
