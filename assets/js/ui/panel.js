import { formatYear } from '../core/coords.js';
import { CIVS } from '../data/civilizations.js';
import { EVENTS } from '../data/events.js';
import { REGIONS } from '../data/regions.js';
import { loadImage } from './imageLoader.js';
import { CIV_IMG, EVENT_IMG, CIV_ICONS, DEFAULT_ICON } from '../data/images.js';

let onNavigate = null;
export function initPanel(navFn) {
  onNavigate = navFn;
  document.querySelector('.panel-close').addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
}

export function openPanel(data) {
  const panel = document.getElementById('info-panel');
  document.getElementById('panel-title').textContent = data.name;
  document.getElementById('panel-dates').textContent = data.end != null
    ? `${formatYear(data.start)} — ${formatYear(data.end)}` : formatYear(data.start);

  const url = data.id ? CIV_IMG(data.id) : EVENT_IMG(data.name);
  loadImage(document.getElementById('panel-hero'), document.getElementById('panel-fb'),
    url, data.color || '#daa520', (data.id && CIV_ICONS[data.id]) || DEFAULT_ICON, data.name);

  let html = `<p>${data.desc || ''}</p>`;
  if (!data.isEvent) {
    const dur = data.end - data.start;
    html += `<p class="muted">Duración aproximada: <strong>${dur.toLocaleString('es')} años</strong></p>`;
    html += `<div class="tags"><span class="tag">${REGIONS[data.region]?.name || ''}</span></div>`;
    const contemp = CIVS.filter(c => c.id !== data.id && c.start < data.end && c.end > data.start);
    if (contemp.length) {
      html += `<p class="muted strong">Contemporáneas:</p><div class="tags">`;
      contemp.forEach(c => html += `<span class="tag link" data-civ="${c.id}" style="border-color:${c.color}">${c.name}</span>`);
      html += `</div>`;
    }
    const evs = EVENTS.filter(ev => ev.year >= data.start && ev.year <= data.end);
    if (evs.length) {
      html += `<p class="muted strong">Eventos del período:</p>`;
      evs.forEach(ev => html += `<p class="ev"><strong>${formatYear(ev.year)}</strong> — ${ev.name}</p>`);
    }
  }
  const body = document.getElementById('panel-body');
  body.innerHTML = html;
  body.querySelectorAll('.tag.link').forEach(t =>
    t.addEventListener('click', () => onNavigate && onNavigate(t.dataset.civ)));
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
}

export function closePanel() {
  const p = document.getElementById('info-panel');
  p.classList.remove('open'); p.setAttribute('aria-hidden', 'true');
}
