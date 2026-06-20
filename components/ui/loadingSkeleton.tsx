// components/ui/loadingSkeleton.tsx
import React from "react";
import { twMerge } from "tailwind-merge";

/**
 * Simple rectangular skeleton for loading placeholders.
 */
export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={twMerge(
      "animate-pulse bg-gray-300 dark:bg-gray-700 rounded",
      className
    )}
  />
);
