"use client";
import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 z-0 bg-black/40 pointer-events-auto" onClick={onClose} />
      {/* Dialog */}
      <div className="relative z-10 mt-24 w-full max-w-2xl rounded-lg border bg-card text-card-foreground shadow-xl pointer-events-auto">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-medium">{title}</h3>
          <button aria-label="Close" className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="px-4 py-4">{children}</div>
        {footer && <div className="border-t px-4 py-3 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}


