// Inventory item -> emoji icon. First matching substring wins; falls back to 💻.
// Order matters: list more specific needles before generic ones.

export const ITEM_ICONS = [
  ['Wedding Ring', '💍'],
  ['Spouse', '💑'],
  ['Partner', '❤️'],
  ['Loft Cohabitant', '🏠'],
  ['Family Trust', '🏦'],
  ['VP of Sales', '🧑‍💼'],
  ['Sarah', '🧑‍💼'],
  ['Lead CS Researcher', '🔬'],
  ['Researcher', '🔬'],
  ['Loyal Dog', '🐶'],
  ['Bengal Cat', '🐱'],
  ['Suburban Home Key', '🏡'],
  ['Atherton Key', '🏰'],
  ['Yacht Key', '🚢'],
  ['SOMA Loft Key', '🏢'],
  ['Key', '🔑'],
  ['iPhone', '📱'],
  ['MacBook', '💻'],
  ['Clothes', '👔'],
  ['Ring', '💍'],
  ['Dog', '🐶'],
  ['Cat', '🐱'],
  ['Loft', '🏢'],
  ['Home', '🏡'],
  ['Estate', '🏰'],
  ['Yacht', '🚢'],
  ['Cohabitant', '🏠'],
];

export function iconFor(item) {
  const hit = ITEM_ICONS.find(([needle]) => item.includes(needle));
  return hit ? hit[1] : '💼';
}
