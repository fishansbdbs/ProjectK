export const CARD_TYPES = Object.freeze({ MONSTER: "monster", SPELL: "spell", MASTER: "master" });
export const ELEMENTS = Object.freeze({ FIRE: "fire", WATER: "water", EARTH: "earth", METAL: "metal", STAR: "star", SHADOW: "shadow" });
export const RARITIES = Object.freeze({ COMMON: "Common", UNCOMMON: "Uncommon", RARE: "Rare" });

export const DECK_MASTERS = [
  ["ember-lion", "Ember Lion", ELEMENTS.FIRE, "Aggressive", "Awakens after you deal 1500 total damage.", "Lionheart Burst", "Your active monster gains +700 ATK this turn.", "damageDealt", 1500, "#f97316", "#fef08a", "lion"],
  ["tide-serpent", "Tide Serpent", ELEMENTS.WATER, "Defensive control", "Awakens after you heal or prevent 1000 damage.", "Tidal Reversal", "Heal 800 life and reduce the enemy monster's ATK by 300.", "healedPrevented", 1000, "#06b6d4", "#bfdbfe", "serpent"],
  ["iron-golem", "Iron Golem", ELEMENTS.METAL, "Defensive", "Awakens after your monsters survive 3 attacks.", "Fortress Oath", "Prevent the next 1000 damage.", "monsterSurvivedAttacks", 3, "#64748b", "#d1d5db", "golem"],
  ["star-raven", "Star Raven", ELEMENTS.STAR, "Trickster balance", "Awakens after 5 total spells are played.", "Eclipse Trick", "The enemy skips their next monster play, but can still play a spell.", "spellsSeen", 5, "#8b5cf6", "#f8fafc", "raven"]
].map(([id, name, element, style, awakenText, abilityName, abilityText, type, amount, color, accent, body]) => ({
  id, name, element, style, awakenText, abilityName, abilityText,
  model: { body, color, accent },
  awakenCondition: { type, amount }
}));

const model = (shape, color, accent, symbol) => ({ shape, color, accent, symbol });
const monster = (id, name, element, attack, defense, rarity, effect, flavor, m) => ({
  id, name, type: CARD_TYPES.MONSTER, element, attack, defense, rarity, effect, flavor, model: m,
  art: { seed: id, primary: m.color, secondary: m.accent, symbol: m.symbol }
});
const spell = (id, name, element, rarity, effect, flavor, spellType, value, extra = {}) => ({
  id, name, type: CARD_TYPES.SPELL, element, rarity, effect, flavor, spellType, value, ...extra,
  art: { seed: id, primary: extra.color ?? "#f8fafc", secondary: extra.accent ?? "#64748b", symbol: extra.symbol ?? "*" }
});

