import { TOUR } from '../data/tour.js';
import { EVENTS } from '../data/events.js';
import { LAYERS } from '../data/layers.js';
import { regionById } from '../data/regions.js';
import { yearToX } from '../core/coords.js';

// Resuelve el punto de mundo (x,y) a enfocar para un hito (consciente de la vista activa).
function focusPoint(stop, byId, groupForEvent) {
  const f = stop.focus;
  if (f.civId) { const c = byId[f.civId]; if (c) return { x: (yearToX(c.start)+yearToX(c.end))/2, y: c.yCenter }; }
  if (f.eventName) {
    const ev = EVENTS.find(e => e.name === f.eventName);
    if (ev) { const g = groupForEvent(ev); return { x: yearToX(ev.year), y: (g.yStart || 300) + 40 }; }
  }
  const r = regionById(f.region);
  return { x: yearToX(f.year), y: (r.yStart || 300) + 60 };
}

// Toma n elementos repartidos uniformemente.
function spread(arr, n) {
  if (arr.length <= n) return arr;
  const out = [], step = arr.length / n;
  for (let i = 0; i < n; i++) out.push(arr[Math.floor(i * step)]);
  return out;
}

// Construye los hitos del recorrido según las capas activas:
// - todas las capas → recorrido global curado (TOUR).
// - una capa/preset → se genera a partir de sus eventos (cronológico, ~12 paradas).
function stopsFor(active) {
  if (active.size >= LAYERS.length) return TOUR;
  const evs = EVENTS.filter(e => active.has(e.layer)).sort((a, b) => a.year - b.year);
  if (evs.length < 2) return TOUR;
  return spread(evs, 12).map(ev => ({
    title: ev.name,
    caption: ev.desc || 'Explora este hito en el mapa. Fuente: Wikipedia.',
    focus: { eventName: ev.name },
    zoom: 1.7,
  }));
}

export function initTour(vp, byId, getActive, groupForEvent = ev => regionById(ev.region)) {
  let active = false, idx = 0, stops = TOUR;
  const rail = document.getElementById('tour-rail');
  const card = document.getElementById('tour-card');

  function goto(i) {
    idx = Math.max(0, Math.min(stops.length - 1, i));
    const stop = stops[idx];
    const p = focusPoint(stop, byId, groupForEvent);
    vp.animateTo({ x: innerWidth/2 - p.x * stop.zoom, y: innerHeight/2 - p.y * stop.zoom, scale: stop.zoom });
    card.querySelector('.tour-title').textContent = stop.title;
    card.querySelector('.tour-caption').textContent = stop.caption;
    card.querySelector('.tour-progress').textContent = `${idx + 1} / ${stops.length}`;
    card.querySelector('[data-tour="prev"]').disabled = idx === 0;
    card.querySelector('[data-tour="next"]').disabled = idx === stops.length - 1;
  }
  function start() {
    stops = stopsFor(getActive ? getActive() : new Set(LAYERS.map(l => l.id)));
    active = true; rail.classList.add('active'); goto(0);
  }
  function stop() { active = false; rail.classList.remove('active'); }

  card.addEventListener('click', e => {
    const a = e.target.dataset.tour;
    if (a === 'next') goto(idx + 1);
    if (a === 'prev') goto(idx - 1);
    if (a === 'close') stop();
  });
  let lock = false;
  addEventListener('wheel', e => {
    if (!active) return;
    e.stopPropagation();
    if (lock) return; lock = true; setTimeout(() => lock = false, 700);
    goto(idx + (e.deltaY > 0 ? 1 : -1));
  }, { capture: true });
  document.addEventListener('keydown', e => {
    if (!active) return;
    if (e.key === 'ArrowRight') goto(idx + 1);
    if (e.key === 'ArrowLeft') goto(idx - 1);
    if (e.key === 'Escape') stop();
  });

  return { start, stop };
}
