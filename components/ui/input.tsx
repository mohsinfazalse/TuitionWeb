// components/ui/input.tsx
import React from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Optional label displayed above the input.
   */
  label?: string;
  /**
   * Show an error message below the input. When set, the input gets a red border.
   */
  error?: string;
}

/**
 * Styled input component with optional label and error message.
 */
export const Input: React.FC<InputProps> = ({ label, error, className, ...rest }) => {
  const baseClasses = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600";
  const errorClasses = error ? "border-red-500 text-red-600 placeholder-red-300 focus:ring-red-500" : "";

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <input className={twMerge(baseClasses, errorClasses, className)} {...rest} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};
