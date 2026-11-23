import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getRandomCharacterVariantId } from '../assets/characters/registry';
import { soundEngine } from '../assets/sounds/soundEffects';
import { generateSecureAssignments } from '../services/randomization';
import { parseBulkParticipantNames, validateParticipantName } from '../utils/validation';
import type { AppScreen, Assignment, DrawPhase } from '../types/assignment';
import type { CharacterVariantId } from '../types/character';
import type { Participant } from '../types/participant';

export const STORAGE_KEY = 'manita-manito-3d-session-v2';

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface GiftExchangeState {
  screen: AppScreen;
  participants: Participant[];
  giverOrder: string[];
  currentGiverIndex: number;
  assignments: Assignment[];
  phase: DrawPhase;
  highlightedId: string | null;
  isPaused: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;

  setScreen: (screen: AppScreen) => void;
  addParticipant: (
    name: string,
    characterId?: CharacterVariantId,
  ) => { ok: boolean; error?: string };
  addParticipantsBulk: (rawText: string) => {
    addedCount: number;
    duplicates: string[];
    invalidCount: number;
  };
  updateParticipantName: (id: string, nextName: string) => { ok: boolean; error?: string };
  updateParticipantCharacter: (id: string, characterId: CharacterVariantId) => void;
  removeParticipant: (id: string) => void;
  clearParticipants: () => void;
  randomizeAllCharacters: () => void;

  prepareNewDraw: () => boolean;
  setPhase: (phase: DrawPhase) => void;
  setHighlightedId: (id: string | null) => void;
  setPaused: (paused: boolean) => void;
  markCurrentRevealed: () => void;
  advanceToNextGiver: () => void;
  finishDrawing: () => void;
  resetDraw: () => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  clearAllData: () => void;
}

