export interface NameValidationResult {
  valid: boolean;
  normalized: string;
  error?: string;
}

export interface BulkParseResult {
  validNames: string[];
  duplicates: string[];
  invalidCount: number;
}

export function normalizeName(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim();
}

export function validateParticipantName(
  rawName: string,
  existingNames: readonly string[],
  ignoreName?: string,
): NameValidationResult {
  const normalized = normalizeName(rawName);
  if (!normalized) {
    return { valid: false, normalized, error: 'Participant name cannot be empty.' };
  }
  if (normalized.length > 32) {
    return { valid: false, normalized, error: 'Name must be 32 characters or fewer.' };
  }

  const lower = normalized.toLowerCase();
  const ignoredLower = ignoreName ? normalizeName(ignoreName).toLowerCase() : null;
  const isDuplicate = existingNames.some((n) => {
    const candidate = normalizeName(n).toLowerCase();
    if (ignoredLower && candidate === ignoredLower) return false;
    return candidate === lower;
  });

  if (isDuplicate) {
    return {
      valid: false,
      normalized,
      error: `"${normalized}" is already on the participant list.`,
    };
  }

  return { valid: true, normalized };
}

export function parseBulkParticipantNames(
  rawText: string,
  existingNames: readonly string[],
): BulkParseResult {
  const lines = rawText.split(/\r?\n/);
  const seen = new Set(existingNames.map((n) => normalizeName(n).toLowerCase()));
  const validNames: string[] = [];
  const duplicates: string[] = [];
  let invalidCount = 0;

  for (const line of lines) {
    const cleaned = normalizeName(line);
    if (!cleaned) continue;
    if (cleaned.length > 32) {
      invalidCount += 1;
      continue;
    }
    const lower = cleaned.toLowerCase();
    if (seen.has(lower)) {
      duplicates.push(cleaned);
      continue;
    }
    seen.add(lower);
    validNames.push(cleaned);
  }

  return { validNames, duplicates, invalidCount };
}
