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

// Río de densidad para una capa temática (de eventos): banda que fluye de su primer
// a su último evento y se ensancha donde hay más actividad. Afilada en los extremos.
export function densityRiverPath(years, yCenter, maxHalf) {
  if (!years.length) return '';
  const sorted = [...years].sort((a, b) => a - b);
  const y0 = sorted[0], y1 = sorted[sorted.length - 1];
  if (y1 === y0) {
    const x = yearToX(y0);
    return `M ${x - 10} ${yCenter} Q ${x} ${yCenter - maxHalf} ${x + 10} ${yCenter} Q ${x} ${yCenter + maxHalf} ${x - 10} ${yCenter} Z`;
  }
  const N = 72;
  const win = Math.max((y1 - y0) / 18, 60); // ventana de suavizado (años)
  const dens = [];
  let maxd = 1;
  for (let i = 0; i <= N; i++) {
    const yr = y0 + (y1 - y0) * i / N;
    let c = 0;
    for (const yy of sorted) if (Math.abs(yy - yr) <= win) c++;
    dens.push(c); if (c > maxd) maxd = c;
  }
  const half = i => Math.max(2.5, (dens[i] / maxd) * maxHalf);
  let d = `M ${yearToX(y0).toFixed(1)} ${yCenter}`;
  for (let i = 1; i <= N; i++) {
    const x = yearToX(y0 + (y1 - y0) * i / N).toFixed(1);
    d += ` L ${x} ${(yCenter - (i === N ? 0 : half(i))).toFixed(1)}`;
  }
  for (let i = N; i >= 0; i--) {
    const x = yearToX(y0 + (y1 - y0) * i / N).toFixed(1);
    d += ` L ${x} ${(yCenter + (i === 0 || i === N ? 0 : half(i))).toFixed(1)}`;
  }
  return d + ' Z';
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
