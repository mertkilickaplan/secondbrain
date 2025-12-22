import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps {
    variant?: 'default' | 'elevated' | 'subtle';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({
    variant = 'default',
    padding = 'md',
    children,
    className
}) => {
    const baseStyles = 'bg-card border border-border rounded-xl';

    const variantStyles = {
        default: '',
        elevated: 'shadow-lg',
        subtle: 'bg-card/50 backdrop-blur-md',
    };

    const paddingStyles = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    return (
        <div className={cn(baseStyles, variantStyles[variant], paddingStyles[padding], className)}>
            {children}
        </div>
    );
};

Card.displayName = 'Card';

export default Card;
