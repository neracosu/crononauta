import { REGIONS } from '../data/regions.js';
import { CIVS } from '../data/civilizations.js';

export function initLegend(goToCiv) {
  const panel = document.getElementById('legend-panel');
  let html = '';
  REGIONS.forEach(r => {
    html += `<div class="legend-region">${r.name}</div>`;
    CIVS.filter(c => c.region === r.id).forEach(c => {
      html += `<div class="legend-item" data-civ="${c.id}">
        <span class="sw" style="background:${c.color}"></span><span>${c.name}</span></div>`;
    });
  });
  panel.innerHTML = html;
  panel.querySelectorAll('.legend-item').forEach(it =>
    it.addEventListener('click', () => goToCiv(it.dataset.civ)));
  const toggle = () => panel.hidden = !panel.hidden;
  document.getElementById('legend-toggle').addEventListener('click', toggle);
  document.addEventListener('keydown', e => { if (e.target.tagName !== 'INPUT' && e.key.toLowerCase() === 'l') toggle(); });
}
