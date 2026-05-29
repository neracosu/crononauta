import { test } from 'node:test';
import assert from 'node:assert/strict';
import { easeInOutCubic } from '../assets/js/core/easing.js';
import { zoomAtMath, frameRect, clampScale } from '../assets/js/core/viewport.js';

test('easeInOutCubic en extremos y medio', () => {
  assert.equal(easeInOutCubic(0), 0);
  assert.equal(easeInOutCubic(1), 1);
  assert.ok(Math.abs(easeInOutCubic(0.5) - 0.5) < 1e-9);
});

test('clampScale respeta límites', () => {
  assert.equal(clampScale(100), 8);
  assert.equal(clampScale(0.001), 0.12);
  assert.equal(clampScale(1), 1);
});

test('zoomAtMath mantiene fijo el punto bajo el cursor', () => {
  const s = { x: 0, y: 0, scale: 1 };
  const worldBefore = { x: (200 - s.x) / s.scale, y: (100 - s.y) / s.scale };
  const r = zoomAtMath(s, 2, 200, 100);
  const worldAfter = { x: (200 - r.x) / r.scale, y: (100 - r.y) / r.scale };
  assert.ok(Math.abs(worldBefore.x - worldAfter.x) < 1e-6);
  assert.ok(Math.abs(worldBefore.y - worldAfter.y) < 1e-6);
  assert.equal(r.scale, 2);
});

test('frameRect centra y escala un rect en el viewport', () => {
  const rect = { x: 1000, y: 500, w: 400, h: 200 };
  const t = frameRect(rect, 800, 600, 1.5);
  const cx = t.x + (rect.x + rect.w / 2) * t.scale;
  const cy = t.y + (rect.y + rect.h / 2) * t.scale;
  assert.ok(Math.abs(cx - 400) < 1e-6);
  assert.ok(Math.abs(cy - 300) < 1e-6);
  assert.equal(t.scale, 1.5);
});
