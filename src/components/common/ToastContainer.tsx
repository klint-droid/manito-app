import { create } from 'zustand';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastStore {
  toasts: ToastItem[];
  pushToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  pushToast: (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((state) => ({ toasts: [...state.toasts.slice(-3), { id, message, type }] }));
    window.setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3600);
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismissToast = useToastStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div
      className="no-print pointer-events-none fixed right-4 top-20 z-50 flex w-full max-w-sm flex-col gap-2.5"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl backdrop-blur-md transition ${
            toast.type === 'success'
              ? 'border-pastel-mint/40 bg-navy-900/95 text-pastel-mint'
              : toast.type === 'error'
                ? 'border-rose-400/45 bg-navy-900/95 text-rose-200'
                : 'border-ice-300/40 bg-navy-900/95 text-ice-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0" />}
          {toast.type === 'info' && <Info className="h-4 w-4 shrink-0" />}
          <span className="flex-1 text-white">{toast.message}</span>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
