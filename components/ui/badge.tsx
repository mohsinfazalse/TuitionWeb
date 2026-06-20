// components/ui/badge.tsx
import React from "react";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color variant – defaults to primary */
  variant?: "primary" | "secondary" | "success" | "danger";
}

/**
 * Simple pill badge component.
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  className = "",
  children,
  ...rest
}) => {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  const colors: Record<string, string> = {
    primary: "bg-primary-600 text-white",
    secondary: "bg-gray-200 text-gray-800",
    success: "bg-green-600 text-white",
    danger: "bg-red-600 text-white",
  };
  return (
    <span className={twMerge(base, colors[variant], className)} {...rest}>
      {children}
    </span>
  );
};
