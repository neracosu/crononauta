// Carga los datos desde la API (DB) y reemplaza en sitio los arrays semilla.
// Si la API falla, se conservan los datos estáticos como respaldo (offline-safe).
import { REGIONS } from './regions.js';
import { LAYERS } from './layers.js';
import { CIVS } from './civilizations.js';
import { EVENTS } from './events.js';

const replace = (arr, items) => {
  if (Array.isArray(items) && items.length) { arr.length = 0; arr.push(...items); }
};

export async function loadData() {
  try {
    const [reg, cap, civ, ev] = await Promise.all([
      fetch('api/regiones.php').then(r => r.json()),
      fetch('api/capas.php').then(r => r.json()),
      fetch('api/civilizaciones.php').then(r => r.json()),
      fetch('api/eventos.php').then(r => r.json()),
    ]);
    replace(REGIONS, reg);
    replace(LAYERS, cap);
    replace(CIVS, civ);
    replace(EVENTS, ev);
  } catch (e) {
    console.warn('CRONONAUTA: API no disponible; usando datos estáticos de respaldo.', e);
  }
}
