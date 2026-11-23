import {
  Play,
  Pause,
  FastForward,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Trophy,
  Users,
  Camera,
} from 'lucide-react';
import type { DrawPhase } from '../../types/assignment';

interface OrganizerControlsProps {
  phase: DrawPhase;
  isAnimating: boolean;
  isPaused: boolean;
  isLastGiver: boolean;
  revealedCount: number;
  totalCount: number;
  onStartDraw: () => void;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  onRevealNow: () => void;
  onContinue: () => void;
  onTakeGroupPhoto: () => void;
  onFinish: () => void;
  onRequestReset: () => void;
  onBackToSetup: () => void;
}

export function OrganizerControls({
  phase,
  isAnimating,
  isPaused,
  isLastGiver,
  revealedCount,
  totalCount,
  onStartDraw,
  onPause,
  onResume,
  onSkip,
  onRevealNow,
  onContinue,
  onTakeGroupPhoto,
  onFinish,
  onRequestReset,
  onBackToSetup,
}: OrganizerControlsProps) {
  const progressPercent = totalCount > 0 ? Math.round((revealedCount / totalCount) * 100) : 0;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center px-3">
      <div className="glass-panel pointer-events-auto flex flex-wrap items-center justify-center gap-2 rounded-full px-3 py-2 shadow-2xl sm:gap-2.5 sm:px-4">
        {/* Compact Inline Progress */}
        <div className="flex items-center gap-2 px-1 text-[11px] font-extrabold text-ice-200">
          <span>
            {revealedCount}/{totalCount}
          </span>
          <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-navy-950/90 sm:block">
            <div
              className="h-full rounded-full bg-gradient-to-r from-ice-400 via-pastel-purple to-pastel-gold transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="h-5 w-px bg-white/15" />

        {/* Primary Phase Controls */}
        {phase === 'ready' && (
          <button
            type="button"
            onClick={onStartDraw}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pastel-gold via-amber-300 to-pastel-pink px-4 py-1.5 text-xs font-extrabold text-navy-950 shadow-gold transition hover:brightness-105 active:scale-95 sm:text-sm"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            {revealedCount > 0 ? 'Resume Drawing' : 'Start Drawing'}
          </button>
        )}

        {isAnimating && (
          <>
            {isPaused ? (
              <button
                type="button"
                onClick={onResume}
                className="flex items-center gap-1.5 rounded-full bg-pastel-mint px-3.5 py-1.5 text-xs font-extrabold text-navy-950 transition hover:brightness-105"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Resume
              </button>
            ) : (
              <button
                type="button"
                onClick={onPause}
                className="flex items-center gap-1.5 rounded-full border border-ice-300/30 bg-navy-800/80 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-navy-700"
              >
                <Pause className="h-3.5 w-3.5" />
                Pause
              </button>
            )}

            <button
              type="button"
              onClick={onSkip}
              className="flex items-center gap-1 rounded-full border border-pastel-purple/40 bg-pastel-purple/20 px-3 py-1.5 text-xs font-bold text-pastel-purple transition hover:bg-pastel-purple/30 hover:text-white"
            >
              <FastForward className="h-3.5 w-3.5" />
              Skip
            </button>

            <button
              type="button"
              onClick={onRevealNow}
              className="flex items-center gap-1 rounded-full bg-gradient-to-r from-pastel-pink to-pastel-gold px-3.5 py-1.5 text-xs font-extrabold text-navy-950 transition hover:brightness-105"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Reveal
            </button>
          </>
        )}

        {phase === 'revealed' && (
          <>
            {isLastGiver ? (
              <button
                type="button"
                onClick={onContinue}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pastel-gold via-amber-300 to-pastel-pink px-4 py-1.5 text-xs font-extrabold text-navy-950 shadow-gold transition hover:brightness-105 active:scale-95 sm:text-sm"
              >
                <Camera className="h-3.5 w-3.5" />
                Gather for Group Photo
              </button>
            ) : (
              <button
                type="button"
                onClick={onContinue}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-ice-400 via-pastel-purple to-pastel-pink px-4 py-1.5 text-xs font-extrabold text-navy-950 shadow-glow transition hover:brightness-105 active:scale-95 sm:text-sm"
              >
                Next Giver
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </>
        )}

        {phase === 'completed' && (
          <>
            <button
              type="button"
              onClick={onTakeGroupPhoto}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pastel-gold via-amber-300 to-pastel-pink px-4 py-1.5 text-xs font-extrabold text-navy-950 shadow-gold transition hover:brightness-105 active:scale-95 sm:text-sm"
            >
              <Camera className="h-3.5 w-3.5" />
              Take Group Photo
            </button>
            <button
              type="button"
              onClick={onFinish}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pastel-mint to-ice-400 px-3.5 py-1.5 text-xs font-extrabold text-navy-950 shadow-glow transition hover:brightness-105 sm:text-sm"
            >
              <Trophy className="h-3.5 w-3.5" />
              View Results
            </button>
          </>
        )}

        <div className="h-5 w-px bg-white/15" />

        {/* Secondary Compact Actions */}
        <button
          type="button"
          onClick={onBackToSetup}
          className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold text-ice-200/80 transition hover:bg-white/10 hover:text-white"
          title="Edit participants"
        >
          <Users className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Roster</span>
        </button>

        <button
          type="button"
          onClick={onRequestReset}
          className="flex items-center gap-1 rounded-full border border-rose-400/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-bold text-rose-200 transition hover:bg-rose-500/20"
          title="Reset Draw"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
}
