import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  variant?: "default" | "primary" | "destructive" | "success";
  size?: "sm" | "md";
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ variant = "default", size = "md", children, className }) => {
  const baseStyles = "inline-flex items-center rounded-full font-medium";

  const variantStyles = {
    default: "bg-muted text-muted-foreground border border-border",
    primary: "bg-primary/20 text-primary",
    destructive: "bg-destructive/20 text-destructive",
    success: "bg-green-500/20 text-green-600 dark:text-green-400",
  };

  const sizeStyles = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-1",
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}>
      {children}
    </span>
  );
};

Badge.displayName = "Badge";

export default Badge;
