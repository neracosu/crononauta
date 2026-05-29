import { easeInOutCubic } from './easing.js';
import { interpolateZoom } from './smoothZoom.js';

export const SCALE_MIN = 0.12;
export const SCALE_MAX = 8;

export function clampScale(s) {
  return Math.max(SCALE_MIN, Math.min(SCALE_MAX, s));
}

// Zoom hacia (sx,sy) en coords de pantalla. Devuelve nuevo {x,y,scale}.
export function zoomAtMath(state, factor, sx, sy) {
  const scale = clampScale(state.scale * factor);
  const k = scale / state.scale;
  return { x: sx - (sx - state.x) * k, y: sy - (sy - state.y) * k, scale };
}

// Transform que enmarca y centra worldRect {x,y,w,h} en un viewport vw×vh a un zoom dado.
export function frameRect(rect, vw, vh, scale) {
  const cxWorld = rect.x + rect.w / 2;
  const cyWorld = rect.y + rect.h / 2;
  return { x: vw / 2 - cxWorld * scale, y: vh / 2 - cyWorld * scale, scale };
}

// Factory con estado vivo, aplica transform al DOM y anima con rAF + van Wijk.
export function createViewport(el, onChange) {
  const state = { x: 0, y: 0, scale: 1 };
  let raf = null;

  function apply() {
    el.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
    onChange && onChange(state);
  }
  function set(next) {
    state.x = next.x; state.y = next.y; state.scale = clampScale(next.scale);
    apply();
  }
  function panBy(dx, dy) { state.x += dx; state.y += dy; apply(); }
  function zoomAt(factor, sx, sy) { set(zoomAtMath(state, factor, sx, sy)); }

  // estado {x,y,scale} ↔ vista van Wijk [cx,cy,w] (centro en mundo + ancho visible en mundo)
  function viewOf(st, vw) { return [ (vw/2 - st.x)/st.scale, (innerHeight/2 - st.y)/st.scale, vw/st.scale ]; }
  function stateOfView([cx, cy, w], vw) { const s = vw / w; return { x: vw/2 - cx*s, y: innerHeight/2 - cy*s, scale: s }; }

  function animateTo(target) {
    if (raf) cancelAnimationFrame(raf);
    const to = { ...target, scale: clampScale(target.scale) };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { set(to); return; }
    const vw = innerWidth;
    const interp = interpolateZoom(viewOf(state, vw), viewOf(to, vw));
    const dur = Math.max(220, Math.min(1400, interp.duration));
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur);
      const ns = stateOfView(interp(easeInOutCubic(p)), vw);
      state.x = ns.x; state.y = ns.y; state.scale = clampScale(ns.scale);
      apply();
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  return { state, set, panBy, zoomAt, animateTo, apply };
}
