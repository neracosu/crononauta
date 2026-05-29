import { LAYERS, PRESETS } from '../data/layers.js';

// Panel de capas: multi-toggle + "solo esta capa" (foco) + presets + estado en URL.
// apply(activeSet) muestra/oculta los elementos del mapa por capa.
export function initLayers(apply) {
  const allIds = LAYERS.map(l => l.id);
  let active = new Set(fromURL() || allIds);

  const panel = document.getElementById('layers-panel');
  const toggleBtn = document.getElementById('layers-toggle');
  toggleBtn.addEventListener('click', () => panel.classList.toggle('open'));

  build();
  syncURL();
  apply(active);
  if (innerWidth > 760) panel.classList.add('open'); // abierto por defecto en escritorio

  function fromURL() {
    const p = new URLSearchParams(location.search);
    if (p.get('preset')) {
      const pr = PRESETS.find(x => x.id === p.get('preset'));
      if (pr) return pr.layers;
    }
    if (p.get('capas')) return p.get('capas').split(',').filter(Boolean);
    return null;
  }
  function syncURL() {
    const p = new URLSearchParams(location.search);
    p.delete('preset');
    if (active.size === allIds.length) p.delete('capas');
    else p.set('capas', [...active].join(','));
    const qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }
  function set(ids) { active = new Set(ids); build(); syncURL(); apply(active); }
  function toggle(id) {
    active.has(id) ? active.delete(id) : active.add(id);
    if (!active.size) active = new Set(allIds);
    set([...active]);
  }

  function build() {
    panel.innerHTML =
      `<div class="layers-head"><span>Capas</span><button class="layers-all" data-all>Todas</button></div>` +
      LAYERS.map(l => `<div class="layer-row${active.has(l.id) ? ' on' : ''}" data-id="${l.id}">
        <span class="layer-sw" style="background:${l.color}">${l.icon || ''}</span>
        <span class="layer-name">${l.name}</span>
        <button class="layer-only" data-only="${l.id}" title="Ver solo esta capa">◉</button>
      </div>`).join('');

    panel.querySelector('[data-all]').addEventListener('click', () => set(allIds));
    panel.querySelectorAll('.layer-row').forEach(row => {
      row.addEventListener('click', e => {
        if (e.target.closest('[data-only]')) return;
        toggle(row.dataset.id);
      });
    });
    panel.querySelectorAll('[data-only]').forEach(b =>
      b.addEventListener('click', e => { e.stopPropagation(); set([b.dataset.only]); }));
  }
}
