// AI prompt construction, isolated from control flow.

import { getState } from '../state/gameState.js';

export function buildChoicePrompt(previousText, actionText) {
  const { inventory, money } = getState();
  return `
Generate the next sequential branch for 'Silicon Valley Simulator'.
Previous Situation: "${previousText}"
Player Decision: "${actionText}"
Player Inventory: ${JSON.stringify(inventory)}
Player Balance: $${money}

STRICT UNLOCK LAWS:
1. Player is single at start. No "wife"/"spouse" unless 'Wedding Ring' is in inventory.
2. Marriage only if 'Partner (Stripe Designer)' is in inventory and 'Wedding Ring' is not.
3. Cannot hire 'VP of Sales (Sarah)' again if already in inventory.
4. Moving in together REQUIRES 'SOMA Loft Key'. If missing, block or redirect.
5. Hosting a yacht event REQUIRES 'Yacht Key'. If missing, force the yacht investment first.
6. Walking Stanford with a puppy to recruit PhDs requires 'Loyal Dog'; without it the option recruits CS students with a weaker outcome.

INSTRUCTIONS:
1. Output EXACTLY 5 choices: (1) direct action, (2) strategic alternative,
   (3) inventory action that stays in-scene and reveals intel, (4) high-risk wildcard,
   (5) domestic/life wildcard.
2. Write an engaging 3-sentence narrative continuing from the decision.
3. Keep financial costs realistic.
4. Match the JSON schema exactly.
`;
}

export function buildCustomPrompt(previousText, action) {
  const { inventory, money } = getState();
  return `
Player balance: $${money}
Player inventory: ${JSON.stringify(inventory)}
Situation: '${previousText}'
Action: '${action}'

Rules:
1. If the action means leaving SF, quitting, or is off-theme (magic/combat), set is_game_over true.
2. Otherwise simulate the consequence within the Bay Area startup ecosystem.
3. Free tasks (thinking, walking) = 0 money. Cheap (bus, coffee) = -2 to -15. Expensive (hiring, rent) = -500 to -3000.
4. Include aesthetic visual tags.
`;
}
