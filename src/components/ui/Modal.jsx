import React, { useEffect } from 'react';

export function Modal({
  isOpen,
  onClose,
  title,
  icon,
  children,
  maxWidth = 'max-w-lg',
  className = '',
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-on-surface/50 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className={`
          w-full bg-surface rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xl
          animate-in slide-in-from-bottom sm:zoom-in-95 max-h-[92vh] overflow-y-auto
          ${maxWidth}
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            {icon && <span className="material-symbols-outlined text-primary text-[24px]">{icon}</span>}
            <h3 id="modal-title" className="font-heading font-bold text-lg sm:text-xl text-on-surface">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
