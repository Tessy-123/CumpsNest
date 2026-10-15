import React from 'react';

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}) {
  const variantStyles = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4 my-1',
  };

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      style={style}
      aria-hidden="true"
      className={`
        animate-pulse bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container
        ${variantStyles[variant] || variantStyles.rectangular}
        ${className}
      `}
    />
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden flex flex-col shadow-sm">
      <Skeleton className="w-full aspect-[16/10]" />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