export const CARDS = [
  monster("ember-cub", "Ember Cub", ELEMENTS.FIRE, 900, 500, RARITIES.COMMON, "A quick guardian that rewards early pressure.", "Small paws, bright courage.", model("quadruped", "#f97316", "#fed7aa", "F")),
  monster("ashwing-scout", "Ashwing Scout", ELEMENTS.FIRE, 1000, 600, RARITIES.COMMON, "Steady attacker for fast openings.", "It maps the rift-winds by spark trail.", model("winged", "#ea580c", "#fde68a", "A")),
  monster("flamehorn-brute", "Flamehorn Brute", ELEMENTS.FIRE, 1500, 700, RARITIES.UNCOMMON, "High attack, low staying power.", "A charge from it leaves molten footprints.", model("horned", "#dc2626", "#fdba74", "H")),
  monster("cinder-lynx", "Cinder Lynx", ELEMENTS.FIRE, 1200, 800, RARITIES.COMMON, "Balanced fire monster.", "Its whiskers glow before danger appears.", model("cat", "#fb923c", "#fff7ed", "L")),
  monster("rift-hound", "Rift Hound", ELEMENTS.SHADOW, 1100, 700, RARITIES.COMMON, "Reliable pressure from the borderlands.", "It barks only at things no one else sees.", model("hound", "#4c1d95", "#c4b5fd", "R")),
  monster("blaze-stag", "Blaze Stag", ELEMENTS.FIRE, 1300, 500, RARITIES.UNCOMMON, "Strikes hard but folds under retaliation.", "Antlers like signal fires guide lost Cardbearers home.", model("stag", "#f43f5e", "#fef3c7", "B")),
  monster("tidecaller-eel", "Tidecaller Eel", ELEMENTS.WATER, 800, 1100, RARITIES.COMMON, "Durable water opener.", "Its song turns dust to rain.", model("serpent", "#0891b2", "#cffafe", "T")),
  monster("coral-knight", "Coral Knight", ELEMENTS.WATER, 1000, 1300, RARITIES.UNCOMMON, "Defends well while setting up control spells.", "Its armor grows where promises are kept.", model("knight", "#0ea5e9", "#fecdd3", "C")),
  monster("mistfin-drake", "Mistfin Drake", ELEMENTS.WATER, 1200, 1000, RARITIES.UNCOMMON, "Flexible attacker and blocker.", "A pale silhouette above the harbor fog.", model("drake", "#38bdf8", "#dbeafe", "M")),
  monster("shellback-medic", "Shellback Medic", ELEMENTS.WATER, 700, 1400, RARITIES.COMMON, "Low attack, high defense.", "It carries rainwater in a living shield.", model("turtle", "#14b8a6", "#ccfbf1", "S")),
  monster("blueglass-manta", "Blueglass Manta", ELEMENTS.WATER, 900, 1200, RARITIES.COMMON, "Stalls aggressive decks.", "Its wings reflect skies from other worlds.", model("manta", "#2563eb", "#bfdbfe", "G")),
  monster("harbor-warden", "Harbor Warden", ELEMENTS.WATER, 1100, 1200, RARITIES.RARE, "A strong defensive pivot.", "Every lighthouse keeps one seal lit for it.", model("warden", "#0284c7", "#bae6fd", "W")),
  monster("bronze-sentinel", "Bronze Sentinel", ELEMENTS.METAL, 1000, 1500, RARITIES.COMMON, "Solid defender with enough attack to matter.", "Old bronze, new oath.", model("sentinel", "#a16207", "#fde68a", "N")),
  monster("ironroot-guardian", "Ironroot Guardian", ELEMENTS.EARTH, 900, 1700, RARITIES.UNCOMMON, "A wall that helps awaken Iron Golem.", "Its roots drink from buried anvils.", model("treeguard", "#166534", "#d9f99d", "I")),
  monster("stoneback-ram", "Stoneback Ram", ELEMENTS.EARTH, 1100, 1600, RARITIES.COMMON, "High defense with respectable attack.", "It lowers its head and mountains listen.", model("ram", "#78716c", "#e7e5e4", "K")),
  monster("ferrum-squire", "Ferrum Squire", ELEMENTS.METAL, 800, 1800, RARITIES.COMMON, "Excellent defensive starter.", "Too young for a blade, old enough for a vow.", model("squire", "#475569", "#cbd5e1", "Q")),
  monster("granite-bulwark", "Granite Bulwark", ELEMENTS.EARTH, 700, 1900, RARITIES.RARE, "Very hard to break by battle.", "A gate that learned to walk.", model("bulwark", "#525252", "#f5f5f4", "U")),
  monster("gearvine-defender", "Gearvine Defender", ELEMENTS.METAL, 1200, 1500, RARITIES.UNCOMMON, "Stable monster for long games.", "Its leaves click like careful clockwork.", model("vinebot", "#4b5563", "#86efac", "V")),
  monster("moonlit-squire", "Moonlit Squire", ELEMENTS.STAR, 1000, 1000, RARITIES.COMMON, "Simple, flexible, and dependable.", "Trains by reading shadows on silver stone.", model("squire", "#7c3aed", "#e9d5ff", "O")),
  monster("starveil-crow", "Starveil Crow", ELEMENTS.STAR, 1100, 900, RARITIES.COMMON, "Pressure monster for spell-heavy decks.", "It steals glints from the night and gives them back as warnings.", model("bird", "#6d28d9", "#f8fafc", "Y")),
  monster("nightglass-imp", "Nightglass Imp", ELEMENTS.SHADOW, 900, 900, RARITIES.COMMON, "Cheap tempo attacker.", "Transparent until it grins.", model("imp", "#312e81", "#a5b4fc", "P")),
  monster("void-lantern-mage", "Void Lantern Mage", ELEMENTS.STAR, 1200, 800, RARITIES.UNCOMMON, "Pairs well with attack tricks.", "Its lantern burns with missing constellations.", model("mage", "#9333ea", "#f0abfc", "Z")),
  monster("dusk-ribbon-duelist", "Dusk Ribbon Duelist", ELEMENTS.SHADOW, 1300, 900, RARITIES.RARE, "Strong tempo threat.", "Never draws a blade until the crowd stops breathing.", model("duelist", "#581c87", "#f5d0fe", "D")),
  monster("astral-page", "Astral Page", ELEMENTS.STAR, 800, 1200, RARITIES.COMMON, "Defensive spell companion.", "Every blank page remembers a future spell.", model("page", "#4338ca", "#ddd6fe", "J")),
  spell("spark-bolt", "Spark Bolt", ELEMENTS.FIRE, RARITIES.COMMON, "Deal 500 damage to the enemy player.", "A clean line of heat across the veil.", "damage", 500, { color: "#f97316", accent: "#fef08a", symbol: "!" }),
  spell("guard-sigil", "Guard Sigil", ELEMENTS.METAL, RARITIES.COMMON, "Prevent the next 500 damage you would take.", "A square of light. A second chance.", "shield", 500, { color: "#64748b", accent: "#e2e8f0", symbol: "#" }),
  spell("healing-rain", "Healing Rain", ELEMENTS.WATER, RARITIES.COMMON, "Heal 500 life.", "The sky apologizes in silver drops.", "heal", 500, { color: "#0ea5e9", accent: "#dbeafe", symbol: "+" }),
  spell("rift-snare", "Rift Snare", ELEMENTS.SHADOW, RARITIES.COMMON, "Reduce the enemy monster's ATK by 300.", "The shadow grabs the loudest footstep.", "weaken", 300, { color: "#4c1d95", accent: "#c4b5fd", symbol: "~" }),
  spell("ember-charge", "Ember Charge", ELEMENTS.FIRE, RARITIES.COMMON, "Your active monster gains +300 ATK this turn.", "A heartbeat learns to roar.", "boost", 300, { color: "#ef4444", accent: "#fed7aa", symbol: "^", duration: "turn" }),
  spell("tide-wall", "Tide Wall", ELEMENTS.WATER, RARITIES.UNCOMMON, "Prevent the next 700 damage you would take.", "A wave rises like a locked door.", "shield", 700, { color: "#0284c7", accent: "#cffafe", symbol: "|" }),
  spell("stone-pact", "Stone Pact", ELEMENTS.EARTH, RARITIES.UNCOMMON, "Your monster gains +300 DEF and you prevent the next 300 damage.", "Promise with the earth and it remembers.", "fortify", 300, { color: "#65a30d", accent: "#ecfccb", symbol: "=" }),
  spell("starfall-mark", "Starfall Mark", ELEMENTS.STAR, RARITIES.UNCOMMON, "Deal 300 damage and reduce the enemy monster's ATK by 200.", "A falling star writes one name.", "mark", 300, { color: "#7c3aed", accent: "#f5d0fe", symbol: "." }),
  spell("shatter-seal", "Shatter Seal", ELEMENTS.METAL, RARITIES.RARE, "Destroy an enemy monster with 1000 or less ATK.", "A brittle curse breaks loudest.", "destroyWeak", 1000, { color: "#334155", accent: "#f8fafc", symbol: "X" }),
  spell("moonlight-veil", "Moonlight Veil", ELEMENTS.STAR, RARITIES.COMMON, "Prevent the next 600 damage you would take.", "Soft light hides sharp edges.", "shield", 600, { color: "#6366f1", accent: "#e0e7ff", symbol: ")" }),
  spell("iron-blessing", "Iron Blessing", ELEMENTS.METAL, RARITIES.COMMON, "Your monster gains +300 DEF and you prevent the next 400 damage.", "The seal locks like a clasp.", "fortify", 400, { color: "#71717a", accent: "#e5e7eb", symbol: "[" }),
  spell("burning-oath", "Burning Oath", ELEMENTS.FIRE, RARITIES.RARE, "Deal 600 damage to the enemy and 200 damage to yourself.", "Victory asks what you are willing to spend.", "riskyDamage", 600, { selfDamage: 200, color: "#be123c", accent: "#ffedd5", symbol: "%" }),
  spell("coral-mend", "Coral Mend", ELEMENTS.WATER, RARITIES.UNCOMMON, "Heal 700 life.", "Wounds close in branching pink light.", "heal", 700, { color: "#06b6d4", accent: "#fecdd3", symbol: "&" }),
  spell("gravity-knot", "Gravity Knot", ELEMENTS.SHADOW, RARITIES.UNCOMMON, "The enemy skips their next attack.", "A tiny knot in a very heavy string.", "skipAttack", 1, { color: "#1e1b4b", accent: "#c7d2fe", symbol: "@" }),
  spell("bright-omen", "Bright Omen", ELEMENTS.STAR, RARITIES.RARE, "Gain 20 Deck Master meter.", "The future taps on the glass.", "meter", 20, { color: "#a855f7", accent: "#fef9c3", symbol: "?" }),
  spell("silent-return", "Silent Return", ELEMENTS.SHADOW, RARITIES.UNCOMMON, "Return your active monster to your hand.", "Retreat can be another form of aim.", "returnSelf", 1, { color: "#312e81", accent: "#ddd6fe", symbol: "<" })
];

