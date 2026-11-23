import { useState } from 'react';
import { ShieldAlert, Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToastStore } from '../components/common/ToastContainer';
import { ResultsSummary } from '../components/results/ResultsSummary';
import { exportAssignmentsToCsv, triggerPrintResults } from '../services/exportService';
import { useGiftExchangeStore } from '../store/giftExchangeStore';

export function ResultsPage() {
  const participants = useGiftExchangeStore((s) => s.participants);
  const assignments = useGiftExchangeStore((s) => s.assignments);
  const setScreen = useGiftExchangeStore((s) => s.setScreen);
  const resetDraw = useGiftExchangeStore((s) => s.resetDraw);
  const clearAllData = useGiftExchangeStore((s) => s.clearAllData);
  const pushToast = useToastStore((s) => s.pushToast);

  const [revealedToOrganizer, setRevealedToOrganizer] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const allCompleted =
    assignments.length >= 2 && assignments.every((assignment) => assignment.revealed);

  if (!allCompleted) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-xl flex-col items-center justify-center px-4 text-center">
        <div className="glass-card rounded-3xl p-8">
          <div className="mb-3 text-4xl">🎁</div>
          <h1 className="font-display text-2xl font-bold text-white">
            Drawing Not Yet Finished
          </h1>
          <p className="mt-2 text-sm text-ice-200/75">
            Complete every participant&apos;s turn in the 3D Gift Exchange Room to unlock the full
            organizer summary.
          </p>
          <button
            type="button"
            onClick={() => setScreen('exchange')}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-ice-400 to-pastel-purple px-6 py-3 text-sm font-extrabold text-navy-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to 3D Wheel Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-pastel-gold">
            <Sparkles className="h-3.5 w-3.5" />
            Organizer-Only View
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold text-white sm:text-4xl">
            Gift Exchange Results
          </h1>
        </div>

        {revealedToOrganizer && (
          <button
            type="button"
            onClick={() => setRevealedToOrganizer(false)}
            className="no-print flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-ice-200 transition hover:bg-white/15"
          >
            <EyeOff className="h-4 w-4" />
            Hide Pairings Again
          </button>
        )}
      </div>

      {!revealedToOrganizer ? (
        <div className="mx-auto max-w-xl">
          <div className="glass-card rounded-[2rem] border-pastel-gold/40 p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-pastel-gold/15 text-pastel-gold">
              <ShieldAlert className="h-9 w-9" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">Organizer Privacy Check</h2>
            <p className="mt-3 rounded-2xl border border-amber-300/35 bg-amber-400/10 px-4 py-3 text-sm font-extrabold text-amber-200">
              Warning: This will display all Manita-Manito assignments.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ice-200/75">
              Make sure other participants aren&apos;t looking at your screen before revealing the
              complete giver-to-recipient list.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setScreen('exchange')}
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-ice-200 transition hover:bg-white/10"
              >
                Back to 3D Stage
              </button>
              <button
                type="button"
                onClick={() => setRevealedToOrganizer(true)}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pastel-gold via-amber-300 to-pastel-pink px-6 py-3 text-sm font-extrabold text-navy-950 shadow-gold transition hover:brightness-105"
              >
                <Eye className="h-4 w-4" />
                Reveal All Assignments
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ResultsSummary
          participants={participants}
          assignments={assignments}
          onExportCsv={() => {
            exportAssignmentsToCsv(assignments, participants);
            pushToast('Exported results to CSV!', 'success');
          }}
          onPrint={() => triggerPrintResults()}
          onStartNewDraw={() => {
            resetDraw();
            setScreen('exchange');
            pushToast('Started a brand-new draw with fresh random pairings!', 'success');
          }}
          onRequestClearAll={() => setConfirmClearOpen(true)}
        />
      )}

      <ConfirmDialog
        open={confirmClearOpen}
        title="Clear All Session Data?"
        description="This permanently erases all participants, characters, and results from localStorage on this browser."
        confirmLabel="Clear All Data"
        tone="danger"
        onCancel={() => setConfirmClearOpen(false)}
        onConfirm={() => {
          clearAllData();
          setConfirmClearOpen(false);
          pushToast('All session data cleared.', 'info');
        }}
      />
    </div>
  );
}
