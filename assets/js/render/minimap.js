import { CIVS } from '../data/civilizations.js';
import { yearToX, CHART_WIDTH } from '../core/coords.js';

const MM_W = 240, MM_H = 84;

export function initMinimap(vp, totalHeight, register) {
  const cv = document.getElementById('minimap-canvas');
  const ctx = cv.getContext('2d');
  const vpEl = document.getElementById('minimap-vp');
  const sx = MM_W / CHART_WIDTH, sy = MM_H / totalHeight;

  // dibujo estático de las bandas
  ctx.fillStyle = '#1a1410'; ctx.fillRect(0, 0, MM_W, MM_H);
  ctx.globalAlpha = .75;
  CIVS.forEach(c => {
    ctx.fillStyle = c.color;
    ctx.fillRect(yearToX(c.start) * sx, (c.yCenter - 9) * sy,
      Math.max((yearToX(c.end) - yearToX(c.start)) * sx, 1), Math.max(3 * sy, 1));
  });
  ctx.globalAlpha = 1;

  function update() {
    const vx = (-vp.state.x / vp.state.scale) * sx;
    const vy = (-vp.state.y / vp.state.scale) * sy;
    vpEl.style.left = Math.max(0, vx) + 'px';
    vpEl.style.top = Math.max(0, vy) + 'px';
    vpEl.style.width = Math.min((innerWidth / vp.state.scale) * sx, MM_W) + 'px';
    vpEl.style.height = Math.min((innerHeight / vp.state.scale) * sy, MM_H) + 'px';
  }
  if (register) register(update);
  update();

  document.getElementById('minimap').addEventListener('click', e => {
    const r = e.currentTarget.getBoundingClientRect();
    const wx = (e.clientX - r.left) / sx, wy = (e.clientY - r.top) / sy;
    vp.animateTo({ x: innerWidth/2 - wx * vp.state.scale, y: innerHeight/2 - wy * vp.state.scale, scale: vp.state.scale });
  });
}
