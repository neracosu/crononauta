import { TOUR } from '../data/tour.js';
import { EVENTS } from '../data/events.js';
import { REGIONS } from '../data/regions.js';
import { yearToX } from '../core/coords.js';

// Resuelve el punto de mundo (x,y) a enfocar para un hito.
function focusPoint(stop, byId) {
  const f = stop.focus;
  if (f.civId) { const c = byId[f.civId]; return { x: (yearToX(c.start)+yearToX(c.end))/2, y: c.yCenter }; }
  if (f.eventName) {
    const ev = EVENTS.find(e => e.name === f.eventName); const r = REGIONS[ev.region];
    return { x: yearToX(ev.year), y: r.yStart + 40 };
  }
  const r = REGIONS[f.region] || REGIONS[0];
  return { x: yearToX(f.year), y: r.yStart + 60 };
}

export function initTour(vp, byId) {
  let active = false, idx = 0;
  const rail = document.getElementById('tour-rail');
  const card = document.getElementById('tour-card');

  function goto(i) {
    idx = Math.max(0, Math.min(TOUR.length - 1, i));
    const stop = TOUR[idx];
    const p = focusPoint(stop, byId);
    vp.animateTo({ x: innerWidth/2 - p.x * stop.zoom, y: innerHeight/2 - p.y * stop.zoom, scale: stop.zoom });
    card.querySelector('.tour-title').textContent = stop.title;
    card.querySelector('.tour-caption').textContent = stop.caption;
    card.querySelector('.tour-progress').textContent = `${idx + 1} / ${TOUR.length}`;
    card.querySelector('[data-tour="prev"]').disabled = idx === 0;
    card.querySelector('[data-tour="next"]').disabled = idx === TOUR.length - 1;
  }
  function start() { active = true; rail.classList.add('active'); goto(0); }
  function stop() { active = false; rail.classList.remove('active'); }

  card.addEventListener('click', e => {
    const a = e.target.dataset.tour;
    if (a === 'next') goto(idx + 1);
    if (a === 'prev') goto(idx - 1);
    if (a === 'close') stop();
  });

  // rueda del ratón avanza/retrocede hitos cuando el tour está activo
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
