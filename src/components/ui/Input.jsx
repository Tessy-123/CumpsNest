import React, { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    id,
    type = 'text',
    error,
    hint,
    icon,
    rightAction,
    required = false,
    className = '',
    ...props
  },
  ref
) {
  const inputId = id || props.name || Math.random().toString(36).substring(2, 9);
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="font-sans text-sm font-semibold text-on-surface flex items-center gap-1"
          >
            {label}
            {required && (
              <span className="text-error font-bold" aria-hidden="true">
                *
              </span>
            )}
          </label>
          {error && (
            <span className="text-xs font-bold text-error uppercase tracking-wider">
              Required / Error
            </span>
          )}
        </div>
      )}

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={Boolean(error)}
          aria-describedby={`${error ? errorId : ''} ${hint ? hintId : ''}`.trim() || undefined}
          className={`
            w-full h-12 min-h-[48px] rounded-lg font-sans text-base text-on-surface transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            ${icon ? 'pl-11' : 'pl-3.5'}
            ${rightAction ? 'pr-12' : 'pr-3.5'}
            ${
              error
                ? 'bg-error-container/30 border border-error text-on-surface focus:ring-error'
                : 'bg-surface-container-low border border-outline-variant/60 focus:bg-surface-container-lowest'
            }
            ${className}
          `}
          {...props}
        />

        {rightAction && <div className="absolute right-2 flex items-center">{rightAction}</div>}
      </div>

      {error && (
        <p id={errorId} className="text-xs font-medium text-error flex items-center gap-1 mt-0.5" role="alert">
          <span className="material-symbols-outlined text-[16px] shrink-0">cancel</span>
          <span>{error}</span>
        </p>
      )}

      {hint && !error && (
        <p id={hintId} className="text-xs text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">tips_and_updates</span>
          <span>{hint}</span>
        </p>
      )}
    </div>
  );
});
