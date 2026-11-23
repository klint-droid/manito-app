import { getCharacterVariant } from '../../assets/characters/registry';
import type { CharacterVariantId } from '../../types/character';

interface CharacterAvatarProps {
  variantId: CharacterVariantId;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ACCESSORY_ICON: Record<CharacterVariantId, string> = {
  santa: '🎅',
  reindeer: '🦌',
  snowman: '⛄',
  elf: '🧝',
  penguin: '🐧',
  gingerbread: '🍪',
  polar_bear: '🐻‍❄️',
  christmas_tree: '🎄',
  candy: '🍬',
  star: '⭐',
};

const SIZE_CLASSES = {
  sm: 'h-9 w-9 text-base',
  md: 'h-12 w-12 text-xl',
  lg: 'h-16 w-16 text-2xl',
};

export function CharacterAvatar({
  variantId,
  size = 'md',
  className = '',
}: CharacterAvatarProps) {
  const variant = getCharacterVariant(variantId);

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-2xl border border-white/25 shadow-md ${SIZE_CLASSES[size]} ${className}`}
      style={{
        background: `radial-gradient(circle at 30% 25%, ${variant.secondaryColor}44, ${variant.primaryColor} 78%)`,
      }}
      title={variant.name}
      aria-label={variant.name}
    >
      <span className="drop-shadow-sm select-none" role="img" aria-hidden="true">
        {ACCESSORY_ICON[variantId]}
      </span>
      <span
        className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-navy-900"
        style={{ backgroundColor: variant.accentColor }}
      />
    </div>
  );
}
