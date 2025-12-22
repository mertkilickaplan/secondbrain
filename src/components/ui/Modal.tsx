import React from 'react';
import { cn } from '@/lib/utils';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    className
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className={cn(
                    'bg-card p-6 rounded-xl border border-border shadow-2xl max-w-sm mx-4',
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <h3 className="text-lg font-semibold mb-4">{title}</h3>
                )}
                {children}
            </div>
        </div>
    );
};

Modal.displayName = 'Modal';

export default Modal;
