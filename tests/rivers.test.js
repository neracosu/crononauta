import { test } from 'node:test';
import assert from 'node:assert/strict';
import { riverPath } from '../assets/js/render/rivers.js';
import { yearToX } from '../assets/js/core/coords.js';

const civ = { start:-753, end:476, tier:1, yCenter:200 };

test('riverPath devuelve un path cerrado que empieza con M y termina con Z', () => {
  const d = riverPath(civ);
  assert.match(d, /^M/);
  assert.match(d.trim(), /Z$/);
});

test('riverPath empieza en la línea central (afilado)', () => {
  const d = riverPath(civ);
  const first = d.match(/M\s*([-\d.]+)[ ,]+([-\d.]+)/);
  const x0 = parseFloat(first[1]); const y0 = parseFloat(first[2]);
  assert.ok(Math.abs(x0 - yearToX(civ.start)) < 1);
  assert.ok(Math.abs(y0 - civ.yCenter) < 1);
});

test('riverPath de tier 1 es más grueso que tier 3', () => {
  const minY = d => Math.min(...[...d.matchAll(/[-\d.]+[ ,]+([-\d.]+)/g)].map(m => parseFloat(m[1])));
  const t1 = minY(riverPath({ ...civ, tier:1 }));
  const t3 = minY(riverPath({ ...civ, tier:3 }));
  assert.ok(t1 < t3);
});
