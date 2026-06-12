// Renders choice buttons. Builds a DocumentFragment and appends once (no
// `innerHTML +=` in a loop). Choice text is set via textContent (XSS-safe).

import { $ } from './dom.js';
import { SKILL_LABELS } from '../state/constants.js';

// Price tag + gamble odds only — never the reward, so the player trusts their gut.
function effectHints(choice) {
  const parts = [];
  if (choice.cost && choice.cost < 0) parts.push({ text: `-$${Math.abs(choice.cost).toLocaleString()}`, cls: 'text-gray-300' });
  if (choice.roll) parts.push({ text: `🎲 ${choice.roll.pct}%`, cls: 'text-gray-300' });
  return parts;
}

// Requirement pill, shown on EVERY gated choice (met = colored, locked = red), so
// the player can see which options their skills/assets are unlocking.
function reqPill(choice) {
  const r = choice.req;
  if (!r) return null;
  const locked = choice.locked;
  if (r.skill != null) {
    return { text: `${locked ? '🔒 ' : '◆ '}${SKILL_LABELS[r.skill]} ${r.min}`, cls: locked ? 'text-red-400' : 'text-amber-400 font-bold' };
  }
  if (r.item != null) {
    return { text: `${locked ? '🔒 ' : '🔑 '}${r.item}`, cls: locked ? 'text-red-400' : 'text-emerald-400' };
  }
  if (r.money != null && !(choice.cost && choice.cost < 0)) {
    return { text: `${locked ? '🔒 ' : '💵 '}needs $${r.money.toLocaleString()}`, cls: locked ? 'text-red-400' : 'text-blue-300' };
  }
  return null;
}

export function renderChoices(choices, onSelect) {
  const container = $('choicesContainer');
  container.replaceChildren();

  const frag = document.createDocumentFragment();
  choices.forEach((choice, index) => {
    const btn = document.createElement('button');
    const textCls = choice.locked ? 'text-gray-500' : choice.seen ? 'text-gray-200' : 'text-white';
    const borderCls = choice.locked
      ? 'border-gray-800 bg-gray-900/60 cursor-not-allowed'
      : 'border-gray-600 bg-gray-800 hover:bg-gray-700 hover:border-amber-500';
    btn.className = `w-full text-left border-2 p-2.5 rounded transition text-sm flex items-start gap-2.5 group animate-fadeIn ${borderCls} ${textCls}`;
    btn.disabled = !!choice.locked;
    if (!choice.locked) btn.addEventListener('click', () => onSelect(index));

    const badge = document.createElement('span');
    badge.className = choice.locked
      ? 'bg-gray-800 text-gray-600 font-bold px-1.5 py-0.5 rounded text-xs shrink-0 mt-0.5'
      : 'bg-gray-900 text-amber-400 font-bold px-1.5 py-0.5 rounded text-xs shrink-0 mt-0.5 group-hover:bg-amber-500 group-hover:text-black';
    badge.textContent = choice.locked ? '🔒' : String(index + 1);

    const body = document.createElement('span');
    body.className = 'flex-grow';

    const label = document.createElement('span');
    label.className = 'block leading-snug';
    label.textContent = choice.text;
    body.appendChild(label);

    // meta line: requirement pill (always, if gated) + price + dice odds
    const pills = [];
    const rp = reqPill(choice);
    if (rp) pills.push(rp);
    pills.push(...effectHints(choice));
    if (pills.length) {
      const meta = document.createElement('span');
      meta.className = 'flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[11px] tracking-wide';
      pills.forEach((p) => {
        const s = document.createElement('span');
        s.className = p.cls;
        s.textContent = p.text;
        meta.appendChild(s);
      });
      body.appendChild(meta);
    }

    btn.append(badge, body);

    if (choice.seen && !choice.locked) {
      const seenTag = document.createElement('span');
      seenTag.className = 'text-[9px] uppercase tracking-wider text-gray-500 shrink-0 mt-0.5';
      seenTag.textContent = '↩ seen';
      btn.appendChild(seenTag);
    }

    frag.appendChild(btn);
  });
  container.appendChild(frag);
}

export function disableChoices() {
  $('choicesContainer').querySelectorAll('button').forEach((b) => (b.disabled = true));
}
