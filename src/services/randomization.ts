import type { Assignment } from '../types/assignment';
import type { Participant } from '../types/participant';

/**
 * Generates a cryptographically secure random integer in [0, maxExclusive).
 * Uses rejection sampling over crypto.getRandomValues to avoid modulo bias.
 */
function secureRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 1) return 0;

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const array = new Uint32Array(1);
    const maxUint32 = 0xffffffff;
    const limit = maxUint32 - ((maxUint32 + 1) % maxExclusive);
    let value = 0;
    do {
      crypto.getRandomValues(array);
      value = array[0];
    } while (value > limit);
    return value % maxExclusive;
  }

  return Math.floor(Math.random() * maxExclusive);
}

/**
 * Fisher-Yates shuffle backed by a cryptographically secure RNG.
 */
export function secureShuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = secureRandomInt(i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Validates that a mapping is a true derangement:
 * 1. Nobody selects themselves.
 * 2. Every participant gives exactly once.
 * 3. Every participant receives exactly once.
 * 4. No duplicate recipients.
 * 5. All participants are included.
 */
export function validateDerangement(
  participantIds: readonly string[],
  assignments: readonly Assignment[],
): boolean {
  if (participantIds.length < 2) return false;
  if (assignments.length !== participantIds.length) return false;

  const idSet = new Set(participantIds);
  const givers = new Set<string>();
  const recipients = new Set<string>();

  for (const a of assignments) {
    if (!idSet.has(a.giverId) || !idSet.has(a.recipientId)) return false;
    if (a.giverId === a.recipientId) return false;
    if (givers.has(a.giverId) || recipients.has(a.recipientId)) return false;
    givers.add(a.giverId);
    recipients.add(a.recipientId);
  }

  return givers.size === participantIds.length && recipients.size === participantIds.length;
}

/**
 * Generates a complete, cryptographically secure derangement for all participants.
 * Uses secure Fisher-Yates shuffling with derangement validation and retries,
 * with a guaranteed Sattolo single-cycle derangement fallback if retries are exhausted.
 */
export function generateSecureAssignments(participants: readonly Participant[]): {
  giverOrder: string[];
  assignments: Assignment[];
} {
  if (participants.length < 2) {
    throw new Error('At least two participants are required for Manita-Manito.');
  }

  const ids = participants.map((p) => p.id);
  const giverOrder = secureShuffle(ids);

  const MAX_RETRIES = 128;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    const shuffledRecipients = secureShuffle(giverOrder);
    const isDerangement = giverOrder.every((giverId, idx) => giverId !== shuffledRecipients[idx]);

    if (isDerangement) {
      const assignments: Assignment[] = giverOrder.map((giverId, idx) => ({
        giverId,
        recipientId: shuffledRecipients[idx],
        revealed: false,
      }));
      if (validateDerangement(ids, assignments)) {
        return { giverOrder, assignments };
      }
    }
  }

  // Guaranteed valid derangement fallback via Sattolo's algorithm (random single cycle)
  const cycle = [...giverOrder];
  for (let i = cycle.length - 1; i > 0; i -= 1) {
    const j = secureRandomInt(i); // strictly < i
    const temp = cycle[i];
    cycle[i] = cycle[j];
    cycle[j] = temp;
  }

  const fallbackAssignments: Assignment[] = giverOrder.map((giverId, idx) => ({
    giverId,
    recipientId: cycle[idx],
    revealed: false,
  }));

  if (!validateDerangement(ids, fallbackAssignments)) {
    // Deterministic circular shift fallback (impossible to self-assign for n >= 2)
    const shiftedAssignments: Assignment[] = giverOrder.map((giverId, idx) => ({
      giverId,
      recipientId: giverOrder[(idx + 1) % giverOrder.length],
      revealed: false,
    }));
    return { giverOrder, assignments: shiftedAssignments };
  }

  return { giverOrder, assignments: fallbackAssignments };
}
