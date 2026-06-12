// Entry point / controller. Owns the game flow and wires the modules together.

import './styles/main.css';

import { getState, commitSkills } from './state/gameState.js';
import { loadApiKey, saveApiKey, clearApiKey, saveGame, hasSave, loadGame, clearSave } from './state/persistence.js';

import { resolveCustomActionKey } from './engine/sceneEngine.js';
import { buildChoices } from './engine/rules.js';
import { applyChoice, arrive } from './engine/outcome.js';

import { runAITransition } from './ai/geminiClient.js';
import { buildChoicePrompt, buildCustomPrompt } from './ai/prompts.js';

import { initRenderer, startLoop, onSceneChanged } from './render/renderer.js';
import { renderHud } from './ui/hud.js';
import { renderChoices } from './ui/choices.js';
import { showLoader, hideLoader, showGameOver, openTab, closeModal } from './ui/modals.js';
import { initCharCreate, showCharCreate, hideCharCreate } from './ui/charcreate.js';
import { $, setText } from './ui/dom.js';

let apiKey = '';

// --- rendering refresh ---

function refresh() {
  renderHud();
  onSceneChanged();
  renderChoices(buildChoices(getState().currentScene), handleChoiceSelect);
}

function finishTurn(result) {
  refresh();
  saveGame(); // autosave
  if (result && result.gameOver) showGameOver(result.gameOver.title, result.gameOver.message);
}

// Optional AI narrative reskin: the offline engine stays authoritative for all
// state and routing; AI only rewrites the arrived scene's prose, with graceful
// fallback to the authored text on any error.
async function maybeReskin(previousText, choiceText) {
  if (!apiKey) return;
  try {
    const scene = await runAITransition(apiKey, buildChoicePrompt(previousText, choiceText));
    if (scene && typeof scene.text === 'string' && scene.text.length > 20) {
      getState().currentScene = { ...getState().currentScene, text: scene.text };
      renderHud();
    }
  } catch (err) {
    console.warn('AI reskin failed; keeping offline narrative.', err);
  }
}

// --- choice handling ---

async function handleChoiceSelect(index) {
  const st = getState();
  if (st.isOver || !st.started) return;

  const selected = buildChoices(st.currentScene)[index];
  if (!selected || selected.locked) return;

  const previousText = st.currentScene.text;
  const busy = !!apiKey;
  if (busy) showLoader('PROCESSING TRANSITION', 'Simulating economic and skill progression...');

  // Engine is authoritative.
  const result = applyChoice(selected);

  const finish = async () => {
    if (!result.gameOver) await maybeReskin(previousText, selected.text);
    if (busy) hideLoader();
    finishTurn(result);
  };

  if (busy) finish();
  else { showLoader('OFFLINE TRANSITION', 'Resolving outcome...'); setTimeout(() => { hideLoader(); finish(); }, 350); }
}

async function handleCustomAction(event) {
  event.preventDefault();
  const st = getState();
  if (st.isOver || !st.started) return;

  const input = $('customInput');
  const action = input.value.trim();
  if (!action) return;
  input.value = '';

  if (/^[1-6]$/.test(action)) return handleChoiceSelect(Number(action) - 1);

  const previousText = st.currentScene.text;
  const key = resolveCustomActionKey(action);

  showLoader(apiKey ? 'PROCESSING TRANSITION' : 'OFFLINE TRANSITION', 'Parsing custom strategic move...');
  const result = arrive(key, { text: action });

  const finish = async () => {
    if (!result.gameOver && apiKey) {
      try {
        const scene = await runAITransition(apiKey, buildCustomPrompt(previousText, action));
        if (scene && scene.text) { getState().currentScene = { ...getState().currentScene, text: scene.text }; }
      } catch (err) { console.warn('AI custom reskin failed.', err); }
    }
    hideLoader();
    finishTurn(result);
  };
  if (apiKey) finish();
  else setTimeout(() => finish(), 350);
}

// --- config (API key) ---

function updateApiStatus() {
  const dot = $('apiStatusDot');
  const text = $('apiStatusText');
  if (apiKey) {
    dot.className = 'w-2 h-2 rounded-full bg-emerald-500';
    setText(text, 'API key configured. AI narrative flavor enabled (offline engine still drives the game).');
  } else {
    dot.className = 'w-2 h-2 rounded-full bg-amber-500 animate-pulse';
    setText(text, 'No key configured. Using the offline engine (fully playable).');
  }
}

function onSaveKey() {
  const value = $('apiKeyInput').value.trim();
  if (saveApiKey(value)) apiKey = value;
  updateApiStatus();
}
function onClearKey() { clearApiKey(); apiKey = ''; $('apiKeyInput').value = ''; updateApiStatus(); }

// --- start / resume ---

function launchGame(allocation) {
  if (!commitSkills(allocation)) return;
  hideCharCreate();
  refresh();
  saveGame();
}

function resetGame() {
  clearSave();
  window.location.reload();
}

function wireEvents() {
  $('customForm').addEventListener('submit', handleCustomAction);
  $('btnPlayAgain').addEventListener('click', resetGame);
  $('btnRest').addEventListener('click', () => { if (getState().started) openTab('rest'); });
  $('btnJournal').addEventListener('click', () => openTab('journal'));
  $('btnInventory').addEventListener('click', () => openTab('inventory'));
  $('btnConfig').addEventListener('click', () => { openTab('config'); $('apiKeyInput').value = apiKey; updateApiStatus(); });
  $('btnCloseModal').addEventListener('click', closeModal);
  $('btnSaveKey').addEventListener('click', onSaveKey);
  $('btnClearKey').addEventListener('click', onClearKey);

  document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT') return;
    const k = e.key.toLowerCase();
    if (k === 'j') openTab('journal');
    else if (k === 'i') openTab('inventory');
    else if (k === 'r') { if (getState().started) openTab('rest'); }
    else if (k === 's') openTab('config');
    else if (k === 'escape') closeModal();
  });
}

function init() {
  apiKey = loadApiKey();
  initRenderer($('retroCanvas'));
  startLoop();
  wireEvents();
  updateApiStatus();
  initCharCreate(launchGame);

  // Resume a started game if a valid v2 save exists; otherwise character creation.
  let resumed = false;
  if (hasSave()) {
    try { loadGame(); resumed = getState().started; } catch { resumed = false; clearSave(); }
  }

  if (resumed) {
    refresh();
    if (getState().isOver && getState().currentScene.ending) {
      showGameOver(getState().currentScene.ending.label, getState().currentScene.text);
    }
  } else {
    showCharCreate();
  }
}

window.addEventListener('DOMContentLoaded', init);
