export type HouseId = "valeron" | "draven" | "aeloria" | "kaelthorn" | "veyr";

export interface House {
  id: HouseId;
  name: string;
  title: string;
  ruler: string;
  seat: string;
  words: string;
  history: string;
  specialty: string;
  bonus: string;
  hue: string;
  accent: string;
  stats: { strength: number; wealth: number; influence: number; military: number };
  start: { gold: number; army: number; food: number; reputation: number; influence: number };
  startDragons: string[];
  startLocation: string;
}

export const HOUSES: House[] = [
  {
    id: "valeron",
    name: "House Valeron",
    title: "The Crown of Fire",
    ruler: "Queen Maerys Valeron",
    seat: "Emberhold, the Capital",
    words: "From Ash, A Crown",
    history:
      "Once mere flame-tenders of the old volcanic isles, the Valerons bound the first wyrm three centuries ago and rode it to the marble steps of the Capital. They rule by right of fire, and their enemies remember the smell of it.",
    specialty: "Dragonlore & Royal Authority",
    bonus: "Dragon bond grows faster; dragons deal +15% damage.",
    hue: "oklch(0.55 0.2 30)",
    accent: "oklch(0.78 0.15 60)",
    stats: { strength: 78, wealth: 84, influence: 92, military: 74 },
    start: { gold: 900, army: 420, food: 300, reputation: 25, influence: 40 },
    startDragons: ["vharos", "emberwing"],
    startLocation: "capital",
  },
  {
    id: "draven",
    name: "House Draven",
    title: "The Iron Wolves",
    ruler: "Lord Corvin Draven",
    seat: "The Northern Fortress",
    words: "Winter Sharpens Iron",
    history:
      "Bred in the frostbitten north where the soil gives nothing but stone, the Dravens learned early that steel feeds better than grain. Their levies march barefoot through snow and have never once broken a shield wall.",
    specialty: "Warfare & Siegecraft",
    bonus: "Start with the largest army; +20% army from victories.",
    hue: "oklch(0.5 0.06 250)",
    accent: "oklch(0.7 0.05 240)",
    stats: { strength: 95, wealth: 55, influence: 60, military: 96 },
    start: { gold: 500, army: 780, food: 260, reputation: 18, influence: 22 },
    startDragons: ["dreadmaw", "ashfang"],
    startLocation: "north_fortress",
  },
  {
    id: "aeloria",
    name: "House Aeloria",
    title: "The Moon Court",
    ruler: "Lady Sylvane Aeloria",
    seat: "Moonlit Harbor",
    words: "We Wane, We Return",
    history:
      "Scholars, star-readers and silver merchants. The Moon Court has never won a war outright and has never lost a negotiation. Their libraries hold treaties older than three of the Great Houses.",
    specialty: "Diplomacy & Arcane Study",
    bonus: "+30% influence from quests; character loyalty rises faster.",
    hue: "oklch(0.62 0.1 270)",
    accent: "oklch(0.85 0.06 280)",
    stats: { strength: 58, wealth: 80, influence: 95, military: 60 },
    start: { gold: 820, army: 360, food: 340, reputation: 32, influence: 55 },
    startDragons: ["nyxara", "solaryn"],
    startLocation: "moonlit_harbor",
  },
  {
    id: "kaelthorn",
    name: "House Kaelthorn",
    title: "The Storm Lords",
    ruler: "Warden Aldric Kaelthorn",
    seat: "Storm Coast Bastion",
    words: "Let The Sky Answer",
    history:
      "Sea-raiders turned wardens of the eastern shore. Kaelthorn galleys ride out into hurricanes for sport, and their storm-priests claim the thunder itself signed a pact with the first Warden.",
    specialty: "Naval Power & Storm Magic",
    bonus: "+25% gold from coastal holdings; special abilities cost less fury.",
    hue: "oklch(0.6 0.1 200)",
    accent: "oklch(0.82 0.09 190)",
    stats: { strength: 82, wealth: 72, influence: 66, military: 85 },
    start: { gold: 700, army: 560, food: 280, reputation: 20, influence: 30 },
    startDragons: ["stormscale", "vaelith"],
    startLocation: "storm_coast",
  },
  {
    id: "veyr",
    name: "House Veyr",
    title: "The Shadow Keep",
    ruler: "Archon Nyssa Veyr",
    seat: "The Shadow Marsh",
    words: "Nothing Is Unseen",
    history:
      "No one has ever counted the Veyr host, because no one has ever seen it assembled. They deal in whispers, poisons and debts, and every other House keeps a Veyr guest they cannot afford to send home.",
    specialty: "Espionage & Subterfuge",
    bonus: "Enemies take extra damage from first strikes; +40% gold from theft.",
    hue: "oklch(0.45 0.11 320)",
    accent: "oklch(0.72 0.11 330)",
    stats: { strength: 66, wealth: 90, influence: 78, military: 68 },
    start: { gold: 1100, army: 400, food: 240, reputation: 12, influence: 45 },
    startDragons: ["morvane", "vaelith"],
    startLocation: "shadow_marsh",
  },
];

export const houseById = (id: HouseId) => HOUSES.find((h) => h.id === id)!;

export type Rarity = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

export interface Dragon {
  id: string;
  name: string;
  age: string;
  size: string;
  element: string;
  health: number;
  attack: number;
  defense: number;
  speed: number;
  fury: number;
  rarity: Rarity;
  lore: string;
  ability: string;
  body: string;
  wing: string;
  eye: string;
  unlock?: string;
}

