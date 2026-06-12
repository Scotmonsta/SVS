// localStorage persistence: API key + game save. All access is wrapped because
// localStorage throws under the file:// protocol.

import { LS_KEY_API, LS_KEY_SAVE } from './constants.js';
import { serialize, restore } from './gameState.js';

function safeGet(key) {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

// --- API key ---

// Self-healing guard: reject obviously corrupt keys (URL fragments accidentally
// stored, too short, etc.) carried over from the original loadPersistenceConfig.
function looksCorrupt(key) {
  return (
    key.includes('http') ||
    key.includes('fonts.googleapis') ||
    key.includes('css2') ||
    key.includes('/') ||
    key.length < 20
  );
}

export function loadApiKey() {
  const saved = safeGet(LS_KEY_API);
  if (saved && looksCorrupt(saved)) {
    safeRemove(LS_KEY_API);
    return '';
  }
  return saved;
}

export function saveApiKey(key) {
  return safeSet(LS_KEY_API, key.trim());
}

export function clearApiKey() {
  safeRemove(LS_KEY_API);
}

// --- game save (new capability the original never had) ---

export function saveGame() {
  return safeSet(LS_KEY_SAVE, serialize());
}

export function hasSave() {
  return !!safeGet(LS_KEY_SAVE);
}

export function loadGame() {
  const raw = safeGet(LS_KEY_SAVE);
  if (!raw) return false;
  try {
    restore(raw);
    return true;
  } catch {
    return false;
  }
}

export function clearSave() {
  safeRemove(LS_KEY_SAVE);
}
