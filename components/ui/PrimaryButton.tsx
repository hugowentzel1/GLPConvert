"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "cta";
  disabled?: boolean;
}

export function PrimaryButton({
  children,
  className,
  size = "md",
  variant = "primary",
  disabled = false,
  ...props
}: PrimaryButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    cta: "btn-cta",
  };

  return (
    <button
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand)]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