export const DRAGONS: Dragon[] = [
  {
    id: "vharos",
    name: "Vharos",
    age: "84 years",
    size: "Colossal",
    element: "Emberfire",
    health: 240,
    attack: 46,
    defense: 30,
    speed: 22,
    fury: 34,
    rarity: "Legendary",
    lore: "The old crown-wyrm. He remembers three queens and outlived all of them. His breath melts the stone it touches into glass.",
    ability: "Crown Inferno",
    body: "oklch(0.42 0.16 30)",
    wing: "oklch(0.62 0.19 45)",
    eye: "oklch(0.86 0.16 90)",
  },
  {
    id: "emberwing",
    name: "Emberwing",
    age: "22 years",
    size: "Medium",
    element: "Cinder",
    health: 170,
    attack: 34,
    defense: 22,
    speed: 38,
    fury: 28,
    rarity: "Rare",
    lore: "Hatched in a bakery hearth during the Long Siege. Small, quick, and pathologically loyal to whoever feeds her first.",
    ability: "Cinder Flurry",
    body: "oklch(0.5 0.15 55)",
    wing: "oklch(0.72 0.16 70)",
    eye: "oklch(0.9 0.13 95)",
  },
  {
    id: "dreadmaw",
    name: "Dreadmaw",
    age: "111 years",
    size: "Colossal",
    element: "Blackfrost",
    health: 280,
    attack: 44,
    defense: 40,
    speed: 14,
    fury: 30,
    rarity: "Legendary",
    lore: "The northern terror. He does not fly so much as fall upon armies. Draven children are taught his name as a warning, not a boast.",
    ability: "Glacial Rend",
    body: "oklch(0.32 0.05 250)",
    wing: "oklch(0.52 0.07 240)",
    eye: "oklch(0.85 0.11 200)",
  },
  {
    id: "ashfang",
    name: "Ashfang",
    age: "40 years",
    size: "Large",
    element: "Ash",
    health: 200,
    attack: 38,
    defense: 30,
    speed: 26,
    fury: 32,
    rarity: "Epic",
    lore: "Scarred grey hunter of the burnt hills. His scales are choked with old soot that never washes away.",
    ability: "Choking Pall",
    body: "oklch(0.38 0.02 60)",
    wing: "oklch(0.55 0.03 65)",
    eye: "oklch(0.75 0.16 40)",
  },
  {
    id: "nyxara",
    name: "Nyxara",
    age: "37 years",
    size: "Large",
    element: "Moonshadow",
    health: 190,
    attack: 40,
    defense: 24,
    speed: 40,
    fury: 38,
    rarity: "Epic",
    lore: "She hunts only under a waning moon and refuses meat offered in daylight. The Moon Court calls her an omen; she calls no one anything.",
    ability: "Eclipse Veil",
    body: "oklch(0.34 0.09 285)",
    wing: "oklch(0.6 0.11 290)",
    eye: "oklch(0.9 0.09 300)",
  },
  {
    id: "solaryn",
    name: "Solaryn",
    age: "29 years",
    size: "Medium",
    element: "Dawnlight",
    health: 180,
    attack: 33,
    defense: 34,
    speed: 32,
    fury: 26,
    rarity: "Rare",
    lore: "Golden and unnervingly gentle. Wounded soldiers are carried to her because her light closes what steel opened.",
    ability: "Dawn Ward",
    body: "oklch(0.68 0.13 90)",
    wing: "oklch(0.86 0.13 95)",
    eye: "oklch(0.95 0.06 100)",
  },
  {
    id: "stormscale",
    name: "Stormscale",
    age: "56 years",
    size: "Large",
    element: "Tempest",
    health: 210,
    attack: 42,
    defense: 28,
    speed: 36,
    fury: 36,
    rarity: "Epic",
    lore: "Born mid-hurricane off the eastern shelf. Lightning still crawls between his horns when he is angry, which is often.",
    ability: "Thunder Cleave",
    body: "oklch(0.4 0.08 210)",
    wing: "oklch(0.66 0.11 200)",
    eye: "oklch(0.92 0.14 190)",
  },
  {
    id: "vaelith",
    name: "Vaelith",
    age: "19 years",
    size: "Small",
    element: "Mist",
    health: 150,
    attack: 30,
    defense: 20,
    speed: 46,
    fury: 40,
    rarity: "Rare",
    lore: "Barely larger than a warhorse and impossible to corner. Scouts swear she can be in two ravines at once.",
    ability: "Fogstep",
    body: "oklch(0.55 0.04 200)",
    wing: "oklch(0.78 0.04 210)",
    eye: "oklch(0.9 0.08 180)",
  },
  {
    id: "morvane",
    name: "Morvane",
    age: "73 years",
    size: "Large",
    element: "Venomshade",
    health: 195,
    attack: 43,
    defense: 26,
    speed: 30,
    fury: 42,
    rarity: "Epic",
    lore: "The marsh-wyrm. Her breath is not fire at all, and the Veyr have never been eager to explain what it is.",
    ability: "Blightbreath",
    body: "oklch(0.36 0.1 330)",
    wing: "oklch(0.55 0.12 320)",
    eye: "oklch(0.86 0.16 140)",
  },
  {
    id: "ignivar",
    name: "Ignivar",
    age: "Unknown",
    size: "Titanic",
    element: "Worldflame",
    health: 340,
    attack: 58,
    defense: 44,
    speed: 28,
    fury: 50,
    rarity: "Mythic",
    lore: "Sleeping beneath the Ancient Ruins since before the Seven Kingdoms had names. The old texts do not describe him as a beast, but as a season.",
    ability: "Worldflame",
    body: "oklch(0.3 0.14 20)",
    wing: "oklch(0.66 0.22 35)",
    eye: "oklch(0.95 0.18 85)",
  },
];

export const dragonById = (id: string) => DRAGONS.find((d) => d.id === id)!;

export interface GameLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  description: string;
  owner: HouseId | "neutral" | "wild";
  danger: number;
  resources: string[];
  income: number;
  armyGain: number;
  unlockLevel: number;
}

