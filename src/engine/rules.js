// Choice gating and ordering. Each choice may carry a `req` gate. Locked choices
// stay visible (greyed, with the requirement shown) so players see what to aim
// for. Available choices are ordered unseen-first; locked choices sink to the
// bottom. Nothing is removed, so no path is ever lost.

import { getState, hasVisited, skillVal, hasItem } from '../state/gameState.js';
import { SKILL_LABELS } from '../state/constants.js';

const MAX_CHOICES = 6;

export function evalReq(req) {
  if (!req) return { ok: true, label: '' };
  if (req.skill != null) {
    return { ok: skillVal(req.skill) >= req.min, label: `${SKILL_LABELS[req.skill]} ≥ ${req.min}` };
  }
  if (req.item != null) {
    return { ok: hasItem(req.item), label: `Requires: ${req.item}` };
  }
  if (req.money != null) {
    return { ok: getState().money >= req.money, label: `Requires $${req.money.toLocaleString()}` };
  }
  return { ok: true, label: '' };
}

export function buildChoices(scene) {
  const decorated = (scene.choices || []).map((c, i) => {
    const r = evalReq(c.req);
    const dest = c.next || c.roll?.success?.next; // for `seen` hinting
    return {
      ...c,
      _i: i,
      locked: !r.ok,
      lockLabel: r.label,
      seen: dest ? hasVisited(dest) : false,
    };
  });

  // Rank: available+unseen, available+seen, locked (stable within each group).
  const rank = (c) => (c.locked ? 2 : c.seen ? 1 : 0);
  decorated.sort((a, b) => rank(a) - rank(b) || a._i - b._i);

  return decorated.slice(0, MAX_CHOICES);
}
