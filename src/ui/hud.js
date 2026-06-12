// HUD: wallet, health, S.C.A.L.E. skills, clock, location label, narrative box.

import { $, setText, formatDate } from './dom.js';
import { getState } from '../state/gameState.js';
import { SKILLS, SKILL_LETTERS, SKILL_LABELS, MAX_HEALTH } from '../state/constants.js';

const LOCATION_BY_TAG = [
  ['hacker_house', 'SOMA Hacker House'],
  ['mixer', 'North Beach Mixer'],
  ['social', 'North Beach Mixer'],
  ['library', 'Stanford CS Library'],
  ['trail', 'Stanford Dish Trail'],
  ['park_campus', 'Palo Alto / Dolores Park'],
  ['park', 'Dolores Park SF'],
  ['campus', 'Stanford Campus'],
  ['office', 'Sand Hill VC Office'],
  ['cafe', 'University Ave Cafe'],
  ['hinge_phone', 'Hinge Date'],
  ['hinge', 'Hinge Date'],
  ['estate', 'Atherton Estate'],
  ['yacht', 'Sausalito Megayacht'],
  ['ipo', 'NASDAQ — Times Square'],
  ['hospital', 'SF General Hospital'],
  ['skyline', 'San Francisco Skyline'],
  ['transit', 'Salesforce Transit Center'],
];

function locationFor(tags) {
  for (const [tag, label] of LOCATION_BY_TAG) if (tags.includes(tag)) return label;
  return 'Salesforce Transit Center';
}

function healthColor(h) {
  if (h > 60) return '#34d399';   // emerald
  if (h > 30) return '#fbbf24';   // amber
  return '#ef4444';               // red
}

export function renderHud() {
  const { money, health, skills, clock, currentScene } = getState();
  setText($('hudWallet'), `$${money.toLocaleString()}`);
  setText($('hudTime'), formatDate(clock));
  setText($('hudLocation'), locationFor(currentScene.tags || []));
  setText($('narrativeText'), currentScene.text);

  // Health bar
  const pct = Math.max(0, Math.min(100, (health / MAX_HEALTH) * 100));
  const bar = $('hudHealthBar');
  const val = $('hudHealthVal');
  if (bar) { bar.style.width = `${pct}%`; bar.style.backgroundColor = healthColor(health); }
  if (val) setText(val, String(Math.max(0, Math.round(health))));

  // Skills strip
  const strip = $('hudSkills');
  if (strip) {
    strip.replaceChildren();
    SKILLS.forEach((s) => {
      const chip = document.createElement('div');
      chip.className = 'flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/50 border border-gray-700';
      chip.title = SKILL_LABELS[s];
      const letter = document.createElement('span');
      letter.className = 'text-amber-400 font-bold text-xs';
      letter.textContent = SKILL_LETTERS[s];
      const num = document.createElement('span');
      num.className = 'text-gray-200 font-mono text-xs';
      num.textContent = String(skills[s] ?? 0);
      chip.append(letter, num);
      strip.appendChild(chip);
    });
  }
}