export const LOCATIONS: GameLocation[] = [
  {
    id: "capital",
    name: "Emberhold Capital",
    x: 50,
    y: 52,
    description:
      "Seven bridges of red marble span the Ember river, and above them the Obsidian Throne waits for whoever survives the climb.",
    owner: "valeron",
    danger: 2,
    resources: ["Gold", "Grain", "Steel"],
    income: 120,
    armyGain: 40,
    unlockLevel: 1,
  },
  {
    id: "north_fortress",
    name: "Northern Fortress",
    x: 40,
    y: 14,
    description:
      "A black wall of piled stone that has never been taken by storm. The wind here strips paint from shields.",
    owner: "draven",
    danger: 4,
    resources: ["Iron", "Furs", "Soldiers"],
    income: 70,
    armyGain: 90,
    unlockLevel: 1,
  },
  {
    id: "dragon_valley",
    name: "Dragon Valley",
    x: 72,
    y: 34,
    description:
      "A bowl of volcanic glass where wyrms nest in the thermal vents. Every rider in history came here first.",
    owner: "neutral",
    danger: 6,
    resources: ["Dragonstone", "Sulfur", "Eggs"],
    income: 60,
    armyGain: 20,
    unlockLevel: 1,
  },
  {
    id: "whispering_woods",
    name: "Whispering Woods",
    x: 24,
    y: 40,
    description:
      "Old growth so dense that noon looks like dusk. Travellers report being spoken to politely by nothing at all.",
    owner: "neutral",
    danger: 3,
    resources: ["Timber", "Herbs", "Game"],
    income: 45,
    armyGain: 25,
    unlockLevel: 1,
  },
  {
    id: "storm_coast",
    name: "Storm Coast",
    x: 84,
    y: 62,
    description:
      "Cliffs hammered raw by the eastern sea. Kaelthorn galleys hang in the harbour like patient knives.",
    owner: "kaelthorn",
    danger: 5,
    resources: ["Salt", "Ships", "Amber"],
    income: 95,
    armyGain: 50,
    unlockLevel: 2,
  },
  {
    id: "iron_pass",
    name: "Iron Pass",
    x: 55,
    y: 26,
    description:
      "The only road between north and south wide enough for wagons. Whoever holds it holds the war's throat.",
    owner: "neutral",
    danger: 6,
    resources: ["Iron", "Tolls", "Stone"],
    income: 85,
    armyGain: 45,
    unlockLevel: 3,
  },
  {
    id: "moonlit_harbor",
    name: "Moonlit Harbor",
    x: 18,
    y: 70,
    description:
      "Silver-tiled quays and observatories. The Moon Court counts stars and coin with the same instruments.",
    owner: "aeloria",
    danger: 2,
    resources: ["Silver", "Books", "Spice"],
    income: 110,
    armyGain: 30,
    unlockLevel: 2,
  },
  {
    id: "ashen_mountains",
    name: "Ashen Mountains",
    x: 66,
    y: 12,
    description:
      "Dead volcanoes and grey drifts. Something large moves up there, and the shepherds have stopped counting sheep.",
    owner: "wild",
    danger: 8,
    resources: ["Obsidian", "Gems", "Dragonbone"],
    income: 70,
    armyGain: 15,
    unlockLevel: 4,
  },
  {
    id: "shadow_marsh",
    name: "Shadow Marsh",
    x: 34,
    y: 82,
    description:
      "Black water and drowned towers. The Veyr built their keep where no army can bring siege engines.",
    owner: "veyr",
    danger: 7,
    resources: ["Poisons", "Secrets", "Peat"],
    income: 90,
    armyGain: 35,
    unlockLevel: 3,
  },
  {
    id: "ancient_ruins",
    name: "Ancient Ruins",
    x: 78,
    y: 86,
    description:
      "Cyclopean stonework from before the Kingdoms. Beneath it, something enormous has been breathing slowly for an age.",
    owner: "wild",
    danger: 10,
    resources: ["Relics", "Worldflame", "Lost Lore"],
    income: 130,
    armyGain: 10,
    unlockLevel: 6,
  },
];

export const locationById = (id: string) => LOCATIONS.find((l) => l.id === id)!;

export interface Character {
  id: string;
  name: string;
  house: HouseId;
  role: string;
  bio: string;
  dialogue: string;
  loyalty: number;
  location: string;
  hue: string;
}

export const CHARACTERS: Character[] = [
  { id: "maerys", name: "Maerys Valeron", house: "valeron", role: "Queen of the Ember Throne", bio: "Crowned at nineteen after her brothers burned. She has never raised her voice and has never been disobeyed twice.", dialogue: "Fire is not cruelty. Fire is clarity. Decide what you want, and I will decide what it costs you.", loyalty: 55, location: "capital", hue: "oklch(0.55 0.2 30)" },
  { id: "tarrek", name: "Ser Tarrek Aulme", house: "valeron", role: "Lord Commander of the Ember Guard", bio: "A career soldier who has outlived four monarchs' favour by never once having an opinion in public.", dialogue: "Give me an order I can carry out and I will carry it out. Give me a clever one and I will bury men for it.", loyalty: 48, location: "capital", hue: "oklch(0.6 0.14 45)" },
  { id: "isolde", name: "Isolde Fenn", house: "valeron", role: "Keeper of the Dragonpit", bio: "Raised among wyrms and mildly contemptuous of people. Missing two fingers, entirely unbothered by it.", dialogue: "They can smell the difference between a rider and a passenger. So can I.", loyalty: 40, location: "dragon_valley", hue: "oklch(0.65 0.16 60)" },
  { id: "corvin", name: "Corvin Draven", house: "draven", role: "Lord of the Northern Fortress", bio: "Buried two sons in one winter and has not smiled since. Commands absolute loyalty with almost no words.", dialogue: "I do not care what the south calls honour. In the north we call it surviving until spring.", loyalty: 30, location: "north_fortress", hue: "oklch(0.5 0.06 250)" },
  { id: "brynna", name: "Brynna Draven", house: "draven", role: "Shieldmaiden, Heir Apparent", bio: "Her father's only living child. Fights left-handed because her right was broken by a Kaelthorn axe and set wrong.", dialogue: "Talk if it pleases you. I'll be at the wall.", loyalty: 35, location: "north_fortress", hue: "oklch(0.58 0.07 245)" },
  { id: "hallam", name: "Hallam Stoke", house: "draven", role: "Siegemaster", bio: "A cheerful engineer with an unnerving fondness for describing exactly how walls fail.", dialogue: "Every fortress has one bad stone. Pay me enough and I'll find yours before your enemies do.", loyalty: 42, location: "iron_pass", hue: "oklch(0.55 0.05 230)" },
  { id: "sylvane", name: "Sylvane Aeloria", house: "aeloria", role: "Lady of the Moon Court", bio: "Reads seven dead languages and negotiates in all of them. Has never held a weapon and has ended two wars.", dialogue: "Armies are expensive, my friend. Agreements are merely tedious. I prefer tedium.", loyalty: 50, location: "moonlit_harbor", hue: "oklch(0.62 0.1 270)" },
  { id: "orien", name: "Orien Vale", house: "aeloria", role: "Star-Reader of the Silver Spire", bio: "Predicted the Long Siege eleven months early and was ignored. Has been insufferable about it since.", dialogue: "The sky already knows how this ends. I am merely offering you a shortcut.", loyalty: 44, location: "moonlit_harbor", hue: "oklch(0.7 0.09 280)" },
  { id: "mira", name: "Mira Lanterne", house: "aeloria", role: "Archivist of Drowned Records", bio: "Recovers documents from flooded vaults. Knows which noble debts were never actually repaid.", dialogue: "Everything is written down somewhere. The trick is being the one who finds it first.", loyalty: 46, location: "whispering_woods", hue: "oklch(0.72 0.07 285)" },
  { id: "aldric", name: "Aldric Kaelthorn", house: "kaelthorn", role: "Warden of the Storm Coast", bio: "Sailed into a hurricane on a wager at seventeen and came back with a fleet that wasn't his.", dialogue: "The sea doesn't negotiate and neither do I. But I do trade. Loudly.", loyalty: 38, location: "storm_coast", hue: "oklch(0.6 0.1 200)" },
  { id: "reyna", name: "Reyna Salt", house: "kaelthorn", role: "Captain of the Grey Tide", bio: "Best navigator in the eastern waters, banned from three ports for reasons she disputes.", dialogue: "Point at a coast. I'll get you there. Don't ask what I do on the way back.", loyalty: 41, location: "storm_coast", hue: "oklch(0.68 0.1 195)" },
  { id: "thom", name: "Thom Gale", house: "kaelthorn", role: "Storm-Priest", bio: "Claims the thunder answers him. It has, twice, in front of witnesses.", dialogue: "You want the sky on your side? The sky wants something first. It always does.", loyalty: 36, location: "storm_coast", hue: "oklch(0.66 0.12 185)" },
  { id: "nyssa", name: "Nyssa Veyr", house: "veyr", role: "Archon of the Shadow Keep", bio: "No portrait of her exists that two witnesses agree on. Holds debts from every Great House.", dialogue: "I do not want your loyalty. Loyalty expires. I want your obligation.", loyalty: 25, location: "shadow_marsh", hue: "oklch(0.45 0.11 320)" },
  { id: "kest", name: "Kest the Quiet", house: "veyr", role: "Master of Whispers", bio: "Speaks perhaps forty words a week and has ended careers with about nine of them.", dialogue: "I know three things about you. Two are wrong. Help me correct them.", loyalty: 28, location: "shadow_marsh", hue: "oklch(0.55 0.1 325)" },
  { id: "vela", name: "Vela Mourn", house: "veyr", role: "Poisoner of the Black Fen", bio: "Trained as a healer, which she insists is the same discipline viewed from the other end.", dialogue: "Dose makes the difference. Everything else is just intent.", loyalty: 32, location: "shadow_marsh", hue: "oklch(0.6 0.12 335)" },
  { id: "garrick", name: "Garrick Orne", house: "valeron", role: "Ruinwarden of the Old Stones", bio: "Guards the Ancient Ruins for a crown that half-forgot the post exists. Has heard the thing below turn over in its sleep.", dialogue: "Everyone who comes here wants what's underneath. Nobody asks whether it wants them.", loyalty: 38, location: "ancient_ruins", hue: "oklch(0.6 0.1 70)" },
  { id: "elowen", name: "Elowen Ash", house: "aeloria", role: "Wandering Herbalist", bio: "Neutral by trade, welcome in every camp, trusted by none of them entirely.", dialogue: "I patch soldiers from all five banners. Ask me who's winning; I'll tell you who's bleeding.", loyalty: 50, location: "whispering_woods", hue: "oklch(0.7 0.08 140)" },
];

