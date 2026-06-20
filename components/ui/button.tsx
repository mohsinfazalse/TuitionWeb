import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

/**
 * Reusable Button component with Tailwind styling.
 * - Primary: teal background with white text.
 * - Secondary: transparent with teal border and text.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...rest
}) => {
  const baseClasses =
    'rounded-md px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600';
  const variantClasses =
    variant === 'primary'
      ? 'bg-primary-600 text-white hover:bg-primary-700'
      : 'border border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
