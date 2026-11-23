import { useGiftExchangeStore } from '../store/giftExchangeStore';

export function useParticipants() {
  const participants = useGiftExchangeStore((s) => s.participants);
  const addParticipant = useGiftExchangeStore((s) => s.addParticipant);
  const addParticipantsBulk = useGiftExchangeStore((s) => s.addParticipantsBulk);
  const updateParticipantName = useGiftExchangeStore((s) => s.updateParticipantName);
  const updateParticipantCharacter = useGiftExchangeStore((s) => s.updateParticipantCharacter);
  const removeParticipant = useGiftExchangeStore((s) => s.removeParticipant);
  const clearParticipants = useGiftExchangeStore((s) => s.clearParticipants);
  const randomizeAllCharacters = useGiftExchangeStore((s) => s.randomizeAllCharacters);

  return {
    participants,
    count: participants.length,
    canStartDraw: participants.length >= 2,
    addParticipant,
    addParticipantsBulk,
    updateParticipantName,
    updateParticipantCharacter,
    removeParticipant,
    clearParticipants,
    randomizeAllCharacters,
  };
}