export const charById = (id: string) => CHARACTERS.find((c) => c.id === id)!;

export interface Item {
  id: string;
  name: string;
  type: "Weapon" | "Armor" | "Dragon Item" | "Food" | "Treasure" | "Quest Item";
  description: string;
  effect?: { hp?: number; attack?: number; defense?: number; bond?: number; gold?: number; food?: number };
}

export const ITEMS: Item[] = [
  { id: "emberblade", name: "Emberblade", type: "Weapon", description: "A longsword quenched in dragonfire. Adds +6 attack to your dragon in battle.", effect: { attack: 6 } },
  { id: "scaleplate", name: "Wyrmscale Plate", type: "Armor", description: "Layered dragon scale harness. Adds +6 defense in battle.", effect: { defense: 6 } },
  { id: "stormlance", name: "Storm Lance", type: "Weapon", description: "Kaelthorn cavalry lance humming with charge. +9 attack.", effect: { attack: 9 } },
  { id: "moonmail", name: "Moonsilver Mail", type: "Armor", description: "Impossibly light Aelorian mail. +9 defense.", effect: { defense: 9 } },
  { id: "bondcharm", name: "Bonding Charm", type: "Dragon Item", description: "An old rider's talisman. Use to add +10 bond to your dragon.", effect: { bond: 10 } },
  { id: "furyhorn", name: "Horn of Fury", type: "Dragon Item", description: "Sound it and your dragon starts battle enraged. +40 max health.", effect: { hp: 40 } },
  { id: "saltbeef", name: "Salted Ox", type: "Food", description: "Feeds a dragon well. Restores 60 food-worth of rations.", effect: { food: 60 } },
  { id: "honeybread", name: "Honeyed Bread", type: "Food", description: "Camp morale in a loaf. +30 food.", effect: { food: 30 } },
  { id: "kingscoin", name: "Coffer of the Old King", type: "Treasure", description: "Buried Valeron coin. Use to claim 300 gold.", effect: { gold: 300 } },
  { id: "gemcache", name: "Ashen Gem Cache", type: "Treasure", description: "Raw stones from the dead volcanoes. Worth 200 gold.", effect: { gold: 200 } },
  { id: "sigilring", name: "Broken Sigil Ring", type: "Quest Item", description: "Taken from a dead courier. Someone very important wants it back.", },
  { id: "oldkey", name: "Rusted Ruin Key", type: "Quest Item", description: "Opens something under the Ancient Ruins. Probably shouldn't." },
  { id: "eggshard", name: "Cracked Egg Shard", type: "Dragon Item", description: "Proof of a hatching. Prized by dragonkeepers. +6 bond.", effect: { bond: 6 } },
];

export const itemById = (id: string) => ITEMS.find((i) => i.id === id)!;

export interface Enemy {
  id: string;
  name: string;
  title: string;
  health: number;
  attack: number;
  defense: number;
  speed: number;
  hue: string;
  reward: { gold: number; xp: number; reputation: number; army?: number; item?: string; territory?: string };
}

