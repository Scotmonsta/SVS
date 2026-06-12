// Overlay modals (journal, inventory, config), the canvas loader/banner, and
// game-over handling. All list rendering uses fragments, not innerHTML loops.

import { $, setText, appendEl } from './dom.js';
import { getState } from '../state/gameState.js';
import { iconFor } from '../data/inventory.js';
import { disableChoices } from './choices.js';
import { rest, previewHeal } from '../engine/outcome.js';
import { renderHud } from './hud.js';
import { REST_OPTIONS, MAX_HEALTH } from '../state/constants.js';

// --- loader / banner over the canvas ---

export function showLoader(title, message) {
  $('overlayTitle').textContent = title;
  $('overlayMessage').textContent = message;
  $('overlaySpinner').classList.remove('hidden');
  $('btnPlayAgain').classList.add('hidden');
  $('canvasOverlay').classList.remove('hidden');
}

export function hideLoader() {
  $('canvasOverlay').classList.add('hidden');
}

export function showGameOver(title, message) {
  $('overlayTitle').textContent = title;
  $('overlayMessage').textContent = message;
  $('overlaySpinner').classList.add('hidden');
  $('btnPlayAgain').classList.remove('hidden');
  $('canvasOverlay').classList.remove('hidden');
  const input = $('customInput');
  input.disabled = true;
  input.blur();
  disableChoices();
}

// --- tabbed modal ---

export function openTab(tab) {
  const modal = $('popupModal');
  const views = { journal: $('journalView'), inventory: $('inventoryView'), config: $('configView'), rest: $('restView') };
  modal.classList.remove('hidden');
  Object.entries(views).forEach(([name, el]) => el.classList.toggle('hidden', name !== tab));

  if (tab === 'journal') renderJournal();
  else if (tab === 'inventory') renderInventory();
  else if (tab === 'rest') renderRest();
}

export function closeModal() {
  $('popupModal').classList.add('hidden');
}

function renderRest() {
  const st = getState();
  setText($('restCurrentHealth'), String(Math.max(0, Math.round(st.health))));
  const container = $('restOptions');
  container.replaceChildren();
  const full = st.health >= MAX_HEALTH;

  REST_OPTIONS.forEach((opt) => {
    const heal = previewHeal(opt);
    const unaffordable = opt.cost > st.money;
    const disabled = full || unaffordable || st.isOver;

    const btn = document.createElement('button');
    btn.className =
      'w-full text-left border-2 p-2.5 rounded transition flex items-center justify-between gap-3 ' +
      (disabled
        ? 'border-gray-800 bg-gray-900/60 text-gray-600 cursor-not-allowed'
        : 'border-emerald-800 bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-100');
    btn.disabled = disabled;

    const left = document.createElement('span');
    const name = document.createElement('span');
    name.className = 'block text-sm font-bold';
    name.textContent = opt.label;
    const sub = document.createElement('span');
    sub.className = 'block text-[11px] ' + (unaffordable ? 'text-red-400' : 'text-emerald-400/80');
    sub.textContent = `+${heal} health` + (opt.cost ? `  ·  -$${opt.cost.toLocaleString()}` : '  ·  free');
    left.append(name, sub);

    const arrow = document.createElement('span');
    arrow.className = 'text-lg shrink-0';
    arrow.textContent = disabled ? '🔒' : '❤️';

    btn.append(left, arrow);
    if (!disabled) {
      btn.addEventListener('click', () => {
        rest(opt);
        renderHud();
        renderRest(); // refresh affordability + health
      });
    }
    container.appendChild(btn);
  });

  if (full) {
    const note = document.createElement('p');
    note.className = 'text-xs text-emerald-400 mt-3 text-center';
    note.textContent = 'You are at full health.';
    container.appendChild(note);
  }
}

function renderJournal() {
  const container = $('journalTimeline');
  container.replaceChildren();
  const frag = document.createDocumentFragment();
  const { journal } = getState();

  journal.forEach((entry) => {
    const wrap = document.createElement('div');
    wrap.className = 'border-l-2 border-amber-500 pl-3 py-1 ml-1 relative';
    appendEl(wrap, 'span', { className: 'absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500' });
    appendEl(wrap, 'div', { className: 'text-xs text-blue-400 font-bold mb-0.5', text: entry.time });
    appendEl(wrap, 'p', { className: 'text-sm text-gray-300', text: entry.summary });
    frag.appendChild(wrap);
  });
  container.appendChild(frag);

  setText($('journalEmotion'), journal[journal.length - 1].emotion);
}

function renderInventory() {
  const container = $('inventoryGrid');
  container.replaceChildren();
  const frag = document.createDocumentFragment();

  getState().inventory.forEach((item) => {
    const card = document.createElement('div');
    card.className =
      'bg-gray-800 border border-gray-700 p-3 rounded-lg flex flex-col items-center ' +
      'justify-center text-center shadow-md animate-fadeIn';
    appendEl(card, 'span', { className: 'text-3xl mb-1', text: iconFor(item) });
    appendEl(card, 'span', { className: 'text-xs text-gray-400 font-bold tracking-wider uppercase', text: item });
    frag.appendChild(card);
  });
  container.appendChild(frag);
}