export const CARD_BY_ID = Object.fromEntries(CARDS.map((card) => [card.id, card]));
export const MASTER_BY_ID = Object.fromEntries(DECK_MASTERS.map((master) => [master.id, master]));

export const STARTER_DECKS = [
  { id: "ember-pride", name: "Ember Pride", description: "Aggressive fire deck with hard-hitting monsters, burn spells, and risky boosts.", deckMasterId: "ember-lion", cardIds: ["ember-cub", "ember-cub", "ashwing-scout", "flamehorn-brute", "cinder-lynx", "blaze-stag", "spark-bolt", "ember-charge", "burning-oath", "guard-sigil"] },
  { id: "tidebound-circle", name: "Tidebound Circle", description: "Defensive water deck built around healing, weakening monsters, and steady pressure.", deckMasterId: "tide-serpent", cardIds: ["tidecaller-eel", "tidecaller-eel", "coral-knight", "mistfin-drake", "shellback-medic", "blueglass-manta", "healing-rain", "tide-wall", "rift-snare", "coral-mend"] },
  { id: "ironroot-wall", name: "Ironroot Wall", description: "Earth and metal deck with high defense, damage prevention, and patient wins.", deckMasterId: "iron-golem", cardIds: ["bronze-sentinel", "ironroot-guardian", "ironroot-guardian", "stoneback-ram", "ferrum-squire", "granite-bulwark", "guard-sigil", "stone-pact", "iron-blessing", "shatter-seal"] },
  { id: "starshade-pact", name: "Starshade Pact", description: "Balanced star and shadow deck with tempo spells and flexible monsters.", deckMasterId: "star-raven", cardIds: ["moonlit-squire", "starveil-crow", "starveil-crow", "nightglass-imp", "void-lantern-mage", "dusk-ribbon-duelist", "starfall-mark", "moonlight-veil", "gravity-knot", "bright-omen"] }
];

export const STARTER_BY_ID = Object.fromEntries(STARTER_DECKS.map((deck) => [deck.id, deck]));
export function getCard(id) { return CARD_BY_ID[id] ?? null; }
export function getMaster(id) { return MASTER_BY_ID[id] ?? null; }
export function getStarterDeck(id) { return STARTER_BY_ID[id] ?? STARTER_DECKS[0]; }
export function getOwnedCards() { return CARDS.map((card) => card.id); }