export const ENEMIES: Enemy[] = [
  { id: "bandits", name: "Ashroad Reavers", title: "Bandit Warband", health: 140, attack: 22, defense: 12, speed: 20, hue: "oklch(0.5 0.06 60)", reward: { gold: 180, xp: 60, reputation: 5, item: "honeybread" } },
  { id: "wolves", name: "Frost Wolf Pack", title: "Beasts of the North", health: 170, attack: 27, defense: 14, speed: 34, hue: "oklch(0.55 0.05 240)", reward: { gold: 140, xp: 80, reputation: 6, item: "saltbeef" } },
  { id: "raiders", name: "Grey Tide Raiders", title: "Coastal Marauders", health: 210, attack: 31, defense: 20, speed: 26, hue: "oklch(0.5 0.09 200)", reward: { gold: 260, xp: 110, reputation: 8, army: 60, item: "stormlance" } },
  { id: "ironhost", name: "The Iron Host", title: "Draven Vanguard", health: 260, attack: 36, defense: 28, speed: 18, hue: "oklch(0.45 0.06 250)", reward: { gold: 320, xp: 150, reputation: 12, army: 90, territory: "iron_pass", item: "scaleplate" } },
  { id: "marshstalkers", name: "Marsh Stalkers", title: "Veyr Assassins", health: 200, attack: 38, defense: 16, speed: 42, hue: "oklch(0.42 0.1 325)", reward: { gold: 340, xp: 140, reputation: 10, item: "sigilring" } },
  { id: "wyrmling", name: "Feral Wyrmling", title: "Untamed Dragon", health: 240, attack: 34, defense: 26, speed: 32, hue: "oklch(0.5 0.14 40)", reward: { gold: 300, xp: 180, reputation: 14, item: "eggshard" } },
  { id: "stormherald", name: "The Storm Herald", title: "Kaelthorn Champion", health: 320, attack: 42, defense: 30, speed: 30, hue: "oklch(0.55 0.11 195)", reward: { gold: 480, xp: 240, reputation: 18, territory: "storm_coast", item: "furyhorn" } },
  { id: "ashcolossus", name: "Ash Colossus", title: "Thing of the Grey Peaks", health: 380, attack: 46, defense: 38, speed: 12, hue: "oklch(0.4 0.02 60)", reward: { gold: 520, xp: 300, reputation: 20, territory: "ashen_mountains", item: "gemcache" } },
  { id: "shadowarchon", name: "Shade of the Keep", title: "Veyr Warlock", health: 340, attack: 48, defense: 26, speed: 36, hue: "oklch(0.4 0.12 320)", reward: { gold: 600, xp: 320, reputation: 22, territory: "shadow_marsh", item: "moonmail" } },
  { id: "worldflame", name: "Ignivar Unbound", title: "The Sleeper Beneath", health: 520, attack: 58, defense: 44, speed: 30, hue: "oklch(0.42 0.18 28)", reward: { gold: 1200, xp: 700, reputation: 40, territory: "ancient_ruins", item: "kingscoin" } },
  { id: "pretender", name: "The Pretender's Host", title: "Claimant to the Ember Throne", health: 600, attack: 62, defense: 46, speed: 28, hue: "oklch(0.48 0.16 35)", reward: { gold: 1500, xp: 900, reputation: 50, territory: "capital", item: "emberblade" } },
];

export const enemyById = (id: string) => ENEMIES.find((e) => e.id === id)!;

export interface Effects {
  gold?: number;
  army?: number;
  food?: number;
  reputation?: number;
  influence?: number;
  xp?: number;
  bond?: number;
  relation?: { id: string; delta: number }[];
  territory?: string;
  loseTerritory?: string;
  unlockDragon?: string;
  unlockLocation?: string;
  item?: string;
}

export interface QuestChoice {
  id: string;
  label: string;
  outcome: string;
  effects: Effects;
  battle?: string;
}

export type QuestCategory = "Main Story" | "House" | "Dragon" | "Exploration" | "Battle";

export interface Quest {
  id: string;
  title: string;
  category: QuestCategory;
  location: string;
  level: number;
  house?: HouseId;
  character?: string;
  story: string;
  objective: string;
  choices: QuestChoice[];
}

