import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-3xl' };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        <div
          className="fixed inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          className={`relative bg-white rounded-lg shadow-xl w-full ${sizes[size]} flex flex-col`}
          style={{ maxHeight: '82vh' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#E7E5E4' }}>
            <h2
              id="modal-title"
              className="font-display text-lg font-semibold"
              style={{ color: '#111827' }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded p-0.5 transition-colors hover:bg-stone-100"
              style={{ color: '#6B7280' }}
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 px-6 py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
