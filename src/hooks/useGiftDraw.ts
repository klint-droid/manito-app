import { useCallback, useEffect, useMemo, useRef } from 'react';
import { soundEngine } from '../assets/sounds/soundEffects';
import { useGiftExchangeStore } from '../store/giftExchangeStore';
import { buildSelectionSequence, type SelectionStep } from '../three/animations/selectionAnimations';

/**
 * Orchestrates the multi-step 3D Manita-Manito drawing animation sequence:
 * ready -> giver_focus -> giver_entering -> selecting -> recipient_approaching -> revealed -> next / completed.
 *
 * IMPORTANT: The recipient is ALWAYS read from the precomputed derangement in the store.
 * Visual spin animations and Skip Animation NEVER alter the selected recipient.
 */
export function useGiftDraw() {
  const participants = useGiftExchangeStore((s) => s.participants);
  const giverOrder = useGiftExchangeStore((s) => s.giverOrder);
  const currentGiverIndex = useGiftExchangeStore((s) => s.currentGiverIndex);
  const assignments = useGiftExchangeStore((s) => s.assignments);
  const phase = useGiftExchangeStore((s) => s.phase);
  const highlightedId = useGiftExchangeStore((s) => s.highlightedId);
  const isPaused = useGiftExchangeStore((s) => s.isPaused);
  const soundEnabled = useGiftExchangeStore((s) => s.soundEnabled);

  const prepareNewDraw = useGiftExchangeStore((s) => s.prepareNewDraw);
  const setPhase = useGiftExchangeStore((s) => s.setPhase);
  const setHighlightedId = useGiftExchangeStore((s) => s.setHighlightedId);
  const setPaused = useGiftExchangeStore((s) => s.setPaused);
  const markCurrentRevealed = useGiftExchangeStore((s) => s.markCurrentRevealed);
  const advanceToNextGiver = useGiftExchangeStore((s) => s.advanceToNextGiver);
  const finishDrawing = useGiftExchangeStore((s) => s.finishDrawing);
  const resetDraw = useGiftExchangeStore((s) => s.resetDraw);
  const toggleSound = useGiftExchangeStore((s) => s.toggleSound);

  const timerRef = useRef<number | null>(null);
  const selectionStepsRef = useRef<SelectionStep[]>([]);
  const selectionStepIndexRef = useRef<number>(0);

  // Keep sound engine synced
  useEffect(() => {
    soundEngine.enabled = soundEnabled;
  }, [soundEnabled]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Ensure a valid derangement exists whenever entering the exchange with >= 2 participants
  useEffect(() => {
    if (
      participants.length >= 2 &&
      (assignments.length !== participants.length || giverOrder.length !== participants.length)
    ) {
      prepareNewDraw();
    }
  }, [participants.length, assignments.length, giverOrder.length, prepareNewDraw]);

  const participantMap = useMemo(
    () => new Map(participants.map((p) => [p.id, p])),
    [participants],
  );

  const currentGiverId = useMemo(() => {
    if (phase === 'ready' || phase === 'completed') return null;
    return giverOrder[currentGiverIndex] ?? null;
  }, [phase, giverOrder, currentGiverIndex]);

  const currentAssignment = useMemo(() => {
    const giverId = giverOrder[currentGiverIndex];
    if (!giverId) return null;
    return assignments.find((a) => a.giverId === giverId) ?? null;
  }, [assignments, giverOrder, currentGiverIndex]);

  const currentGiver = currentGiverId ? participantMap.get(currentGiverId) ?? null : null;

  // Only expose recipient object during recipient_approaching or revealed phases
  const revealedRecipient = useMemo(() => {
    if (!currentAssignment) return null;
    if (phase !== 'recipient_approaching' && phase !== 'revealed') return null;
    return participantMap.get(currentAssignment.recipientId) ?? null;
  }, [currentAssignment, phase, participantMap]);

  const assignedRecipientIds = useMemo(
    () => new Set(assignments.filter((a) => a.revealed).map((a) => a.recipientId)),
    [assignments],
  );

  const completedGiverIds = useMemo(
    () => new Set(assignments.filter((a) => a.revealed).map((a) => a.giverId)),
    [assignments],
  );

  const revealedCount = useMemo(
    () => assignments.filter((a) => a.revealed).length,
    [assignments],
  );

  // Eligible recipient pool for visual spinning animation (remaining unrevealed recipients excluding current giver)
  const eligibleVisualIds = useMemo(() => {
    if (!currentGiverId || !currentAssignment) return [];
    const pool = participants
      .filter((p) => p.id !== currentGiverId && !assignedRecipientIds.has(p.id))
      .map((p) => p.id);
    if (!pool.includes(currentAssignment.recipientId)) {
      pool.push(currentAssignment.recipientId);
    }
    return pool;
  }, [participants, currentGiverId, currentAssignment, assignedRecipientIds]);

  // Step-by-step phase choreography timer with full pause/resume support
  useEffect(() => {
    clearTimer();
    if (isPaused) return;

    if (phase === 'giver_focus') {
      soundEngine.playChime();
      timerRef.current = window.setTimeout(() => {
        setPhase('giver_entering');
      }, 1500);
    } else if (phase === 'giver_entering') {
      timerRef.current = window.setTimeout(() => {
        if (currentAssignment) {
          selectionStepsRef.current = buildSelectionSequence(
            eligibleVisualIds,
            currentAssignment.recipientId,
          );
          selectionStepIndexRef.current = 0;
          setPhase('selecting');
        }
      }, 1550);
    } else if (phase === 'selecting') {
      if (selectionStepsRef.current.length === 0 && currentAssignment) {
        selectionStepsRef.current = buildSelectionSequence(
          eligibleVisualIds,
          currentAssignment.recipientId,
        );
        selectionStepIndexRef.current = 0;
      }

      const runNextStep = () => {
        const steps = selectionStepsRef.current;
        const idx = selectionStepIndexRef.current;

        if (idx >= steps.length) {
          setHighlightedId(null);
          soundEngine.playChime();
          setPhase('recipient_approaching');
          return;
        }

        const step = steps[idx];
        setHighlightedId(step.participantId);
        soundEngine.playTick(0.9 + (1 - step.progress) * 0.45);
        selectionStepIndexRef.current = idx + 1;

        timerRef.current = window.setTimeout(runNextStep, step.delayMs);
      };

      timerRef.current = window.setTimeout(runNextStep, 120);
    } else if (phase === 'recipient_approaching') {
      timerRef.current = window.setTimeout(() => {
        soundEngine.playFanfare();
        markCurrentRevealed();
      }, 1350);
    }

    return clearTimer;
  }, [
    phase,
    isPaused,
    currentAssignment,
    eligibleVisualIds,
    clearTimer,
    setPhase,
    setHighlightedId,
    markCurrentRevealed,
  ]);

  const startDraw = useCallback(() => {
    clearTimer();
    if (assignments.length !== participants.length) {
      prepareNewDraw();
    }
    selectionStepsRef.current = [];
    selectionStepIndexRef.current = 0;
    setPaused(false);
    setPhase('giver_focus');
  }, [assignments.length, participants.length, prepareNewDraw, clearTimer, setPaused, setPhase]);

  const pauseAnimation = useCallback(() => {
    clearTimer();
    setPaused(true);
  }, [clearTimer, setPaused]);

  const resumeAnimation = useCallback(() => {
    setPaused(false);
  }, [setPaused]);

  const skipAnimation = useCallback(() => {
    if (!currentAssignment) return;
    clearTimer();
    selectionStepsRef.current = [];
    selectionStepIndexRef.current = 0;
    soundEngine.playFanfare();
    markCurrentRevealed();
  }, [currentAssignment, clearTimer, markCurrentRevealed]);

  const revealRecipientNow = useCallback(() => {
    if (!currentAssignment) return;
    clearTimer();
    soundEngine.playFanfare();
    markCurrentRevealed();
  }, [currentAssignment, clearTimer, markCurrentRevealed]);

  const continueToNextGiver = useCallback(() => {
    clearTimer();
    selectionStepsRef.current = [];
    selectionStepIndexRef.current = 0;
    advanceToNextGiver();
  }, [clearTimer, advanceToNextGiver]);

  const handleResetDraw = useCallback(() => {
    clearTimer();
    selectionStepsRef.current = [];
    selectionStepIndexRef.current = 0;
    resetDraw();
  }, [clearTimer, resetDraw]);

  const isAnimating =
    phase === 'giver_focus' ||
    phase === 'giver_entering' ||
    phase === 'selecting' ||
    phase === 'recipient_approaching';

  const isLastGiver = currentGiverIndex >= giverOrder.length - 1;

  return {
    participants,
    assignments,
    giverOrder,
    currentGiverIndex,
    phase,
    highlightedId,
    isPaused,
    soundEnabled,
    currentGiverId,
    currentGiver,
    revealedRecipient,
    activeRecipientId: revealedRecipient?.id ?? null,
    assignedRecipientIds,
    completedGiverIds,
    revealedCount,
    totalCount: participants.length,
    isAnimating,
    isLastGiver,
    startDraw,
    pauseAnimation,
    resumeAnimation,
    skipAnimation,
    revealRecipientNow,
    continueToNextGiver,
    finishDrawing,
    resetDraw: handleResetDraw,
    toggleSound,
  };
}