export const QUESTS: Quest[] = [
  {
    id: "m1",
    title: "The Ember Summons",
    category: "Main Story",
    location: "capital",
    level: 1,
    character: "maerys",
    story:
      "A courier arrives at dawn with a seal still warm from the wax. The Ember Throne demands that every Great House send a rider to the Capital before the next full moon. Half the realm reads it as an honour. The other half is already counting swords.",
    objective: "Answer the summons — or refuse it publicly.",
    choices: [
      { id: "a", label: "Ride to the Capital and kneel", outcome: "You kneel in front of a court that expected defiance. The Queen notices, and so does everyone else.", effects: { reputation: 10, influence: 8, gold: 150, xp: 60, relation: [{ id: "maerys", delta: 12 }] } },
      { id: "b", label: "Send a proxy and stay home", outcome: "Your banner appears at court; you do not. It is read as caution, which is not the worst reputation to hold.", effects: { gold: 80, influence: 3, xp: 40, army: 30 } },
      { id: "c", label: "Burn the summons on the steps of your keep", outcome: "Word travels fast. Your own soldiers cheer. The Capital does not.", effects: { reputation: -8, army: 90, xp: 55, relation: [{ id: "maerys", delta: -20 }, { id: "corvin", delta: 10 }] } },
    ],
  },
  {
    id: "m2",
    title: "Blood on the Iron Road",
    category: "Main Story",
    location: "iron_pass",
    level: 2,
    character: "hallam",
    story:
      "The only wagon road between the north and the south has gone quiet. Three grain convoys vanished in a fortnight, and the toll-keepers have stopped answering ravens. Hallam Stoke thinks it's reavers. Hallam Stoke is usually right and always insufferable about it.",
    objective: "Reopen the Iron Pass.",
    choices: [
      { id: "a", label: "Ride out and break the reavers", outcome: "Steel settles it.", effects: { xp: 90 }, battle: "bandits" },
      { id: "b", label: "Buy the road back with coin", outcome: "They take the purse and vanish north. The grain moves again, and no one has to be buried.", effects: { gold: -250, reputation: 6, influence: 6, xp: 60, relation: [{ id: "hallam", delta: 8 }] } },
      { id: "c", label: "Let the pass stay closed and hoard the grain", outcome: "Your granaries swell while three villages tighten their belts. They remember which.", effects: { food: 120, gold: 100, reputation: -12, xp: 45 } },
    ],
  },
  {
    id: "m3",
    title: "The Valley Wakes",
    category: "Main Story",
    location: "dragon_valley",
    level: 3,
    character: "isolde",
    story:
      "The thermal vents in Dragon Valley have been running hot for a month. Isolde Fenn says the nests are stirring, which means either a hatching or something older shifting in its sleep. She wants a rider she can trust in the crater.",
    objective: "Descend into the crater and see what stirs.",
    choices: [
      { id: "a", label: "Enter the crater on dragonback", outcome: "The heat is unbearable and the sight beneath is worse — and magnificent. Isolde gifts you a hatchling's shard.", effects: { xp: 140, bond: 12, item: "eggshard", unlockDragon: "ashfang", unlockLocation: "ashen_mountains", relation: [{ id: "isolde", delta: 15 }] } },
      { id: "b", label: "Send scouts and wait above", outcome: "Two of the six come back. What they say does not agree, but both mention scale.", effects: { xp: 70, gold: -80, reputation: -3, army: -25 } },
      { id: "c", label: "Seal the vents with rubble", outcome: "You bury the problem. The valley cools. Isolde does not speak to you for a season.", effects: { xp: 60, influence: 5, relation: [{ id: "isolde", delta: -18 }] } },
    ],
  },
  {
    id: "m4",
    title: "The Pretender's Banner",
    category: "Main Story",
    location: "capital",
    level: 6,
    character: "maerys",
    story:
      "A claimant has raised a host beneath a banner nobody recognises and a bloodline nobody can disprove. He is three days from the Capital and gathering strength. The Ember Throne will change hands this week — the only question is whose hands.",
    objective: "Decide the fate of the Ember Throne.",
    choices: [
      { id: "a", label: "Meet the Pretender in open battle", outcome: "History is written on the field below Emberhold.", effects: { xp: 300 }, battle: "pretender" },
      { id: "b", label: "Join the Pretender and take the throne together", outcome: "You ride under a new banner. The Queen's guard breaks. The crown is heavier than expected.", effects: { gold: 800, army: 300, influence: 25, reputation: -25, territory: "capital", xp: 260, relation: [{ id: "maerys", delta: -50 }, { id: "nyssa", delta: 15 }] } },
      { id: "c", label: "Broker an abdication in exchange for the North", outcome: "Ink instead of blood. The Queen retires to the isles; you take a crown by signature.", effects: { influence: 30, reputation: 15, territory: "north_fortress", gold: -300, xp: 280, relation: [{ id: "sylvane", delta: 20 }] } },
    ],
  },
  {
    id: "h_valeron",
    title: "Ashes of the Old Court",
    category: "House",
    location: "capital",
    level: 2,
    house: "valeron",
    character: "tarrek",
    story:
      "Someone has been selling Valeron dragonpit schedules. Ser Tarrek has a name, a cellar, and a strong preference for handling it before the Queen hears.",
    objective: "Resolve the leak in the Ember Guard.",
    choices: [
      { id: "a", label: "Hang the traitor publicly", outcome: "The pit runs quiet for a year. So does the court.", effects: { reputation: -5, influence: 12, army: 40, xp: 90, relation: [{ id: "tarrek", delta: 10 }] } },
      { id: "b", label: "Turn him and feed false schedules", outcome: "For two months, every ambush arrives exactly where you want it.", effects: { gold: 260, influence: 15, xp: 110, relation: [{ id: "tarrek", delta: 6 }, { id: "kest", delta: -10 }] } },
    ],
  },
  {
    id: "h_draven",
    title: "The Long Winter Levy",
    category: "House",
    location: "north_fortress",
    level: 2,
    house: "draven",
    character: "brynna",
    story:
      "The north is short of grain and long on spears. Corvin wants a levy that will empty the villages of every man who can hold a shaft. Brynna thinks it will empty them permanently.",
    objective: "Set the terms of the northern levy.",
    choices: [
      { id: "a", label: "Take the full levy", outcome: "Nine hundred spears march. The fields go unsown.", effects: { army: 220, food: -140, reputation: -10, xp: 95, relation: [{ id: "corvin", delta: 12 }, { id: "brynna", delta: -12 }] } },
      { id: "b", label: "Halve it and buy southern grain", outcome: "Fewer spears, fuller bellies, and a north that will still be there in spring.", effects: { army: 90, gold: -220, food: 100, reputation: 10, xp: 95, relation: [{ id: "brynna", delta: 15 }] } },
    ],
  },
  {
    id: "h_aeloria",
    title: "The Drowned Ledger",
    category: "House",
    location: "moonlit_harbor",
    level: 2,
    house: "aeloria",
    character: "mira",
    story:
      "Mira Lanterne has pulled a waterlogged ledger from a flooded vault. It proves three Great Houses defaulted on Aelorian loans a generation ago. It is worth either an enormous amount of coin or an enormous amount of leverage.",
    objective: "Decide what the ledger is worth.",
    choices: [
      { id: "a", label: "Call in the debts", outcome: "The coin arrives. So does a great deal of quiet resentment.", effects: { gold: 700, reputation: -8, influence: 5, xp: 100, relation: [{ id: "aldric", delta: -12 }, { id: "corvin", delta: -10 }] } },
      { id: "b", label: "Forgive the debts publicly", outcome: "You buy something more durable than money.", effects: { influence: 28, reputation: 18, xp: 100, relation: [{ id: "aldric", delta: 15 }, { id: "corvin", delta: 12 }, { id: "sylvane", delta: 10 }] } },
    ],
  },
  {
    id: "h_kaelthorn",
    title: "What The Sky Owes",
    category: "House",
    location: "storm_coast",
    level: 2,
    house: "kaelthorn",
    character: "thom",
    story:
      "Thom Gale wants to call the storm down on a rival fleet. The rite requires a sacrifice of the caller's choosing, and he is being deliberately vague about the menu.",
    objective: "Permit or forbid the storm rite.",
    choices: [
      { id: "a", label: "Allow the rite", outcome: "The rival fleet does not make port. Neither does one of yours.", effects: { influence: 18, gold: 300, army: -60, reputation: -6, xp: 110, relation: [{ id: "thom", delta: 15 }] } },
      { id: "b", label: "Forbid it and fight at sea instead", outcome: "Honest work, honest losses, and a crew that would follow you into a hurricane.", effects: { xp: 120 }, battle: "raiders" },
    ],
  },
  {
    id: "h_veyr",
    title: "A Debt In Every Hall",
    category: "House",
    location: "shadow_marsh",
    level: 2,
    house: "veyr",
    character: "kest",
    story:
      "Kest the Quiet lays four sealed letters on the table. Each ruins a different noble. He will send whichever you point at, and he will not explain how he got them.",
    objective: "Choose a target — or none.",
    choices: [
      { id: "a", label: "Ruin the wealthiest of them", outcome: "A great house's coffers open at midnight, and half of it walks into your marsh.", effects: { gold: 650, reputation: -14, influence: 12, xp: 110, relation: [{ id: "kest", delta: 12 }, { id: "sylvane", delta: -12 }] } },
      { id: "b", label: "Burn all four letters", outcome: "Kest watches the ash and, for the first time, appears to be thinking about you rather than around you.", effects: { reputation: 16, influence: 8, xp: 100, relation: [{ id: "kest", delta: 18 }, { id: "nyssa", delta: -8 }] } },
    ],
  },
  {
    id: "d1",
    title: "First Feeding",
    category: "Dragon",
    location: "dragon_valley",
    level: 1,
    character: "isolde",
    story:
      "Isolde drops a side of ox in the dust and steps back. 'Don't throw it,' she says. 'Hold it. If it takes the meat from your hands, it has decided something about you.'",
    objective: "Establish the bond with your dragon.",
    choices: [
      { id: "a", label: "Hold the meat and stand still", outcome: "Teeth pass close enough to shave you. It eats. It stays.", effects: { bond: 18, xp: 70, food: -40, relation: [{ id: "isolde", delta: 10 }] } },
      { id: "b", label: "Throw it and keep your distance", outcome: "It eats. It also learns that you flinch.", effects: { bond: 5, xp: 40, food: -40 } },
    ],
  },
  {
    id: "d2",
    title: "The Sky Trial",
    category: "Dragon",
    location: "ashen_mountains",
    level: 3,
    story:
      "There is only one honest way to test a rider: take the beast above the cloud deck where the air thins and the straps are the only thing between you and the grey peaks below.",
    objective: "Fly the trial over the Ashen Mountains.",
    choices: [
      { id: "a", label: "Fly the full ascent", outcome: "Your ears bleed and your hands freeze to the harness, but you come down together.", effects: { bond: 20, xp: 130, unlockDragon: "vaelith" } },
      { id: "b", label: "Break off early and land", outcome: "Safe. Slightly diminished, in your own estimation and the dragon's.", effects: { bond: 4, xp: 60 } },
    ],
  },
  {
    id: "d3",
    title: "The Feral Wyrmling",
    category: "Dragon",
    location: "whispering_woods",
    level: 3,
    story:
      "A young dragon has been taking cattle from the woodland villages. It is too small to be a terror and too large to be ignored. The villagers want it dead. Isolde would want it caught.",
    objective: "Deal with the feral wyrmling.",
    choices: [
      { id: "a", label: "Fight it", outcome: "It does not go easily.", effects: { xp: 120 }, battle: "wyrmling" },
      { id: "b", label: "Trap and tame it", outcome: "Three nights of bait and patience. It follows you out of the treeline on its own legs.", effects: { bond: 14, xp: 150, gold: -200, unlockDragon: "emberwing", reputation: 8 } },
    ],
  },
  {
    id: "d4",
    title: "The Sleeping Titan",
    category: "Dragon",
    location: "ancient_ruins",
    level: 6,
    character: "garrick",
    story:
      "Garrick Orne unlocks a stair that has not been opened in four hundred years. Below, the heat is wrong and the air tastes of struck flint. Something enormous is breathing down there, slowly, and it has been waiting for a rider.",
    objective: "Wake Ignivar — or leave him sleeping.",
    choices: [
      { id: "a", label: "Wake him and offer your hand", outcome: "The Worldflame opens one eye and, astonishingly, does not kill you.", effects: { bond: 25, xp: 400, unlockDragon: "ignivar", reputation: 20, relation: [{ id: "garrick", delta: 15 }] } },
      { id: "b", label: "Wake him and force submission", outcome: "It goes as well as forcing a season to change.", effects: { xp: 350, unlockDragon: "ignivar" }, battle: "worldflame" },
      { id: "c", label: "Seal the stair and walk away", outcome: "Garrick sleeps better. You do not.", effects: { xp: 120, influence: 10, gold: 200, relation: [{ id: "garrick", delta: 20 }] } },
    ],
  },
  {
    id: "e1",
    title: "The Whispering Path",
    category: "Exploration",
    location: "whispering_woods",
    level: 1,
    character: "elowen",
    story:
      "Elowen Ash offers to guide you along a deer track that supposedly cuts two days off the southern road. She mentions, without emphasis, that the wood sometimes suggests other routes.",
    objective: "Chart the woodland path.",
    choices: [
      { id: "a", label: "Follow Elowen's track", outcome: "Two days saved and a satchel of rare herbs pressed into your hand.", effects: { xp: 60, item: "honeybread", relation: [{ id: "elowen", delta: 12 }], gold: 90 } },
      { id: "b", label: "Follow the voice instead", outcome: "You emerge somewhere the maps do not show, holding something the maps definitely do not show.", effects: { xp: 100, item: "oldkey", reputation: -4, unlockLocation: "ancient_ruins" } },
    ],
  },
  {
    id: "e2",
    title: "Salt and Amber",
    category: "Exploration",
    location: "storm_coast",
    level: 2,
    character: "reyna",
    story:
      "Reyna Salt has found an amber shelf in a cove that technically belongs to nobody and practically belongs to whoever gets a crew there first.",
    objective: "Work the amber cove.",
    choices: [
      { id: "a", label: "Harvest it openly and pay the tolls", outcome: "Less coin, no enemies, and a harbour that keeps letting you dock.", effects: { gold: 280, reputation: 8, influence: 5, xp: 70, relation: [{ id: "aldric", delta: 8 }] } },
      { id: "b", label: "Strip the cove by night", outcome: "The hold is full and Reyna is grinning. Somebody will notice by spring.", effects: { gold: 620, reputation: -12, xp: 80, relation: [{ id: "reyna", delta: 12 }, { id: "aldric", delta: -14 }] } },
    ],
  },
  {
    id: "e3",
    title: "The Silver Spire's Question",
    category: "Exploration",
    location: "moonlit_harbor",
    level: 2,
    character: "orien",
    story:
      "Orien Vale has a chart of a star that should not be moving. He wants three nights of your time and one very expensive lens.",
    objective: "Fund and complete the observation.",
    choices: [
      { id: "a", label: "Buy the lens", outcome: "On the third night the star changes course. Orien writes for six hours without stopping and hands you a prophecy you cannot yet read.", effects: { gold: -300, influence: 22, xp: 120, unlockLocation: "iron_pass", relation: [{ id: "orien", delta: 18 }] } },
      { id: "b", label: "Refuse the expense", outcome: "He observes anyway with a cracked lens and tells you nothing further.", effects: { xp: 40, relation: [{ id: "orien", delta: -12 }] } },
    ],
  },
  {
    id: "e4",
    title: "Beneath the Drowned Towers",
    category: "Exploration",
    location: "shadow_marsh",
    level: 4,
    character: "vela",
    story:
      "Vela Mourn knows a tower that only surfaces at low water, and knows what was left inside it when the marsh took it.",
    objective: "Dive the drowned tower.",
    choices: [
      { id: "a", label: "Go in with Vela", outcome: "Black water to the chest and a strongbox that has not been opened since the flood.", effects: { gold: 420, item: "gemcache", xp: 150, relation: [{ id: "vela", delta: 14 }] } },
      { id: "b", label: "Send hirelings", outcome: "They come back with half of it and a story about the other half.", effects: { gold: 200, xp: 70, army: -20 } },
    ],
  },
  {
    id: "e5",
    title: "The Grey Peaks Survey",
    category: "Exploration",
    location: "ashen_mountains",
    level: 4,
    story:
      "Nobody has surveyed the dead volcanoes since the shepherds fled. There is obsidian up there, dragonbone, and something that has been rearranging the cairns.",
    objective: "Survey the Ashen Mountains.",
    choices: [
      { id: "a", label: "Push to the summit", outcome: "The survey is complete and the cairn-mover finds you first.", effects: { xp: 160 }, battle: "ashcolossus" },
      { id: "b", label: "Map the lower slopes only", outcome: "A safe, partial map — and enough obsidian to matter.", effects: { gold: 260, xp: 90, item: "gemcache" } },
    ],
  },
  {
    id: "b1",
    title: "Reavers on the Ashroad",
    category: "Battle",
    location: "whispering_woods",
    level: 1,
    story: "A reaver band has been burning waystations along the Ashroad. They are not soldiers, but there are a great many of them and they have stopped taking prisoners.",
    objective: "Destroy the Ashroad Reavers.",
    choices: [{ id: "a", label: "Take the field", outcome: "", effects: { xp: 40 }, battle: "bandits" }],
  },
  {
    id: "b2",
    title: "The Frost Pack",
    category: "Battle",
    location: "north_fortress",
    level: 2,
    character: "brynna",
    story: "Wolves the size of ponies have come down from the ice and taken four outriders. Brynna is already saddled.",
    objective: "Break the Frost Wolf Pack.",
    choices: [{ id: "a", label: "Hunt them", outcome: "", effects: { xp: 50, relation: [{ id: "brynna", delta: 8 }] }, battle: "wolves" }],
  },
  {
    id: "b3",
    title: "Blockade of the Grey Tide",
    category: "Battle",
    location: "storm_coast",
    level: 3,
    story: "Raiders under no banner have closed the eastern shipping lane. The harbour is losing a fortune every tide.",
    objective: "Break the blockade.",
    choices: [{ id: "a", label: "Sail out to meet them", outcome: "", effects: { xp: 60 }, battle: "raiders" }],
  },
  {
    id: "b4",
    title: "The Iron Host Marches",
    category: "Battle",
    location: "iron_pass",
    level: 4,
    character: "corvin",
    story: "A Draven vanguard has taken the Iron Pass and begun charging tolls in blood. Whoever breaks them owns the road.",
    objective: "Defeat the Iron Host and seize the Iron Pass.",
    choices: [{ id: "a", label: "Assault the pass", outcome: "", effects: { xp: 80 }, battle: "ironhost" }],
  },
  {
    id: "b5",
    title: "Knives in the Reeds",
    category: "Battle",
    location: "shadow_marsh",
    level: 4,
    character: "nyssa",
    story: "Veyr stalkers have been picking off your officers one by one. Nyssa denies it in a letter so polite it is functionally a confession.",
    objective: "Hunt down the Marsh Stalkers.",
    choices: [{ id: "a", label: "Set a counter-ambush", outcome: "", effects: { xp: 90, relation: [{ id: "nyssa", delta: -10 }] }, battle: "marshstalkers" }],
  },
  {
    id: "b6",
    title: "The Storm Herald's Challenge",
    category: "Battle",
    location: "storm_coast",
    level: 5,
    character: "aldric",
    story: "Kaelthorn's champion has issued a single-combat challenge for the Storm Coast itself. Refusing it costs nothing but respect, which is to say everything.",
    objective: "Defeat the Storm Herald and claim the Storm Coast.",
    choices: [{ id: "a", label: "Accept the challenge", outcome: "", effects: { xp: 120 }, battle: "stormherald" }],
  },
  {
    id: "b7",
    title: "Shade of the Shadow Keep",
    category: "Battle",
    location: "shadow_marsh",
    level: 5,
    story: "Something wearing an Archon's robes walks the keep's upper galleries at night. It is not Nyssa Veyr, and Nyssa Veyr is frightened of it.",
    objective: "Destroy the Shade and take the Shadow Keep.",
    choices: [{ id: "a", label: "Climb the black stair", outcome: "", effects: { xp: 140 }, battle: "shadowarchon" }],
  },
  {
    id: "e6",
    title: "The Village at Greyford",
    category: "Exploration",
    location: "whispering_woods",
    level: 2,
    character: "elowen",
    story:
      "Greyford has been ordered to hand over its winter stores to a passing column. The village has perhaps forty fighting men and a great deal of nerve.",
    objective: "Decide Greyford's fate.",
    choices: [
      { id: "a", label: "Protect the village", outcome: "You stand in the road with your banner and the column turns aside. Greyford will not forget it.", effects: { reputation: 20, army: 40, gold: -120, xp: 100, relation: [{ id: "elowen", delta: 18 }] } },
      { id: "b", label: "Take the stores yourself", outcome: "Your granaries are full and your name is now a curse in one small valley.", effects: { food: 180, gold: 140, reputation: -18, xp: 70, relation: [{ id: "elowen", delta: -20 }] } },
      { id: "c", label: "Negotiate a lesser tithe", outcome: "Half the stores, no burning, and everyone leaves faintly dissatisfied — the mark of a fair deal.", effects: { food: 80, influence: 10, reputation: 6, xp: 85 } },
    ],
  },
];

