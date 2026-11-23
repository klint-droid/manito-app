import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'warning',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  const confirmStyle =
    tone === 'danger'
      ? 'bg-rose-500 hover:bg-rose-400 text-white'
      : tone === 'warning'
        ? 'bg-pastel-gold hover:bg-amber-300 text-navy-950'
        : 'bg-ice-400 hover:bg-ice-300 text-navy-950';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="glass-card relative w-full max-w-md rounded-3xl p-6 shadow-2xl">
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-full p-1.5 text-ice-200/70 transition hover:bg-white/10 hover:text-white"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-pastel-gold/15 text-pastel-gold">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h3 id="confirm-dialog-title" className="font-display text-xl font-bold text-white">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ice-200/80">{description}</p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-ice-200 transition hover:bg-white/10"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-5 py-2.5 text-sm font-extrabold shadow-lg transition ${confirmStyle}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
