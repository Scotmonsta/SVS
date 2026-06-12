# Silicon Valley Simulator: 1990 Edition

A retro choose-your-own-adventure startup sim. You arrive in San Francisco with
$10,000, 100 health, and a half-finished database prototype, and try to claw your
way to one of several exits — a parabolic IPO, an M&A buyout, a bootstrapped
empire, or a quiet family legacy — without going bankrupt or burning out.

Runs entirely on a built-in offline scene graph. An optional Gemini API key adds
AI narrative *flavor* (the offline engine still drives all state and routing).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run validate # check the node graph (targets resolve, all nodes reachable)
```

## Gameplay systems

- **S.C.A.L.E. skills** — Smarts, Clout, Adaptability, Leverage, Endurance. You
  distribute **10 points** at character creation (anywhere, 0–10 each, spend them
  all). Many choices are gated behind skill thresholds and grant more skill as
  you play. Locked choices stay visible (greyed, with the requirement shown) so
  you can see what to build toward.
- **Health (0–100)** — crunch sprints and trail runs cost it, rest restores it
  (capped at 100). Hitting **0 ends the game** in burnout (Ending E). Shown in the
  HUD with a colored gauge.
- **Dice rolls** — some choices resolve probabilistically (e.g. `🎲 45%`), routing
  to different scenes with different effects on success vs failure.
- **Inventory chain** — meeting a design partner, marrying them (earns a Wedding
  Ring + Spouse), buying property (earns Keys that unlock scenes), adopting a dog
  or cat, and hiring Sarah all gate later choices and endings. The family-legacy
  ending requires a spouse; the Stanford recruiting bonus requires the dog; etc.
- **Six endings** — A: IPO ($100M wallet), B: M&A buyout, C: bootstrapped
  lifestyle, D: bankruptcy (money ≤ 0), E: burnout (health ≤ 0), F: family legacy.

## Architecture

```
src/
  state/      constants, gameState (skills/health/inventory), persistence (save/load)
  data/       nodes.js (the 69-scene content graph), inventory.js (icons)
  engine/     sceneEngine (lookup), rules (choice gating + ordering), outcome (effects, dice, endings)
  render/     renderer (cached gradient + tag→backdrop registry), backdrops (procedural 8-bit art)
  ui/         hud, choices, modals, charcreate, dom helpers
  ai/         optional Gemini narrative reskin
```

Organizing rule: **data in `data/`, behavior in `engine/`, pixels in `render/`,
DOM in `ui/`, truth in `state/`.** To add a scene, add a node to `data/nodes.js`
and run `npm run validate` — no engine changes needed.
