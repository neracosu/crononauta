import { yearToX } from '../core/coords.js';
import { EVENTS } from '../data/events.js';
import { regionById } from '../data/regions.js';
import { layerById } from '../data/layers.js';
import { showTooltip, moveTooltip, hideTooltip } from '../ui/tooltip.js';
import { openPanel } from '../ui/panel.js';

export function renderMarkers(overlay) {
  const tally = {}; // contador por región para escalonar verticalmente y evitar amontonamiento
  EVENTS.forEach(ev => {
    const region = regionById(ev.region);
    const color = layerById(ev.layer).color;
    const k = (tally[ev.region] = (tally[ev.region] || 0) + 1);
    const m = document.createElement('div');
    m.className = 'event-marker' + (ev.golden ? ' golden' : '');
    m.dataset.layer = ev.layer;
    m.style.left = yearToX(ev.year) + 'px';
    m.style.top = (region.yStart - 10 - (k % 5) * 8) + 'px';
    m.style.background = color;
    const data = { name: ev.name, start: ev.year, end: null, desc: ev.desc,
      color, isEvent: true, source: ev.source, wd: ev.wd };
    m.addEventListener('mouseenter', e => showTooltip(e, data));
    m.addEventListener('mousemove', moveTooltip);
    m.addEventListener('mouseleave', hideTooltip);
    m.addEventListener('click', () => openPanel(data));
    overlay.appendChild(m);
  });
}
