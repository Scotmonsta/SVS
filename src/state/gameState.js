// The single source of truth for game state.

import {
  START_MONEY, START_HEALTH, MAX_HEALTH, START_INVENTORY,
  CLOCK_START, START_SCENE_KEY, SKILLS, STARTING_SKILL_POINTS,
} from './constants.js';
import { NODES } from '../data/nodes.js';

function freshClock() {
  const c = CLOCK_START;
  return new Date(c.year, c.month, c.day, c.hour, c.minute);
}

function zeroSkills() {
  return SKILLS.reduce((acc, s) => ((acc[s] = 0), acc), {});
}

const state = {
  money: START_MONEY,
  health: START_HEALTH,
  skills: zeroSkills(),
  clock: freshClock(),
  inventory: [...START_INVENTORY],
  journal: [
    {
      time: 'Saturday, May 30, 2026 | 07:20 PM',
      summary: 'Arrived in San Francisco at the Salesforce Transit Center, looking for a fresh start.',
      emotion: 'Ambitious, optimistic, and eager to conquer the Silicon Valley ecosystem.',
    },
  ],
  currentScene: NODES[START_SCENE_KEY],
  visited: new Set([START_SCENE_KEY]),
  isOver: false,
  started: false, // becomes true once skills are allocated
};

export function getState() {
  return state;
}

// --- character creation ---

export function commitSkills(allocation) {
  const total = SKILLS.reduce((sum, s) => sum + (allocation[s] || 0), 0);
  if (total !== STARTING_SKILL_POINTS) return false;
  SKILLS.forEach((s) => { state.skills[s] = allocation[s] || 0; });
  state.started = true;
  return true;
}

// --- mutations ---

export function addMoney(delta) { state.money += delta || 0; }

export function addHealth(delta) {
  state.health = Math.min(MAX_HEALTH, state.health + (delta || 0));
}

export function addSkill(skill, amount = 1) {
  if (state.skills[skill] != null) state.skills[skill] += amount;
}

export function skillVal(skill) { return state.skills[skill] || 0; }

export function hasItem(item) { return state.inventory.includes(item); }
export function addItem(item) { if (item && !state.inventory.includes(item)) state.inventory.push(item); }
export function removeItem(item) { state.inventory = state.inventory.filter((i) => i !== item); }

export function advanceClock(minutes) {
  if (minutes > 0) state.clock.setMinutes(state.clock.getMinutes() + minutes);
}

export function addJournal(entry) { state.journal.push(entry); }
export function setScene(scene) { state.currentScene = scene; }
export function setOver(over) { state.isOver = over; }
export function markVisited(key) { if (key) state.visited.add(key); }
export function hasVisited(key) { return state.visited.has(key); }

// --- serialization ---

export function serialize() {
  return JSON.stringify({
    money: state.money,
    health: state.health,
    skills: state.skills,
    clock: state.clock.getTime(),
    inventory: state.inventory,
    journal: state.journal,
    visited: [...state.visited],
    sceneKey: state.currentSceneKey || null,
    isOver: state.isOver,
    started: state.started,
  });
}

export function restore(raw) {
  const d = JSON.parse(raw);
  state.money = d.money;
  state.health = d.health;
  state.skills = { ...zeroSkills(), ...(d.skills || {}) };
  state.clock = new Date(d.clock);
  state.inventory = d.inventory;
  state.journal = d.journal;
  state.visited = new Set(d.visited || []);
  state.isOver = d.isOver;
  state.started = d.started;
}
