import { LAYERS, PRESETS, layerById } from '../data/layers.js';

// Selector desplegable de capas: perfiles (presets) + capas individuales.
// apply(activeSet) muestra/oculta los elementos del mapa por capa. Estado en la URL.
export function initLayers(apply) {
  const allIds = LAYERS.map(l => l.id);
  const sel = document.getElementById('layer-select');

  sel.innerHTML =
    `<optgroup label="Perfiles">` +
      PRESETS.map(p => `<option value="preset:${p.id}">${p.label}</option>`).join('') +
    `</optgroup><optgroup label="Capas">` +
      LAYERS.map(l => `<option value="layer:${l.id}">${l.icon || ''} ${l.name}</option>`).join('') +
    `</optgroup>`;

  function idsFor(value) {
    const [kind, id] = value.split(':');
    if (kind === 'preset') return (PRESETS.find(p => p.id === id)?.layers) || allIds;
    return [id];
  }
  function fromURL() {
    const p = new URLSearchParams(location.search);
    if (p.get('preset') && PRESETS.some(x => x.id === p.get('preset'))) return `preset:${p.get('preset')}`;
    if (p.get('capa') && allIds.includes(p.get('capa'))) return `layer:${p.get('capa')}`;
    return 'preset:todo';
  }
  function syncURL(value) {
    const p = new URLSearchParams(location.search);
    p.delete('preset'); p.delete('capa'); p.delete('capas');
    const [kind, id] = value.split(':');
    if (kind === 'preset' && id !== 'todo') p.set('preset', id);
    if (kind === 'layer') p.set('capa', id);
    const qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  const initial = fromURL();
  sel.value = initial;
  apply(new Set(idsFor(initial)));

  sel.addEventListener('change', () => {
    syncURL(sel.value);
    apply(new Set(idsFor(sel.value)));
  });
}

// Color de acento de la capa actualmente seleccionada (para teñir el botón del tour, etc.)
export function accentFor(active) {
  const ids = [...active];
  return ids.length === 1 ? layerById(ids[0]).color : null;
}
