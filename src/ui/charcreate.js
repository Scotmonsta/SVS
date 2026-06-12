// Character creation: distribute STARTING_SKILL_POINTS across the five skills,
// anywhere from 0..total per skill, and spend them all before launching.

import { $ } from './dom.js';
import { SKILLS, SKILL_LABELS, SKILL_LETTERS, SKILL_BLURB, STARTING_SKILL_POINTS } from '../state/constants.js';

export function initCharCreate(onLaunch) {
  const alloc = SKILLS.reduce((a, s) => ((a[s] = 0), a), {});
  const rows = $('ccRows');
  const remainingEl = $('ccRemaining');
  const startBtn = $('ccStart');
  const valEls = {};

  const spent = () => SKILLS.reduce((sum, s) => sum + alloc[s], 0);

  function refresh() {
    const remaining = STARTING_SKILL_POINTS - spent();
    remainingEl.textContent = String(remaining);
    remainingEl.style.color = remaining === 0 ? '#34d399' : '#fbbf24';
    SKILLS.forEach((s) => {
      valEls[s].text.textContent = String(alloc[s]);
      valEls[s].bar.style.width = `${(alloc[s] / STARTING_SKILL_POINTS) * 100}%`;
      valEls[s].minus.disabled = alloc[s] <= 0;
      valEls[s].plus.disabled = remaining <= 0;
    });
    startBtn.disabled = remaining !== 0;
  }

  rows.replaceChildren();
  SKILLS.forEach((s) => {
    const row = document.createElement('div');
    row.className = 'bg-black/40 border border-gray-700 rounded p-2.5';

    const top = document.createElement('div');
    top.className = 'flex items-center justify-between mb-1.5';

    const name = document.createElement('div');
    name.className = 'flex items-center gap-2';
    name.innerHTML = `<span class="text-amber-400 font-bold text-lg">${SKILL_LETTERS[s]}</span>` +
      `<span class="text-gray-200 font-bold uppercase text-sm tracking-wide">${SKILL_LABELS[s]}</span>`;

    const ctrls = document.createElement('div');
    ctrls.className = 'flex items-center gap-2';
    const minus = mkBtn('−');
    const valText = document.createElement('span');
    valText.className = 'lcd-number text-amber-400 font-bold w-6 text-center';
    valText.textContent = '0';
    const plus = mkBtn('+');
    ctrls.append(minus, valText, plus);

    top.append(name, ctrls);

    const track = document.createElement('div');
    track.className = 'w-full h-2 bg-black border border-gray-800 rounded overflow-hidden';
    const bar = document.createElement('div');
    bar.className = 'h-full bg-amber-500 transition-all';
    bar.style.width = '0%';
    track.appendChild(bar);

    const blurb = document.createElement('p');
    blurb.className = 'text-[11px] text-gray-500 mt-1.5 leading-snug';
    blurb.textContent = SKILL_BLURB[s];

    row.append(top, track, blurb);
    rows.appendChild(row);

    valEls[s] = { text: valText, bar, minus, plus };

    minus.addEventListener('click', () => { if (alloc[s] > 0) { alloc[s]--; refresh(); } });
    plus.addEventListener('click', () => { if (STARTING_SKILL_POINTS - spent() > 0) { alloc[s]++; refresh(); } });
  });

  startBtn.addEventListener('click', () => {
    if (STARTING_SKILL_POINTS - spent() !== 0) return;
    onLaunch({ ...alloc });
  });

  refresh();
}

function mkBtn(label) {
  const b = document.createElement('button');
  b.className = 'w-7 h-7 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-30 ' +
    'border border-gray-600 text-amber-400 font-bold text-lg leading-none flex items-center justify-center';
  b.textContent = label;
  return b;
}

export function showCharCreate() { $('charCreate').classList.remove('hidden'); }
export function hideCharCreate() { $('charCreate').classList.add('hidden'); }