export const questById = (id: string) => QUESTS.find((q) => q.id === id)!;

export interface Achievement {
  id: string;
  name: string;
  description: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_blood", name: "First Blood", description: "Win your first battle." },
  { id: "dragon_rider", name: "Dragon Rider", description: "Bond with a dragon at level 50 or higher." },
  { id: "beast_tamer", name: "Beast Tamer", description: "Unlock five dragons." },
  { id: "conqueror", name: "Conqueror", description: "Control four or more territories." },
  { id: "master_realm", name: "Master of the Realm", description: "Reach player level 8." },
  { id: "coffers", name: "Full Coffers", description: "Hold 3,000 gold at once." },
  { id: "warlord", name: "Warlord", description: "Command an army of 1,500." },
  { id: "diplomat", name: "Silver Tongue", description: "Reach 80 influence." },
  { id: "chronicler", name: "Chronicler", description: "Complete ten quests." },
  { id: "legend", name: "Legend of the Seven", description: "Reach reputation 100." },
  { id: "worldbreaker", name: "Worldbreaker", description: "Defeat Ignivar Unbound or claim the Ember Throne." },
  { id: "collector", name: "Hoarder", description: "Hold eight different items." },
];

export const xpForLevel = (level: number) => 200 + (level - 1) * 180;
export const dragonXpForLevel = (level: number) => 120 + (level - 1) * 100;
