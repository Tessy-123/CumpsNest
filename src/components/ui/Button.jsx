import React from 'react';

/**
 * Reusable Accessible Button component matching the Warm Civic Modern design system.
 * Enforces minimum 48px touch targets for mobile accessibility.
 */
export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-heading font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-98 select-none';

  const sizeStyles = {
    sm: 'h-9 px-3 text-sm gap-1.5',
    md: 'h-12 min-h-[48px] px-5 text-base gap-2',
    lg: 'h-14 min-h-[56px] px-6 text-lg gap-2.5',
    icon: 'h-11 w-11 min-h-[44px] min-w-[44px] p-0 rounded-full',
  };

  const variantStyles = {
    primary:
      'bg-primary text-on-primary hover:bg-primary-container focus:ring-primary shadow-sm',
    accent:
      'bg-secondary-container hover:bg-secondary text-on-secondary focus:ring-secondary shadow-sm',
    secondary:
      'bg-surface-container text-primary hover:bg-surface-container-high focus:ring-primary',
    outline:
      'border border-primary text-primary hover:bg-surface-container-low focus:ring-primary bg-transparent',
    ghost:
      'text-on-surface hover:bg-surface-container focus:ring-primary bg-transparent',
    danger:
      'bg-error text-on-error hover:bg-error/90 focus:ring-error shadow-sm',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        <>
          {Icon && <span className="material-symbols-outlined text-[20px]">{Icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
