// components/ui/select.tsx
import React from "react";
import { twMerge } from "tailwind-merge";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Optional label displayed above the select */
  label?: string;
  /** Error message – adds red border when present */
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, error, className, children, ...rest }) => {
  const baseClasses = "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600";
  const errorClasses = error ? "border-red-500 text-red-600" : "";

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <select className={twMerge(baseClasses, errorClasses, className)} {...rest}>
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};
