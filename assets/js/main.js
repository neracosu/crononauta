import { VERSION } from './data/version.js';
import { REGIONS } from './data/regions.js';
import { CIVS } from './data/civilizations.js';
import { layout, yearToX, CHART_WIDTH } from './core/coords.js';
import { createViewport } from './core/viewport.js';
import { renderTimeline } from './render/timeline.js';
import { riverPath, connectorPath } from './render/rivers.js';
import { showTooltip, moveTooltip, hideTooltip } from './ui/tooltip.js';
import { initPanel, openPanel } from './ui/panel.js';

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

// Gradiente de volumen reutilizable
const SVGNS = 'http://www.w3.org/2000/svg';
const defs = document.createElementNS(SVGNS, 'defs');
defs.innerHTML = `<linearGradient id="riverShade" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="rgba(255,255,255,0.28)"/>
  <stop offset="45%" stop-color="rgba(255,255,255,0)"/>
  <stop offset="100%" stop-color="rgba(0,0,0,0.16)"/>
</linearGradient>`;
svg.appendChild(defs);

const brightColors = ['#d4a843','#f1c40f','#f39c12','#ff8c00','#daa520','#cd853f','#c2955a'];

// Conectores de división/fusión (se dibujan primero → quedan detrás de los ríos)
const byId = Object.fromEntries(CIVS.map(c => [c.id, c]));
CIVS.filter(c => c.parent && byId[c.parent]).forEach(child => {
  const conn = document.createElementNS(SVGNS, 'path');
  conn.setAttribute('d', connectorPath(byId[child.parent], child));
  conn.setAttribute('class', 'river-connector');
  conn.setAttribute('fill', child.color);
  svg.appendChild(conn);
});

// Ríos orgánicos afilados (SVG) + etiqueta (overlay)
CIVS.forEach(civ => {
  const d = riverPath(civ);
  const fill = document.createElementNS(SVGNS, 'path');
  fill.setAttribute('d', d);
  fill.setAttribute('fill', civ.color);
  fill.setAttribute('class', 'river');
  fill.dataset.id = civ.id;
  fill.addEventListener('mouseenter', e => showTooltip(e, civ));
  fill.addEventListener('mousemove', moveTooltip);
  fill.addEventListener('mouseleave', hideTooltip);
  fill.addEventListener('click', () => openPanel(civ));
  svg.appendChild(fill);

  const shade = document.createElementNS(SVGNS, 'path');
  shade.setAttribute('d', d);
  shade.setAttribute('fill', 'url(#riverShade)');
  shade.setAttribute('pointer-events', 'none');
  svg.appendChild(shade);

  const lab = document.createElement('div');
  lab.className = 'civ-label' + (brightColors.includes(civ.color) ? ' dark' : '');
  lab.style.left = (yearToX(civ.start) + 8) + 'px';
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

// Panel lateral (la navegación a civ se reemplaza por goToCiv en Task 11)
initPanel(id => openPanel(byId[id]));

document.getElementById('version-badge').textContent = 'v' + VERSION;

// Exponer para depurar / siguientes tareas
window.CRONO = { vp, REGIONS, CIVS, byId, totalHeight };
