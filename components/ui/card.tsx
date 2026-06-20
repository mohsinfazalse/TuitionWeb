// components/ui/card.tsx
import React from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional title displayed at the top of the card */
  title?: string;
  /** Optional footer content */
  footer?: React.ReactNode;
}

/**
 * Reusable Card component with optional header and footer.
 */
export const Card: React.FC<CardProps> = ({ title, footer, className, children, ...rest }) => {
  const baseClasses = "rounded-lg bg-background text-foreground shadow-md overflow-hidden";
  const headerClasses = "border-b border-gray-200 px-4 py-2 text-lg font-semibold";
  const footerClasses = "border-t border-gray-200 px-4 py-2";

  return (
    <div className={twMerge(baseClasses, className)} {...rest}>
      {title && <div className={headerClasses}>{title}</div>}
      <div className="p-4">{children}</div>
      {footer && <div className={footerClasses}>{footer}</div>}
    </div>
  );
};
