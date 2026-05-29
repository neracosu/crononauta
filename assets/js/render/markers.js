import { yearToX } from '../core/coords.js';
import { EVENTS } from '../data/events.js';
import { REGIONS } from '../data/regions.js';
import { showTooltip, moveTooltip, hideTooltip } from '../ui/tooltip.js';
import { openPanel } from '../ui/panel.js';

export function renderMarkers(overlay) {
  EVENTS.forEach(ev => {
    const region = REGIONS[ev.region] || REGIONS[0];
    const m = document.createElement('div');
    m.className = 'event-marker' + (ev.golden ? ' golden' : '');
    m.style.left = yearToX(ev.year) + 'px';
    m.style.top = (region.yStart - 10) + 'px';
    const data = { name: ev.name, start: ev.year, end: null, desc: ev.desc,
      color: ev.golden ? '#daa520' : '#8b1a1a', isEvent: true };
    m.addEventListener('mouseenter', e => showTooltip(e, data));
    m.addEventListener('mousemove', moveTooltip);
    m.addEventListener('mouseleave', hideTooltip);
    m.addEventListener('click', () => openPanel(data));
    overlay.appendChild(m);
  });
}
