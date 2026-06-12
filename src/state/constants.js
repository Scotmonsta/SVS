// Tunable game constants. One source of truth.

export const START_MONEY = 10_000;
export const TARGET_BALANCE = 100_000_000;

export const START_HEALTH = 100;
export const MAX_HEALTH = 100;

// S.C.A.L.E. — the five skills. Order here drives the character-creation UI.
export const SKILLS = ['smarts', 'clout', 'adaptability', 'leverage', 'endurance'];
export const SKILL_LABELS = {
  smarts: 'Smarts',
  clout: 'Clout',
  adaptability: 'Adaptability',
  leverage: 'Leverage',
  endurance: 'Endurance',
};
export const SKILL_LETTERS = { smarts: 'S', clout: 'C', adaptability: 'A', leverage: 'L', endurance: 'E' };
export const SKILL_BLURB = {
  smarts: 'Engineering depth. Unlocks technical builds and architecture plays.',
  clout: 'Social capital. Unlocks pitches, press, and investor rooms.',
  adaptability: 'Hustle and pivots. Unlocks scrappy, opportunistic moves.',
  leverage: 'Negotiating power & execution. Unlocks hardball deals and ownership plays.',
  endurance: 'Physical resilience. Unlocks brutal crunch sprints without collapsing.',
};
export const STARTING_SKILL_POINTS = 10;

// Clock starts Saturday, May 30, 2026 at 7:20 PM (month is 0-indexed).
export const CLOCK_START = { year: 2026, month: 4, day: 30, hour: 19, minute: 20 };

export const START_INVENTORY = ['iPhone', 'MacBook Pro', '3x Pairs of Clothes'];

export const START_SCENE_KEY = 'node_1';

export const GEMINI_MODEL = 'gemini-2.5-flash-preview-09-2025';
export const AI_MAX_RETRIES = 5;
export const AI_BASE_DELAY_MS = 1000;

export const LS_KEY_API = 'gemini_api_key';
export const LS_KEY_SAVE = 'svs_save_v2';

// Every choice costs a little health (the grind). Rest choices (positive health)
// more than offset it. Better homes make rest more efficient — an incentive to
// buy property. Multiplier is applied to positive (restorative) health only.
export const BASE_HEALTH_COST = 3;
export const REST_BONUS = [
  ['Atherton Key', 2.0],
  ['Suburban Home Key', 1.6],
  ['SOMA Loft Key', 1.3],
];

// Manual rest — a resource the player manages from the HUD. Spend more to heal
// more. Health gains scale with the best home you own (REST_BONUS). Resting does
// not advance the story; it just trades money + a little time for health.
export const REST_OPTIONS = [
  { label: 'Nap in Dolores Park',        verb: 'napped in the grass at Dolores Park', heal: 12, cost: 0,    minutes: 120 },
  { label: 'Matinee at the AMC',         verb: 'caught a matinee at the AMC',          heal: 22, cost: 25,   minutes: 180 },
  { label: 'Night out with the team',    verb: 'went out with the team in the Mission',heal: 30, cost: 120,  minutes: 300 },
  { label: 'Weekend spa retreat',        verb: 'booked a weekend spa retreat',         heal: 45, cost: 400,  minutes: 1440 },
  { label: 'Private wellness resort',    verb: 'checked into a private wellness resort',heal: 70, cost: 1500, minutes: 2880 },
];
