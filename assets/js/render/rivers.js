import { yearToX, bandPeak, PX_PER_YEAR } from '../core/coords.js';

// Genera el contorno de un río afilado: nace fino, crece (rise), se mantiene,
// y se afina al morir. Centrado verticalmente en civ.yCenter.
export function riverPath(civ) {
  const x0 = yearToX(civ.start);
  const x1 = yearToX(civ.end);
  const w = Math.max(x1 - x0, 14);
  const half = bandPeak(civ.tier) / 2;
  const yc = civ.yCenter;

  // rampa de subida/bajada acotada a 30% del ancho
  const riseYears = civ.rise || 120;
  const ramp = Math.min(riseYears * PX_PER_YEAR, w * 0.3);
  const xa = x0 + ramp;       // fin de subida
  const xb = x1 - ramp;       // inicio de bajada
  const top = yc - half;
  const bot = yc + half;
  const cp = ramp * 0.5;      // control bezier

  return [
    `M ${x0} ${yc}`,
    `C ${x0 + cp} ${yc} ${xa - cp} ${top} ${xa} ${top}`,
    `L ${xb} ${top}`,
    `C ${xb + cp} ${top} ${x1 - cp} ${yc} ${x1} ${yc}`,
    `C ${x1 - cp} ${yc} ${xb + cp} ${bot} ${xb} ${bot}`,
    `L ${xa} ${bot}`,
    `C ${xa - cp} ${bot} ${x0 + cp} ${yc} ${x0} ${yc}`,
    'Z',
  ].join(' ');
}

// Conector bezier tipo cinta del fin del padre al inicio del hijo (split/merge).
export function connectorPath(parent, child) {
  const x0 = yearToX(parent.end), y0 = parent.yCenter;
  const x1 = yearToX(child.start), y1 = child.yCenter;
  const mx = (x0 + x1) / 2;
  const th = 3;
  return [
    `M ${x0} ${y0 - th}`,
    `C ${mx} ${y0 - th} ${mx} ${y1 - th} ${x1} ${y1 - th}`,
    `L ${x1} ${y1 + th}`,
    `C ${mx} ${y1 + th} ${mx} ${y0 + th} ${x0} ${y0 + th}`,
    'Z',
  ].join(' ');
}
