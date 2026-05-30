import { VERSION } from './data/version.js';
import { loadData } from './data/load.js';
import { REGIONS, regionById } from './data/regions.js';
import { civLayer, LAYERS, layerById } from './data/layers.js';
import { initLayers } from './ui/layers.js';
import { CIVS } from './data/civilizations.js';
import { EVENTS } from './data/events.js';
import { layout, yearToX, CHART_WIDTH, TOP_OFFSET } from './core/coords.js';
import { createViewport } from './core/viewport.js';
import { renderTimeline } from './render/timeline.js';
import { riverPath, connectorPath, densityRiverPath } from './render/rivers.js';
import { showTooltip, moveTooltip, hideTooltip } from './ui/tooltip.js';
import { initPanel, openPanel } from './ui/panel.js';
import { renderMarkers } from './render/markers.js';
import { initControls } from './ui/controls.js';
import { initSearch } from './ui/search.js';
import { initLegend } from './ui/legend.js';
import { initMinimap } from './render/minimap.js';
import { initTour } from './ui/tour.js';
import { initSplash } from './ui/splash.js';

const world = document.getElementById('world');
const svg = document.getElementById('chart-svg');
const overlay = document.getElementById('overlay');

// Datos desde la API (DB). Top-level await (módulo ES). Cae a estáticos si falla.
await loadData();

// Vista: 'atlas' (filas por región, default) o 'capas' (carriles por tema).
const VISTA = new URLSearchParams(location.search).get('vista') === 'capas' ? 'capas' : 'atlas';
const groups = VISTA === 'capas' ? LAYERS.map(l => ({ id: l.id, name: l.name.toUpperCase() })) : REGIONS;
const keyOf = VISTA === 'capas' ? (c => civLayer(c)) : (c => c.region);
const groupForEvent = VISTA === 'capas'
  ? (ev => groups.find(g => g.id === ev.layer) || groups[0])
  : (ev => regionById(ev.region));

const totalHeight = layout(groups, CIVS, keyOf, VISTA === 'capas' ? 3 : 0);
world.style.width = CHART_WIDTH + 'px';
world.style.height = totalHeight + 'px';
svg.setAttribute('width', CHART_WIDTH);
svg.setAttribute('height', totalHeight);
svg.setAttribute('viewBox', `0 0 ${CHART_WIDTH} ${totalHeight}`);

renderTimeline(svg, overlay, groups, totalHeight);

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
  conn.dataset.layer = civLayer(child);
  svg.appendChild(conn);
});

// Ríos orgánicos afilados (SVG) + etiqueta (overlay)
CIVS.forEach(civ => {
  const d = riverPath(civ);
  const lyr = civLayer(civ);
  const fill = document.createElementNS(SVGNS, 'path');
  fill.setAttribute('d', d);
  fill.setAttribute('fill', civ.color);
  fill.setAttribute('class', 'river');
  fill.dataset.id = civ.id;
  fill.dataset.layer = lyr;
  fill.addEventListener('mouseenter', e => showTooltip(e, civ));
  fill.addEventListener('mousemove', moveTooltip);
  fill.addEventListener('mouseleave', hideTooltip);
  fill.addEventListener('click', () => openPanel(civ));
  svg.appendChild(fill);

  const shade = document.createElementNS(SVGNS, 'path');
  shade.setAttribute('d', d);
  shade.setAttribute('fill', 'url(#riverShade)');
  shade.setAttribute('pointer-events', 'none');
  shade.dataset.layer = lyr;
  svg.appendChild(shade);

  const lab = document.createElement('div');
  lab.className = 'civ-label' + (brightColors.includes(civ.color) ? ' dark' : '');
  lab.style.left = (yearToX(civ.start) + 8) + 'px';
  lab.style.top = civ.yCenter + 'px';
  lab.dataset.layer = lyr;
  lab.textContent = civ.name;
  overlay.appendChild(lab);
});

// Vista Capas: río de densidad por cada capa de eventos (las que no tienen bandas-civ)
if (VISTA === 'capas') {
  groups.filter(g => g.laneCount === 0).forEach(g => {
    const years = EVENTS.filter(e => e.layer === g.id).map(e => e.year);
    if (!years.length) return;
    const path = document.createElementNS(SVGNS, 'path');
    path.setAttribute('d', densityRiverPath(years, g.yStart + 48, 40));
    path.setAttribute('fill', layerById(g.id).color);
    path.setAttribute('class', 'layer-river');
    path.dataset.layer = g.id;
    svg.appendChild(path);
  });
}

renderMarkers(overlay, groupForEvent);

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