export const useGiftExchangeStore = create<GiftExchangeState>()(
  persist(
    (set, get) => ({
      screen: 'landing',
      participants: [],
      giverOrder: [],
      currentGiverIndex: 0,
      assignments: [],
      phase: 'ready',
      highlightedId: null,
      isPaused: false,
      soundEnabled: true,
      musicEnabled: true,

      setScreen: (screen) => set({ screen }),

      addParticipant: (rawName, preferredCharacterId) => {
        const { participants } = get();
        const check = validateParticipantName(
          rawName,
          participants.map((p) => p.name),
        );
        if (!check.valid) {
          return { ok: false, error: check.error };
        }
        const usedCharacters = participants.map((p) => p.characterId);
        const characterId = preferredCharacterId ?? getRandomCharacterVariantId(usedCharacters);
        const next: Participant = {
          id: createId(),
          name: check.normalized,
          characterId,
          createdAt: Date.now(),
        };
        set({
          participants: [...participants, next],
          // Invalidate any stale unstarted/old draw when roster changes
          giverOrder: [],
          assignments: [],
          currentGiverIndex: 0,
          phase: 'ready',
          highlightedId: null,
        });
        return { ok: true };
      },

      addParticipantsBulk: (rawText) => {
        const { participants } = get();
        const parsed = parseBulkParticipantNames(
          rawText,
          participants.map((p) => p.name),
        );
        if (parsed.validNames.length === 0) {
          return {
            addedCount: 0,
            duplicates: parsed.duplicates,
            invalidCount: parsed.invalidCount,
          };
        }

        const used = [...participants.map((p) => p.characterId)];
        const now = Date.now();
        const additions: Participant[] = parsed.validNames.map((name, idx) => {
          const characterId = getRandomCharacterVariantId(used);
          used.push(characterId);
          return {
            id: createId(),
            name,
            characterId,
            createdAt: now + idx,
          };
        });

        set({
          participants: [...participants, ...additions],
          giverOrder: [],
          assignments: [],
          currentGiverIndex: 0,
          phase: 'ready',
          highlightedId: null,
        });

        return {
          addedCount: additions.length,
          duplicates: parsed.duplicates,
          invalidCount: parsed.invalidCount,
        };
      },

      updateParticipantName: (id, rawName) => {
        const { participants } = get();
        const target = participants.find((p) => p.id === id);
        if (!target) return { ok: false, error: 'Participant not found.' };

        const check = validateParticipantName(
          rawName,
          participants.map((p) => p.name),
          target.name,
        );
        if (!check.valid) return { ok: false, error: check.error };

        set({
          participants: participants.map((p) =>
            p.id === id ? { ...p, name: check.normalized } : p,
          ),
        });
        return { ok: true };
      },

      updateParticipantCharacter: (id, characterId) => {
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === id ? { ...p, characterId } : p,
          ),
        }));
      },

      removeParticipant: (id) => {
        set((state) => ({
          participants: state.participants.filter((p) => p.id !== id),
          giverOrder: [],
          assignments: [],
          currentGiverIndex: 0,
          phase: 'ready',
          highlightedId: null,
        }));
      },

      clearParticipants: () => {
        set({
          participants: [],
          giverOrder: [],
          assignments: [],
          currentGiverIndex: 0,
          phase: 'ready',
          highlightedId: null,
        });
      },

      randomizeAllCharacters: () => {
        set((state) => {
          const used: CharacterVariantId[] = [];
          const next = state.participants.map((p) => {
            const characterId = getRandomCharacterVariantId(used);
            used.push(characterId);
            return { ...p, characterId };
          });
          return { participants: next };
        });
      },

      prepareNewDraw: () => {
        const { participants } = get();
        if (participants.length < 2) return false;
        const { giverOrder, assignments } = generateSecureAssignments(participants);
        set({
          giverOrder,
          assignments,
          currentGiverIndex: 0,
          phase: 'ready',
          highlightedId: null,
          isPaused: false,
        });
        return true;
      },

      setPhase: (phase) => set({ phase }),

      setHighlightedId: (highlightedId) => set({ highlightedId }),

      setPaused: (isPaused) => set({ isPaused }),

      markCurrentRevealed: () => {
        const { giverOrder, currentGiverIndex, assignments } = get();
        const currentGiverId = giverOrder[currentGiverIndex];
        if (!currentGiverId) return;

        set({
          assignments: assignments.map((a) =>
            a.giverId === currentGiverId
              ? { ...a, revealed: true, revealedAt: Date.now() }
              : a,
          ),
          phase: 'revealed',
          highlightedId: null,
          isPaused: false,
        });
      },

      advanceToNextGiver: () => {
        const { currentGiverIndex, giverOrder } = get();
        const nextIndex = currentGiverIndex + 1;
        if (nextIndex >= giverOrder.length) {
          set({
            phase: 'completed',
            highlightedId: null,
            isPaused: false,
          });
        } else {
          set({
            currentGiverIndex: nextIndex,
            phase: 'giver_focus',
            highlightedId: null,
            isPaused: false,
          });
        }
      },

      finishDrawing: () => {
        set({
          phase: 'completed',
          highlightedId: null,
          isPaused: false,
          screen: 'results',
        });
      },

      resetDraw: () => {
        const { participants } = get();
        if (participants.length < 2) {
          set({
            giverOrder: [],
            assignments: [],
            currentGiverIndex: 0,
            phase: 'ready',
            highlightedId: null,
            isPaused: false,
          });
          return;
        }
        const { giverOrder, assignments } = generateSecureAssignments(participants);
        set({
          giverOrder,
          assignments,
          currentGiverIndex: 0,
          phase: 'ready',
          highlightedId: null,
          isPaused: false,
        });
      },

      toggleSound: () => {
        set((state) => {
          const next = !state.soundEnabled;
          soundEngine.enabled = next;
          return { soundEnabled: next };
        });
      },

      toggleMusic: () => {
        set((state) => {
          const next = !state.musicEnabled;
          soundEngine.setMusicEnabled(next);
          return { musicEnabled: next };
        });
      },

      clearAllData: () => {
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.removeItem(STORAGE_KEY);
          } catch {
            // Ignore
          }
        }
        set({
          screen: 'landing',
          participants: [],
          giverOrder: [],
          currentGiverIndex: 0,
          assignments: [],
          phase: 'ready',
          highlightedId: null,
          isPaused: false,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        participants: state.participants,
        giverOrder: state.giverOrder,
        currentGiverIndex: state.currentGiverIndex,
        assignments: state.assignments,
        // Persist cleanly at safe pause/resume boundaries so refresh resumes cleanly
        phase:
          state.phase === 'completed' || state.phase === 'revealed' || state.phase === 'ready'
            ? state.phase
            : 'ready',
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
      }),
    },
  ),
);
