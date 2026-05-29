import { formatYear } from '../core/coords.js';
import { loadImage } from './imageLoader.js';
import { CIV_IMG, EVENT_IMG, CIV_ICONS, DEFAULT_ICON } from '../data/images.js';

let el;
function ensure() {
  if (el) return el;
  el = document.createElement('div');
  el.id = 'tooltip';
  el.innerHTML = `<img class="tt-img" referrerpolicy="no-referrer"><div class="tt-fb"></div>
    <div class="tt-title"></div><div class="tt-dates"></div><div class="tt-desc"></div>`;
  document.body.appendChild(el);
  return el;
}

export function showTooltip(e, data) {
  ensure();
  el.querySelector('.tt-title').textContent = data.name;
  el.querySelector('.tt-dates').textContent = data.end != null
    ? `${formatYear(data.start)} — ${formatYear(data.end)}` : formatYear(data.start);
  el.querySelector('.tt-desc').textContent = data.desc || '';
  const url = data.id ? CIV_IMG(data.id) : EVENT_IMG(data.name);
  const icon = (data.id && CIV_ICONS[data.id]) || DEFAULT_ICON;
  loadImage(el.querySelector('.tt-img'), el.querySelector('.tt-fb'), url, data.color, icon, data.name);
  el.style.display = 'block';
  moveTooltip(e);
}

export function moveTooltip(e) {
  if (!el) return;
  let x = e.clientX + 16, y = e.clientY + 16;
  if (x + 320 > innerWidth) x = e.clientX - 320;
  if (y + 220 > innerHeight) y = e.clientY - 220;
  el.style.left = x + 'px'; el.style.top = y + 'px';
}

export function hideTooltip() { if (el) el.style.display = 'none'; }
