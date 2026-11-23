import { lazy, Suspense, useRef, useState } from 'react';
import { Camera, Download, Loader2, RotateCcw, Trophy, Users, X } from 'lucide-react';
import { soundEngine } from '../assets/sounds/soundEffects';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToastStore } from '../components/common/ToastContainer';
import { DrawBanner } from '../components/drawing/DrawBanner';
import { OrganizerControls } from '../components/drawing/OrganizerControls';
import { useGiftDraw } from '../hooks/useGiftDraw';
import { createGroupPhotoDataUrl, downloadDataUrl } from '../services/exportService';
import { useGiftExchangeStore } from '../store/giftExchangeStore';

const LazyChristmasScene = lazy(() =>
  import('../three/scenes/ChristmasScene').then((mod) => ({ default: mod.ChristmasScene })),
);

export function GiftExchangePage() {
  const setScreen = useGiftExchangeStore((s) => s.setScreen);
  const pushToast = useToastStore((s) => s.pushToast);
  const sceneContainerRef = useRef<HTMLDivElement>(null);

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [groupPhotoUrl, setGroupPhotoUrl] = useState<string | null>(null);

  const {
    participants,
    currentGiverIndex,
    phase,
    highlightedId,
    isPaused,
    currentGiverId,
    currentGiver,
    revealedRecipient,
    activeRecipientId,
    assignedRecipientIds,
    completedGiverIds,
    revealedCount,
    totalCount,
    isAnimating,
    isLastGiver,
    startDraw,
    pauseAnimation,
    resumeAnimation,
    skipAnimation,
    revealRecipientNow,
    continueToNextGiver,
    finishDrawing,
    resetDraw,
  } = useGiftDraw();

  const handleTakeGroupPhoto = () => {
    const canvas = sceneContainerRef.current?.querySelector('canvas');
    if (!canvas) {
      pushToast('3D stage is still loading—try again in a moment.', 'error');
      return;
    }

    // Play celebratory shutter flash & chime
    soundEngine.playFanfare();
    setFlashActive(true);
    window.setTimeout(() => setFlashActive(false), 320);

    const dataUrl = createGroupPhotoDataUrl(
      canvas,
      participants.map((p) => p.name),
    );
    if (!dataUrl) {
      pushToast('Could not capture group photo on this browser.', 'error');
      return;
    }

    setGroupPhotoUrl(dataUrl);
    pushToast('Group photo snapped! Ready to download.', 'success');
  };

  const handleDownloadGroupPhoto = () => {
    if (!groupPhotoUrl) return;
    const stamp = new Date().toISOString().slice(0, 10);
    downloadDataUrl(groupPhotoUrl, `manita-manito-group-photo-${stamp}.png`);
    pushToast('Group photo downloaded!', 'success');
  };

  if (participants.length < 2) {
    return (
      <div className="flex min-h-[calc(100vh-68px)] flex-col items-center justify-center px-4 text-center">
        <div className="glass-card max-w-md rounded-3xl p-8">
          <div className="mb-3 text-4xl">🎄</div>
          <h1 className="font-display text-2xl font-bold text-white">
            Add at Least 2 Participants
          </h1>
          <p className="mt-2 text-sm text-ice-200/75">
            Head back to Participant Setup to add names and assign 3D Christmas characters before
            entering the wheel room.
          </p>
          <button
            type="button"
            onClick={() => setScreen('setup')}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pastel-gold to-pastel-pink px-6 py-3 text-sm font-extrabold text-navy-950 shadow-gold"
          >
            <Users className="h-4 w-4" />
            Go to Participant Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={sceneContainerRef}
      className="relative h-[calc(100vh-53px)] w-full overflow-hidden bg-navy-950"
    >
      {/* Full-Screen 3D WebGL Christmas Stage */}
      <Suspense
        fallback={
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-navy-950">
            <Loader2 className="h-10 w-10 animate-spin text-pastel-gold" />
            <div className="font-display text-lg font-bold text-white">
              Preparing the Magical 3D Stage...
            </div>
            <p className="text-xs text-ice-200/70">
              Warming up snow particles and fantasy characters
            </p>
          </div>
        }
      >
        <LazyChristmasScene
          participants={participants}
          phase={phase}
          currentGiverId={currentGiverId}
          highlightedId={highlightedId}
          activeRecipientId={activeRecipientId}
          assignedRecipientIds={assignedRecipientIds}
          completedGiverIds={completedGiverIds}
          isPaused={isPaused}
        />
      </Suspense>

      {/* Camera Shutter Flash Effect */}
      <div
        className={`pointer-events-none absolute inset-0 z-30 bg-white transition-opacity duration-300 ${
          flashActive ? 'opacity-85' : 'opacity-0'
        }`}
      />

      {/* Top Status & Reveal Banner */}
      <DrawBanner
        phase={phase}
        currentGiver={currentGiver}
        revealedRecipient={revealedRecipient}
        currentTurn={Math.min(currentGiverIndex + 1, totalCount)}
        revealedCount={revealedCount}
        totalCount={totalCount}
        isPaused={isPaused}
      />

      {/* Bottom Unobtrusive Organizer Control Dock */}
      <OrganizerControls
        phase={phase}
        isAnimating={isAnimating}
        isPaused={isPaused}
        isLastGiver={isLastGiver}
        revealedCount={revealedCount}
        totalCount={totalCount}
        onStartDraw={startDraw}
        onPause={() => {
          pauseAnimation();
          pushToast('Animation paused.', 'info');
        }}
        onResume={() => {
          resumeAnimation();
          pushToast('Animation resumed.', 'info');
        }}
        onSkip={() => {
          skipAnimation();
          pushToast('Skipped to predetermined recipient.', 'info');
        }}
        onRevealNow={revealRecipientNow}
        onContinue={continueToNextGiver}
        onTakeGroupPhoto={handleTakeGroupPhoto}
        onFinish={finishDrawing}
        onRequestReset={() => setConfirmResetOpen(true)}
        onBackToSetup={() => setScreen('setup')}
      />

      {/* Group Photo Keepsake Modal */}
      {groupPhotoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Group Photo Preview"
        >
          <div className="glass-card relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl p-4 shadow-2xl sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-pastel-gold" />
                <h2 className="font-display text-lg font-bold text-white sm:text-xl">
                  Manita-Manito Group Photo
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setGroupPhotoUrl(null)}
                className="rounded-full p-1.5 text-ice-200/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close photo preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/15 bg-navy-950/70">
              <img
                src={groupPhotoUrl}
                alt="Manita-Manito 3D Group Photo"
                className="max-h-[62vh] w-full object-contain"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setGroupPhotoUrl(null)}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-ice-200 transition hover:bg-white/10 sm:text-sm"
              >
                <RotateCcw className="h-4 w-4" />
                Retake Photo
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadGroupPhoto}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pastel-gold via-amber-300 to-pastel-pink px-5 py-2.5 text-xs font-extrabold text-navy-950 shadow-gold transition hover:brightness-105 sm:text-sm"
                >
                  <Download className="h-4 w-4" />
                  Download PNG
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGroupPhotoUrl(null);
                    finishDrawing();
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pastel-mint to-ice-400 px-4 py-2.5 text-xs font-extrabold text-navy-950 shadow transition hover:brightness-105 sm:text-sm"
                >
                  <Trophy className="h-4 w-4" />
                  View Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <ConfirmDialog
        open={confirmResetOpen}
        title="Reset the Entire Drawing?"
        description="This clears all revealed pairings, restores every participant to the circle, and generates a brand-new randomized giver order and assignment mapping."
        confirmLabel="Yes, Reset Draw"
        tone="warning"
        onCancel={() => setConfirmResetOpen(false)}
        onConfirm={() => {
          setGroupPhotoUrl(null);
          resetDraw();
          setConfirmResetOpen(false);
          pushToast('Drawing reset with a fresh random assignment!', 'success');
        }}
      />
    </div>
  );
}
