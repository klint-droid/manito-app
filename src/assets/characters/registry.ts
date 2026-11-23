import type { CharacterVariantConfig, CharacterVariantId } from '../../types/character';

export const CHARACTER_VARIANTS: Record<CharacterVariantId, CharacterVariantConfig> = {
  santa: {
    id: 'santa',
    name: 'Santa Bean',
    shortName: 'Santa',
    tagline: 'Jolly gift-bringer with a fluffy pom-pom hat',
    primaryColor: '#e63956',
    secondaryColor: '#ffffff',
    accentColor: '#ffd56b',
    bellyColor: '#fff5f7',
    cheekColor: '#ff9ec7',
    emissiveColor: '#ff5c77',
  },
  reindeer: {
    id: 'reindeer',
    name: 'Reindeer Bean',
    shortName: 'Reindeer',
    tagline: 'Bouncy sleigh sprinter with a glowing ruby nose',
    primaryColor: '#b57249',
    secondaryColor: '#f3d5b5',
    accentColor: '#ff4d6d',
    bellyColor: '#f5dfc8',
    cheekColor: '#ff9ec7',
    emissiveColor: '#ff7b54',
  },
  snowman: {
    id: 'snowman',
    name: 'Snowman Bean',
    shortName: 'Snowman',
    tagline: 'Frosty marshmallow buddy with a cozy knit scarf',
    primaryColor: '#edf6ff',
    secondaryColor: '#72d2ff',
    accentColor: '#ff8a3d',
    bellyColor: '#ffffff',
    cheekColor: '#ffb3d1',
    emissiveColor: '#a8e4ff',
  },
  elf: {
    id: 'elf',
    name: 'Elf Bean',
    shortName: 'Elf',
    tagline: 'Mischievous toy-maker with jingle bells',
    primaryColor: '#43c59e',
    secondaryColor: '#ffd56b',
    accentColor: '#ff6b8b',
    bellyColor: '#c9fae8',
    cheekColor: '#ff9ec7',
    emissiveColor: '#88f2cb',
  },
  penguin: {
    id: 'penguin',
    name: 'Penguin Bean',
    shortName: 'Penguin',
    tagline: 'Waddling snow-slider with rosy earmuffs',
    primaryColor: '#2d3e7a',
    secondaryColor: '#f7fbff',
    accentColor: '#ff9f43',
    bellyColor: '#ffffff',
    cheekColor: '#ff9ec7',
    emissiveColor: '#72d2ff',
  },
  gingerbread: {
    id: 'gingerbread',
    name: 'Gingerbread Bean',
    shortName: 'Gingerbread',
    tagline: 'Warm frosted cookie with gumdrop buttons',
    primaryColor: '#c97b3b',
    secondaryColor: '#fff8f0',
    accentColor: '#88f2cb',
    bellyColor: '#d99252',
    cheekColor: '#ff8fa3',
    emissiveColor: '#ffd56b',
  },
  polar_bear: {
    id: 'polar_bear',
    name: 'Polar Bear Bean',
    shortName: 'Polar Bear',
    tagline: 'Cuddly arctic explorer with a lavender scarf',
    primaryColor: '#e2efff',
    secondaryColor: '#b993ff',
    accentColor: '#72d2ff',
    bellyColor: '#ffffff',
    cheekColor: '#ffaad4',
    emissiveColor: '#b993ff',
  },
  christmas_tree: {
    id: 'christmas_tree',
    name: 'Evergreen Bean',
    shortName: 'Tree',
    tagline: 'Sparkling pine sprite topped with a golden star',
    primaryColor: '#2ea86f',
    secondaryColor: '#ffd56b',
    accentColor: '#ff6b9d',
    bellyColor: '#69d69d',
    cheekColor: '#ff9ec7',
    emissiveColor: '#88f2cb',
  },
  candy: {
    id: 'candy',
    name: 'Peppermint Bean',
    shortName: 'Candy',
    tagline: 'Sweet swirl dreamer wrapped in pastel ribbon',
    primaryColor: '#ff7eb6',
    secondaryColor: '#ffffff',
    accentColor: '#88f2cb',
    bellyColor: '#ffe3f1',
    cheekColor: '#ff5c9c',
    emissiveColor: '#ff9ec7',
  },
  star: {
    id: 'star',
    name: 'Starlight Bean',
    shortName: 'Star',
    tagline: 'Shimmering wish-keeper from the winter sky',
    primaryColor: '#ffd56b',
    secondaryColor: '#fff4c2',
    accentColor: '#b993ff',
    bellyColor: '#fff8dc',
    cheekColor: '#ff9ec7',
    emissiveColor: '#ffe082',
  },
};

export const CHARACTER_VARIANT_LIST: CharacterVariantConfig[] =
  Object.values(CHARACTER_VARIANTS);

export const CHARACTER_VARIANT_IDS: CharacterVariantId[] = CHARACTER_VARIANT_LIST.map(
  (item) => item.id,
);

export function getCharacterVariant(id: CharacterVariantId): CharacterVariantConfig {
  return CHARACTER_VARIANTS[id] ?? CHARACTER_VARIANTS.santa;
}

export function getRandomCharacterVariantId(exclude?: CharacterVariantId[]): CharacterVariantId {
  const pool = exclude?.length
    ? CHARACTER_VARIANT_IDS.filter((id) => !exclude.includes(id))
    : CHARACTER_VARIANT_IDS;
  const source = pool.length > 0 ? pool : CHARACTER_VARIANT_IDS;
  return source[Math.floor(Math.random() * source.length)];
}
