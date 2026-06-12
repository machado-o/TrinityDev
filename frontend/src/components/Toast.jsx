import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4500);
  }, []);

  const dismiss = (id) => setToasts(p => p.filter(t => t.id !== id));

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: '360px' }}>
        {toasts.map(t => (
          <div
            key={t.id}
            className="flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium pointer-events-auto"
            style={{ backgroundColor: t.type === 'error' ? '#DC2626' : '#111827', color: '#fff' }}
          >
            {t.type === 'error'
              ? <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
              : <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
            }
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}
