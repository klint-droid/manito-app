import type { CharacterVariantId } from './character';

export interface Participant {
  id: string;
  name: string;
  characterId: CharacterVariantId;
  createdAt: number;
}
