// Genera INSERTs SQL desde los datos semilla (módulos JS) → stdout.
// Uso: node db/seed.mjs | mariadb neracosu_crononauta   (credenciales fuera del repo)
import { REGIONS } from '../assets/js/data/regions.js';
import { LAYERS, civLayer } from '../assets/js/data/layers.js';
import { CIVS } from '../assets/js/data/civilizations.js';
import { EVENTS } from '../assets/js/data/events.js';

const q = v => v === null || v === undefined ? 'NULL' : `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
const n = v => v === null || v === undefined ? 'NULL' : Number(v);

const out = [];
out.push('SET NAMES utf8mb4;');
out.push('START TRANSACTION;');
out.push('DELETE FROM eventos; DELETE FROM civilizaciones; DELETE FROM capas; DELETE FROM regiones;');

REGIONS.forEach((r, i) => {
  out.push(`INSERT INTO regiones (id,nombre,orden) VALUES (${n(r.id)},${q(r.name)},${i});`);
});
LAYERS.forEach(l => {
  out.push(`INSERT INTO capas (id,nombre,color,icono,orden) VALUES (${q(l.id)},${q(l.name)},${q(l.color)},${q(l.icon)},${n(l.orden)});`);
});
CIVS.forEach(c => {
  out.push(`INSERT INTO civilizaciones (id,nombre,anio_inicio,anio_fin,color,region_id,capa_id,tier,parent_id,descripcion) VALUES (` +
    `${q(c.id)},${q(c.name)},${n(c.start)},${n(c.end)},${q(c.color)},${n(c.region)},${q(civLayer(c))},${n(c.tier || 2)},${q(c.parent || null)},${q(c.desc || null)});`);
});
EVENTS.forEach(e => {
  out.push(`INSERT INTO eventos (anio,nombre,descripcion,region_id,capa_id,golden) VALUES (` +
    `${n(e.year)},${q(e.name)},${q(e.desc || null)},${n(e.region)},${q(e.layer || 'politica')},${e.golden ? 1 : 0});`);
});

out.push('COMMIT;');
process.stdout.write(out.join('\n') + '\n');
