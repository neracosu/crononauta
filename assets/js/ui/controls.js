import { yearToX } from '../core/coords.js';

// Crea funciones de navegación ligadas al viewport y wirea botones + teclado.
export function initControls(vp, { byId, openPanel, totalHeight, onTour }) {
  const display = document.getElementById('zoom-display');
  const orig = vp.apply;
  vp.apply = () => { orig(); display.textContent = Math.round(vp.state.scale * 100) + '%'; };
  vp.apply();

  function centerOn(x, y, scale) {
    vp.animateTo({ x: innerWidth / 2 - x * scale, y: innerHeight / 2 - y * scale, scale });
  }
  function goToCiv(id) {
    const c = byId[id]; if (!c) return;
    const x = (yearToX(c.start) + yearToX(c.end)) / 2;
    centerOn(x, c.yCenter, Math.max(vp.state.scale, 1.4));
    openPanel(c);
  }
  function reset() {
    vp.animateTo({ x: -yearToX(-1000) * 0.55 + innerWidth / 2, y: -totalHeight * 0.2, scale: 0.55 });
  }

  document.getElementById('controls').addEventListener('click', e => {
    const act = e.target.dataset.act; if (!act) return;
    const cx = innerWidth / 2, cy = innerHeight / 2;
    if (act === 'zoomin') vp.zoomAt(1.3, cx, cy);
    if (act === 'zoomout') vp.zoomAt(1 / 1.3, cx, cy);
    if (act === 'reset') reset();
    if (act === 'tour') onTour && onTour();
  });

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    const cx = innerWidth / 2, cy = innerHeight / 2;
    switch (e.key.toLowerCase()) {
      case 'r': reset(); break;
      case 't': onTour && onTour(); break;
      case '+': case '=': vp.zoomAt(1.3, cx, cy); break;
      case '-': vp.zoomAt(1 / 1.3, cx, cy); break;
      case 'arrowleft': vp.panBy(180, 0); break;
      case 'arrowright': vp.panBy(-180, 0); break;
      case 'arrowup': vp.panBy(0, 150); break;
      case 'arrowdown': vp.panBy(0, -150); break;
      case 'f': document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); break;
    }
  });

  return { goToCiv, centerOn, reset };
}
