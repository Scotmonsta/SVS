// Scene lookup over the node graph.

import { NODES } from '../data/nodes.js';
import { START_SCENE_KEY } from '../state/constants.js';

export function getScene(key) {
  const scene = NODES[key];
  if (!scene) {
    console.warn(`[sceneEngine] Unknown node "${key}" — falling back to start.`);
    return NODES[START_SCENE_KEY];
  }
  return scene;
}

// Offline free-text routing: map keywords to a sensible node so custom actions
// still do something coherent without the AI.
const KEYWORD_ROUTES = [
  { words: ['code', 'build', 'refactor', 'engineer', 'ship'], to: 'node_12' },
  { words: ['pitch', 'vc', 'raise', 'invest', 'fund'], to: 'node_26' },
  { words: ['mixer', 'network', 'party', 'meet'], to: 'node_3' },
  { words: ['sales', 'cold', 'outbound', 'customer', 'deal'], to: 'node_20' },
  { words: ['hinge', 'date', 'partner', 'design'], to: 'node_6' },
  { words: ['rest', 'sleep', 'recover', 'health', 'gym', 'run'], to: 'node_7' },
  { words: ['stanford', 'palo alto', 'recruit'], to: 'node_5' },
];

export function resolveCustomActionKey(actionText) {
  const t = actionText.toLowerCase();
  const route = KEYWORD_ROUTES.find((r) => r.words.some((w) => t.includes(w)));
  return route ? route.to : 'node_10';
}
