import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interpolateZoom } from '../assets/js/core/smoothZoom.js';

test('interpolateZoom respeta extremos y da duración positiva', () => {
  const a = [0, 0, 1000], b = [4000, 600, 300];
  const i = interpolateZoom(a, b);
  const v0 = i(0), v1 = i(1);
  for (let k = 0; k < 3; k++) {
    assert.ok(Math.abs(v0[k] - a[k]) < 1e-3);
    assert.ok(Math.abs(v1[k] - b[k]) < 1e-3);
  }
  assert.ok(i.duration > 0);
});

test('interpolateZoom maneja el caso de mismo punto (solo zoom)', () => {
  const i = interpolateZoom([100, 100, 1000], [100, 100, 200]);
  const mid = i(0.5);
  assert.ok(Math.abs(mid[0] - 100) < 1e-6);
  assert.ok(mid[2] < 1000 && mid[2] > 200);
});
