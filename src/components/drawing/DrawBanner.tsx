import { Sparkles, Gift, PartyPopper } from 'lucide-react';
import { CharacterAvatar } from '../common/CharacterAvatar';
import type { DrawPhase } from '../../types/assignment';
import type { Participant } from '../../types/participant';

interface DrawBannerProps {
  phase: DrawPhase;
  currentGiver: Participant | null;
  revealedRecipient: Participant | null;
  currentTurn: number;
  revealedCount: number;
  totalCount: number;
  isPaused: boolean;
}

export function DrawBanner({
  phase,
  currentGiver,
  revealedRecipient,
  currentTurn,
  revealedCount,
  totalCount,
  isPaused,
}: DrawBannerProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-2.5 z-20 flex justify-center px-3">
      <div className="glass-panel pointer-events-auto flex max-w-[94vw] items-center gap-2.5 rounded-full px-4 py-1.5 text-center shadow-xl">
        {phase === 'ready' && (
          <>
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-pastel-gold" />
            <span className="font-display text-sm font-bold text-white sm:text-base">
              {revealedCount > 0 ? 'Resume Gift Exchange?' : 'Ready for the Gift Exchange?'}
            </span>
            <span className="hidden rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-ice-200 sm:inline">
              {totalCount} in circle
            </span>
          </>
        )}

        {(phase === 'giver_focus' ||
          phase === 'giver_entering' ||
          phase === 'selecting' ||
          phase === 'recipient_approaching') &&
          currentGiver && (
            <>
              <span className="rounded-full bg-pastel-purple/25 px-2 py-0.5 text-[11px] font-extrabold text-pastel-purple">
                {currentTurn}/{totalCount}
              </span>
              <CharacterAvatar
                variantId={currentGiver.characterId}
                size="sm"
                className="!h-6 !w-6 !rounded-lg !text-xs"
              />
              <span className="font-display text-sm font-bold text-pastel-gold sm:text-base">
                {currentGiver.name}
              </span>
              <span className="text-xs font-semibold text-ice-200 sm:text-sm">
                {phase === 'giver_focus'
                  ? 'is up next...'
                  : phase === 'recipient_approaching'
                    ? 'match found!'
                    : "You're giving a gift to..."}
              </span>
              {isPaused && (
                <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-extrabold uppercase text-pastel-gold">
                  Paused
                </span>
              )}
            </>
          )}

        {phase === 'revealed' && currentGiver && revealedRecipient && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-pastel-pink/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-pastel-pink">
              <PartyPopper className="h-3 w-3" />
              Congratulations!
            </span>
            <span className="font-display text-sm font-bold text-white sm:text-base">
              <span className="text-ice-200">{currentGiver.name}</span>
              <Gift className="mx-1.5 inline h-3.5 w-3.5 text-pastel-gold" />
              Your Manito/Manita is{' '}
              <span className="text-pastel-gold">{revealedRecipient.name}!</span>
            </span>
          </div>
        )}

        {phase === 'completed' && (
          <>
            <PartyPopper className="h-4 w-4 shrink-0 text-pastel-gold" />
            <span className="font-display text-sm font-bold text-white sm:text-base">
              Group Photo Time!{' '}
              <span className="text-pastel-mint">All {totalCount} Pairings Complete!</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
}
