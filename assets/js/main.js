import { VERSION } from './data/version.js';
import { REGIONS } from './data/regions.js';
import { CIVS } from './data/civilizations.js';
import { layout, yearToX, bandPeak, CHART_WIDTH } from './core/coords.js';
import { createViewport } from './core/viewport.js';
import { renderTimeline } from './render/timeline.js';

const world = document.getElementById('world');
const svg = document.getElementById('chart-svg');
const overlay = document.getElementById('overlay');

const totalHeight = layout(REGIONS, CIVS);
world.style.width = CHART_WIDTH + 'px';
world.style.height = totalHeight + 'px';
svg.setAttribute('width', CHART_WIDTH);
svg.setAttribute('height', totalHeight);
svg.setAttribute('viewBox', `0 0 ${CHART_WIDTH} ${totalHeight}`);

renderTimeline(svg, overlay, REGIONS, totalHeight);

// Bandas simples (provisional — se reemplazan por ríos en Task 6)
CIVS.forEach(civ => {
  const x = yearToX(civ.start);
  const w = Math.max(yearToX(civ.end) - x, 18);
  const peak = bandPeak(civ.tier);
  const band = document.createElement('div');
  band.className = 'civ-band';
  band.dataset.id = civ.id;
  band.style.left = x + 'px';
  band.style.top = (civ.yCenter - peak / 2) + 'px';
  band.style.width = w + 'px';
  band.style.height = peak + 'px';
  band.style.background = civ.color;
  overlay.appendChild(band);

  const lab = document.createElement('div');
  lab.className = 'civ-label';
  lab.style.left = (x + 6) + 'px';
  lab.style.top = civ.yCenter + 'px';
  lab.textContent = civ.name;
  overlay.appendChild(lab);
});

// Viewport + interacción
const vp = createViewport(world);
vp.set({ x: -yearToX(-1000) * 0.55 + innerWidth / 2, y: -totalHeight * 0.2, scale: 0.55 });

const app = document.getElementById('app');
let drag = null;
app.addEventListener('mousedown', e => {
  drag = { sx: e.clientX, sy: e.clientY, px: vp.state.x, py: vp.state.y };
  document.body.classList.add('dragging');
});
addEventListener('mousemove', e => {
  if (!drag) return;
  vp.set({ x: drag.px + (e.clientX - drag.sx), y: drag.py + (e.clientY - drag.sy), scale: vp.state.scale });
});
addEventListener('mouseup', () => { drag = null; document.body.classList.remove('dragging'); });

app.addEventListener('wheel', e => {
  e.preventDefault();
  const r = app.getBoundingClientRect();
  vp.zoomAt(e.deltaY > 0 ? 0.9 : 1.1, e.clientX - r.left, e.clientY - r.top);
}, { passive: false });

document.getElementById('version-badge').textContent = 'v' + VERSION;

// Exponer para depurar / siguientes tareas
window.CRONO = { vp, REGIONS, CIVS, totalHeight };
