import { formatYear } from '../core/coords.js';
import { CIVS } from '../data/civilizations.js';
import { EVENTS } from '../data/events.js';
import { regionById } from '../data/regions.js';
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

  let html = `<p class="pdesc">${data.desc || ''}</p>`;
  if (!data.isEvent) {
    const dur = data.end - data.start;
    html += `<p class="muted">Duración aproximada: <strong>${dur.toLocaleString('es')} años</strong></p>`;
    html += `<div class="tags"><span class="tag">${regionById(data.region)?.name || ''}</span></div>`;
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
  if (data.source) {
    html += `<p class="src"><a href="${data.source}" target="_blank" rel="noopener">Fuente: Wikipedia ↗</a></p>`;
  }
  const body = document.getElementById('panel-body');
  body.innerHTML = html;
  body.querySelectorAll('.tag.link').forEach(t =>
    t.addEventListener('click', () => onNavigate && onNavigate(t.dataset.civ)));
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');

  // Eventos con fuente: imagen (y, si no hay texto curado, resumen) en vivo de Wikipedia.
  if (data.isEvent && data.source) loadWikiSummary(data.source, !!(data.desc && data.desc.trim()));
}

async function loadWikiSummary(sourceUrl, keepDesc) {
  try {
    const raw = sourceUrl.split('/wiki/')[1];
    if (!raw) return;
    const title = encodeURIComponent(decodeURIComponent(raw));
    const r = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${title}`);
    if (!r.ok) return;
    const s = await r.json();
    const p = document.querySelector('#panel-body .pdesc');
    if (!keepDesc && p && s.extract) p.textContent = s.extract;
    if (s.thumbnail && s.thumbnail.source) {
      const hero = document.getElementById('panel-hero');
      const fb = document.getElementById('panel-fb');
      hero.onload = () => { hero.style.display = 'block'; hero.classList.add('loaded'); if (fb) fb.style.display = 'none'; };
      hero.src = s.thumbnail.source;
    }
  } catch (e) { /* silencioso: si Wikipedia no responde, queda el enlace a la fuente */ }
}

export function closePanel() {
  const p = document.getElementById('info-panel');
  p.classList.remove('open'); p.setAttribute('aria-hidden', 'true');
}
