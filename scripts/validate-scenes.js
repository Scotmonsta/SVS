// Validates the node graph: every choice target exists, every node is reachable
// from the start, dice branches resolve, and endings are terminal.
import { NODES } from '../src/data/nodes.js';
import { START_SCENE_KEY } from '../src/state/constants.js';

const keys = new Set(Object.keys(NODES));
let errors = 0;
const targetsOf = (n) => (n.choices || []).flatMap((c) => [c.next, c.roll?.success?.next, c.roll?.failure?.next].filter(Boolean));

for (const [k, n] of Object.entries(NODES)) {
  if (n.ending) {
    if (n.choices && n.choices.length) { console.error(`✗ Ending ${k} should have no choices`); errors++; }
    continue;
  }
  if (!n.choices || !n.choices.length) { console.error(`✗ ${k} has no choices`); errors++; }
  for (const t of targetsOf(n)) if (!keys.has(t)) { console.error(`✗ ${k} -> missing "${t}"`); errors++; }
}

// reachability
const reach = new Set([START_SCENE_KEY, 'node_103', 'node_104']); // 103/104 are engine fail-states
let grew = true;
while (grew) { grew = false; for (const k of [...reach]) for (const t of targetsOf(NODES[k] || {})) if (keys.has(t) && !reach.has(t)) { reach.add(t); grew = true; } }
const unreached = [...keys].filter((k) => !reach.has(k));
if (unreached.length) { console.error(`✗ Unreachable: ${unreached.join(', ')}`); errors++; }

console.log(`Validated ${keys.size} nodes.`);
if (errors) { console.error(`\n${errors} problem(s) found.`); process.exit(1); }
console.log('✓ Graph is valid: all targets resolve, all nodes reachable.');
