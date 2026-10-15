import React from 'react';
import { Button } from './Button';

export function EmptyState({
  title = 'No listings match your filters',
  description = 'Try widening your budget, selecting a different campus area, or clearing some amenity requirements.',
  icon = 'search_off',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`
        w-full p-8 sm:p-12 bg-surface-container-low rounded-2xl border border-outline-variant/40
        flex flex-col items-center justify-center text-center gap-3 my-4
        ${className}
      `}
      role="status"
    >
      <div className="w-16 h-16 rounded-full bg-surface-container-high text-primary flex items-center justify-center mb-1">
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </div>

      <h3 className="font-heading font-bold text-xl text-on-surface tracking-tight">
        {title}
      </h3>

      <p className="font-sans text-sm text-on-surface-variant max-w-md leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <div className="mt-2">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