// Gestos táctiles: 1 dedo = pan, 2 dedos = pinch-zoom hacia el punto medio
const dist = (a, b) => Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
let touch = null;
app.addEventListener('touchstart', e => {
  if (e.touches.length === 1) {
    touch = { mode:'pan', sx:e.touches[0].clientX, sy:e.touches[0].clientY, px:vp.state.x, py:vp.state.y };
  } else if (e.touches.length === 2) {
    const [a, b] = e.touches;
    touch = { mode:'pinch', d:dist(a, b), mx:(a.clientX+b.clientX)/2, my:(a.clientY+b.clientY)/2 };
  }
}, { passive: true });
app.addEventListener('touchmove', e => {
  if (!touch) return;
  if (touch.mode === 'pan' && e.touches.length === 1) {
    vp.set({ x:touch.px+(e.touches[0].clientX-touch.sx), y:touch.py+(e.touches[0].clientY-touch.sy), scale:vp.state.scale });
  } else if (touch.mode === 'pinch' && e.touches.length === 2) {
    const [a, b] = e.touches;
    const nd = dist(a, b), nmx = (a.clientX+b.clientX)/2, nmy = (a.clientY+b.clientY)/2;
    const r = app.getBoundingClientRect();
    if (touch.d > 0) vp.zoomAt(nd / touch.d, nmx - r.left, nmy - r.top);
    vp.panBy(nmx - touch.mx, nmy - touch.my);
    touch.d = nd; touch.mx = nmx; touch.my = nmy;
  }
  e.preventDefault();
}, { passive: false });
app.addEventListener('touchend', () => { touch = null; }, { passive: true });

// Controles + navegación + panel. `frame` encuadra el contenido de las capas activas.
let frameActive;
const controls = initControls(vp, { byId, openPanel, totalHeight, onTour: () => window.CRONO?.startTour?.(), frame: () => frameActive && frameActive() });
initPanel(controls.goToCiv);
initSearch(controls.goToCiv);
initLegend(controls.goToCiv);
initMinimap(vp, totalHeight);

// Capas + culling/nivel de detalle. La visibilidad combina: capa activa + en viewport + LOD.
let activeLayers = new Set();
const getActive = () => activeLayers;
// Zoom semántico (estilo Google Maps): alejado = panorama (ríos/eras/hitos dorados);
// al acercar aparecen, por niveles: nombres de civilización → todos los marcadores → nombres de evento.
const SC_CIV_LABEL = 0.45;
const SC_MARKERS = 0.85;
const SC_EV_LABEL = 1.8;
function refreshVisibility() {
  const sc = vp.state.scale, px = vp.state.x;
  const left = -px / sc - 200, right = (innerWidth - px) / sc + 200;
  const lodOn = activeLayers.has('civilizaciones') || activeLayers.has('religion');
  overlay.parentNode.querySelectorAll('[data-layer]').forEach(el => {
    if (!activeLayers.has(el.dataset.layer)) { el.style.display = 'none'; return; }
    const cl = el.classList;
    if (cl.contains('event-marker')) {
      const x = parseFloat(el.style.left);
      const detail = !lodOn || cl.contains('golden') || sc >= SC_MARKERS;
      el.style.display = (x >= left && x <= right && detail) ? '' : 'none';
    } else if (cl.contains('event-label')) {
      const x = parseFloat(el.style.left);
      el.style.display = (sc >= SC_EV_LABEL && x >= left && x <= right) ? '' : 'none';
    } else if (cl.contains('civ-label')) {
      el.style.display = sc >= SC_CIV_LABEL ? '' : 'none';
    } else {
      el.style.display = ''; // ríos, conectores, sombras = panorama (siempre visible si la capa está activa)
    }
  });
}
function applyLayers(active) { activeLayers = active; refreshVisibility(); }

// Encuadra el contenido de las capas activas (evita iniciar en un espacio en blanco).
frameActive = function () {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const add = (x, y) => { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; };
  CIVS.forEach(c => { if (activeLayers.has(civLayer(c))) { add(yearToX(c.start), c.yCenter); add(yearToX(c.end), c.yCenter); } });
  EVENTS.forEach(e => { if (activeLayers.has(e.layer)) { const g = groupForEvent(e); add(yearToX(e.year), (g.yStart || TOP_OFFSET) + (VISTA === 'capas' ? 48 : 0)); } });
  if (minX === Infinity) { vp.animateTo({ x: innerWidth / 2 - yearToX(0) * 0.5, y: 60, scale: 0.5 }); return; }
  const w = Math.max(maxX - minX, 400), h = Math.max(maxY - minY, 200);
  let scale = Math.min((innerWidth - 220) / w, (innerHeight - 200) / h);
  scale = Math.max(0.16, Math.min(1.2, scale));
  const cx = minX + w / 2, cy = minY + h / 2;
  vp.animateTo({ x: innerWidth / 2 - cx * scale, y: innerHeight / 2 - cy * scale, scale });
};

// Refrescar culling/LOD al desplazar o hacer zoom (throttled a un frame)
const _vpApply = vp.apply; let _rafPend = false;
vp.apply = () => { _vpApply(); if (!_rafPend) { _rafPend = true; requestAnimationFrame(() => { _rafPend = false; refreshVisibility(); }); } };

const tour = initTour(vp, byId, getActive, groupForEvent);
initSplash(() => controls.reset(), () => tour.start());
initLayers(applyLayers);

document.getElementById('version-badge').textContent = 'v' + VERSION;

// Exponer para depurar / siguientes tareas
window.CRONO = { vp, REGIONS, CIVS, byId, totalHeight, controls, goToCiv: controls.goToCiv, startTour: tour.start };
