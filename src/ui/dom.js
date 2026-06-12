// Small DOM utilities. The escaping helpers close the XSS hole where AI output
// and the player's own custom-action text flowed unescaped into innerHTML.

export const $ = (id) => document.getElementById(id);

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Set text safely (no HTML interpretation at all).
export function setText(el, text) {
  el.textContent = text;
}

// Build a child element and append. Avoids `innerHTML +=` in loops (which
// re-parses the whole container every iteration).
export function appendEl(parent, tag, { className, text, html, onClick, attrs } = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text != null) el.textContent = text;
  if (html != null) el.innerHTML = html; // only for trusted, escaped strings
  if (onClick) el.addEventListener('click', onClick);
  if (attrs) for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  parent.appendChild(el);
  return el;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function formatDate(date) {
  const day = DAYS[date.getDay()];
  const month = MONTHS[date.getMonth()];
  const dayNum = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const mins = String(date.getMinutes()).padStart(2, '0');
  return `${day}, ${month} ${dayNum}, ${year} | ${String(hours).padStart(2, '0')}:${mins} ${ampm}`;
}
