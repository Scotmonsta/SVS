// Outcome engine: applies a chosen choice's effects, resolves dice, arrives at
// the destination scene, and evaluates win/loss. One generic path — purchases,
// hires, marriages, and rolls are all just effect bundles in the data.

import { TARGET_BALANCE, BASE_HEALTH_COST, REST_BONUS } from '../state/constants.js';
import {
  getState, addMoney, addHealth, addSkill, advanceClock,
  addItem, removeItem, addJournal, setScene, setOver, markVisited, hasItem,
} from '../state/gameState.js';
import { getScene } from './sceneEngine.js';
import { formatDate } from '../ui/dom.js';

// Apply a bundle of effects (used for base choice and for roll branches).
function applyEffects(e) {
  if (!e) return;
  if (e.cost) addMoney(e.cost);
  if (e.health) addHealth(e.health > 0 ? Math.round(e.health * restMultiplier()) : e.health);
  if (e.grant) for (const k in e.grant) addSkill(k, e.grant[k]);
  if (e.add) [].concat(e.add).forEach(addItem);
  if (e.remove) [].concat(e.remove).forEach(removeItem);
}

function journalFor(scene, choice) {
  const summary = scene.title ? `Reached: ${scene.title}.` : 'Made a strategic move.';
  addJournal({
    time: formatDate(getState().clock),
    summary,
    emotion: choice && choice.text ? `Acted on: "${choice.text}"` : 'Pressing forward.',
  });
}

/**
 * Apply a choice and arrive at the next scene.
 * @returns {{ gameOver: {title,message}|null }}
 */
// Best rest multiplier from owned property (incentive to buy nicer homes).
export function restMultiplier() {
  for (const [item, mult] of REST_BONUS) if (hasItem(item)) return mult;
  return 1;
}

// How much a rest option will actually heal, given the home you own.
export function previewHeal(option) {
  return Math.round(option.heal * restMultiplier());
}

// Manual rest: a HUD action the player takes to manage health. Trades money +
// a little time for health. Does NOT change the scene or end the game. Returns
// the realized { heal, cost } so the UI can confirm it.
export function rest(option) {
  const st = getState();
  if (st.isOver) return null;
  if (option.cost > st.money) return null; // can't afford
  const before = st.health;
  addMoney(-option.cost);
  advanceClock(option.minutes || 0);
  addHealth(Math.round(option.heal * restMultiplier()));
  const gained = st.health - before;
  addJournal({
    time: formatDate(st.clock),
    summary: `Rested: ${st.health}/100 health.`,
    emotion: `You ${option.verb} (+${gained} health, -$${option.cost.toLocaleString()}).`,
  });
  return { gained, cost: option.cost };
}

// Apply a health delta with the grind/rest rules: every action costs a baseline,
// and restorative (positive) health scales with the home you own.
function applyHealthChange(delta) {
  addHealth(-BASE_HEALTH_COST); // the grind — every choice tires you a little
  if (!delta) return;
  if (delta > 0) addHealth(Math.round(delta * restMultiplier()));
  else addHealth(delta);
}

export function applyChoice(choice) {
  // Base effects.
  if (choice.cost) addMoney(choice.cost);
  advanceClock(choice.time || 0);
  applyHealthChange(choice.health || 0);
  if (choice.grant) for (const k in choice.grant) addSkill(k, choice.grant[k]);
  if (choice.add) [].concat(choice.add).forEach(addItem);
  if (choice.remove) [].concat(choice.remove).forEach(removeItem);

  // Resolve destination (with dice if present).
  let nextKey;
  if (choice.roll) {
    const win = Math.random() * 100 < choice.roll.pct;
    const branch = win ? choice.roll.success : choice.roll.failure;
    applyEffects(branch);
    nextKey = branch.next;
  } else {
    nextKey = choice.next;
  }

  const st = getState();

  // Fail-states and the victory target take priority over the chosen destination.
  if (st.health <= 0) {
    nextKey = 'node_104'; // burnout
  } else if (st.money <= 0) {
    nextKey = 'node_103'; // bankruptcy
  } else if (st.money >= TARGET_BALANCE) {
    nextKey = 'node_100'; // hitting the target wins outright (the IPO)
  }

  return arrive(nextKey, choice);
}

// Move to a node, mark visited, journal, evaluate endings.
export function arrive(key, choice = null) {
  const scene = getScene(key);
  setScene(scene);
  markVisited(key);
  journalFor(scene, choice);

  const st = getState();
  let gameOver = null;

  if (scene.ending) {
    gameOver = { title: scene.ending.label, message: scene.text };
  } else if (st.health <= 0) {
    const e = getScene('node_104');
    setScene(e);
    gameOver = { title: e.ending.label, message: e.text };
  } else if (st.money <= 0) {
    const e = getScene('node_103');
    setScene(e);
    gameOver = { title: e.ending.label, message: e.text };
  } else if (st.money >= TARGET_BALANCE) {
    const e = getScene('node_100');
    setScene(e);
    markVisited('node_100');
    gameOver = { title: e.ending.label, message: e.text };
  }

  if (gameOver) setOver(true);
  return { gameOver };
}
