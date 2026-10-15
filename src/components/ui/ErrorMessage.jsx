import React from 'react';
import { Button } from './Button';

export function ErrorMessage({
  title = 'Something went wrong',
  message = 'We were unable to load the requested information. Please check your internet connection and try again.',
  onRetry,
  className = '',
}) {
  return (
    <div
      role="alert"
      className={`
        rounded-xl bg-error-container p-4 sm:p-5 shadow-sm relative overflow-hidden text-on-error-container
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-error flex items-center justify-center flex-shrink-0 mt-0.5 text-on-error shadow-sm">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            error
          </span>
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <h4 className="font-heading font-bold text-base text-on-error-container leading-tight">
            {title}
          </h4>
          <p className="font-sans text-sm text-on-error-container mt-1 leading-normal opacity-95">
            {message}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {onRetry && (
              <Button variant="danger" size="sm" onClick={onRetry}>
                Try Again
              </Button>
            )}

            <a
              href="https://wa.me/265991600735"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold underline hover:opacity-80 text-secondary"
            >
              <span className="material-symbols-outlined text-[14px]">chat</span>
              <span>WhatsApp Support (+265 991 600 735)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
