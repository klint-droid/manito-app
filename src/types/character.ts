export type CharacterVariantId =
  | 'santa'
  | 'reindeer'
  | 'snowman'
  | 'elf'
  | 'penguin'
  | 'gingerbread'
  | 'polar_bear'
  | 'christmas_tree'
  | 'candy'
  | 'star';

export type CharacterAnimationState =
  | 'idle'
  | 'bounce'
  | 'highlighted'
  | 'celebrate'
  | 'giver_center'
  | 'recipient_reveal'
  | 'assigned_muted';

export interface CharacterVariantConfig {
  id: CharacterVariantId;
  name: string;
  shortName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bellyColor: string;
  cheekColor: string;
  emissiveColor: string;
  /** Optional path to a custom GLB model for future asset swaps */
  modelUrl?: string;
}
