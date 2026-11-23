export interface SelectionStep {
  participantId: string;
  delayMs: number;
  progress: number;
}

/**
 * Generates a wheel-like deceleration sequence of highlighted participants
 * that ALWAYS terminates on the predetermined recipient chosen by the
 * randomization engine. The visual animation never alters the recipient.
 */
export function buildSelectionSequence(
  eligibleIds: string[],
  predeterminedRecipientId: string,
): SelectionStep[] {
  if (eligibleIds.length === 0) return [];
  if (eligibleIds.length === 1) {
    return [{ participantId: predeterminedRecipientId, delayMs: 550, progress: 1 }];
  }

  const targetIndex = Math.max(0, eligibleIds.indexOf(predeterminedRecipientId));
  const count = eligibleIds.length;

  // Choose enough laps so the spin feels exciting whether there are 2 or 20 people
  const minSteps = Math.max(20, count * 2);
  const maxSteps = Math.max(32, count * 3 + 6);
  const rawSteps = Math.min(maxSteps, Math.max(minSteps, 26));

  // Start at a random offset, then adjust totalSteps so final index lands EXACTLY on targetIndex
  const startIndex = Math.floor(Math.random() * count);
  const remainder = ((targetIndex - startIndex) % count + count) % count;
  const fullLaps = Math.max(2, Math.floor(rawSteps / count));
  const totalSteps = fullLaps * count + remainder;

  const steps: SelectionStep[] = [];
  for (let i = 0; i <= totalSteps; i += 1) {
    const idx = (startIndex + i) % count;
    const progress = totalSteps === 0 ? 1 : i / totalSteps;
    // Cubic ease-out timing: fast 75ms ticks at start, slowing dramatically to ~480ms at the end
    const eased = Math.pow(progress, 3.1);
    const delayMs = Math.round(75 + eased * 410);
    steps.push({
      participantId: eligibleIds[idx],
      delayMs,
      progress,
    });
  }

  // Defensive guarantee that final step is always the exact predetermined recipient
  if (steps.length > 0) {
    steps[steps.length - 1].participantId = predeterminedRecipientId;
  }

  return steps;
}
