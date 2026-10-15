import React from 'react';

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  pulse = false,
  className = '',
}) {
  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const variantStyles = {
    verified: 'bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669]',
    inspected: 'bg-[#E6F4F2] border border-[#CCECE8] text-[#0D5C58]',
    warning: 'bg-secondary-fixed text-on-secondary-fixed-variant border border-secondary-fixed-dim',
    error: 'bg-error-container text-on-error-container border border-error/20',
    primary: 'bg-primary text-on-primary',
    secondary: 'bg-secondary-container text-on-secondary',
    neutral: 'bg-surface-container text-on-surface-variant border border-outline-variant/40',
    lowData: 'bg-surface-container-high text-primary border border-outline-variant/30',
  };

  return (
    <span
      className={`
        inline-flex items-center font-heading font-semibold rounded-full select-none
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.neutral}
        ${className}
      `}
    >
      {pulse && (
        <span className="relative flex h-2 w-2 mr-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
        </span>
      )}
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
