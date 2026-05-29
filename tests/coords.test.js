import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  YEAR_START, PX_PER_YEAR, LEFT_PAD, yearToX, xToYear, formatYear,
  bandPeak, layout, CHART_WIDTH,
} from '../assets/js/core/coords.js';

test('yearToX ubica YEAR_START en LEFT_PAD', () => {
  assert.equal(yearToX(YEAR_START), LEFT_PAD);
});

test('yearToX avanza PX_PER_YEAR por año', () => {
  assert.equal(yearToX(YEAR_START + 100), LEFT_PAD + 100 * PX_PER_YEAR);
});

test('xToYear es inverso de yearToX', () => {
  assert.equal(xToYear(yearToX(1492)), 1492);
});

test('formatYear marca a.C. / d.C. y año 0 como 1 d.C.', () => {
  assert.equal(formatYear(-753), '753 a.C.');
  assert.equal(formatYear(476), '476 d.C.');
  assert.equal(formatYear(0), '1 d.C.');
});

test('bandPeak decrece con el tier', () => {
  assert.ok(bandPeak(1) > bandPeak(2));
  assert.ok(bandPeak(2) > bandPeak(3));
});

test('layout asigna yCenter creciente dentro de una región y devuelve altura total', () => {
  const regions = [{ id:0, name:'R0' }, { id:1, name:'R1' }];
  const civs = [
    { id:'a', region:0 }, { id:'b', region:0 }, { id:'c', region:1 },
  ];
  const total = layout(regions, civs);
  assert.ok(regions[0].yStart < regions[1].yStart);
  assert.ok(civs[1].yCenter > civs[0].yCenter);
  assert.equal(civs[0].region, regions[0].id);
  assert.ok(total > regions[1].yStart);
  assert.ok(CHART_WIDTH > 0);
});
