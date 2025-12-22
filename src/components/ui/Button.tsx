import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

        const variantStyles = {
            primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            secondary: 'border border-border hover:bg-muted',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            ghost: 'hover:bg-muted',
        };

        const sizeStyles = {
            sm: 'text-xs px-3 py-1.5',
            md: 'text-sm px-4 py-2',
            lg: 'text-base px-6 py-3',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
