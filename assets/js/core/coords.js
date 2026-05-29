export const YEAR_START = -4004;
export const YEAR_END = 2026;
export const PX_PER_YEAR = 3;
export const LEFT_PAD = 60;
export const TOP_OFFSET = 96;       // espacio superior para eras + timeline
export const LANE_PITCH = 32;       // separación vertical entre carriles
export const REGION_GAP = 30;       // separación entre regiones
export const CHART_WIDTH = LEFT_PAD * 2 + (YEAR_END - YEAR_START) * PX_PER_YEAR;

export function yearToX(year) {
  return LEFT_PAD + (year - YEAR_START) * PX_PER_YEAR;
}
export function xToYear(x) {
  return Math.round((x - LEFT_PAD) / PX_PER_YEAR + YEAR_START);
}
export function formatYear(y) {
  if (y === null || y === undefined) return '';
  if (y === 0) return '1 d.C.';
  return y < 0 ? `${Math.abs(y)} a.C.` : `${y} d.C.`;
}
// Grosor pleno del río según importancia.
export function bandPeak(tier) {
  return tier === 1 ? 26 : tier === 2 ? 19 : 13;
}

// Asigna a cada región yStart y a cada civ su carril (lane) y yCenter.
// Devuelve la altura total del lienzo.
export function layout(regions, civs) {
  let y = TOP_OFFSET;
  for (const region of regions) {
    region.yStart = y;
    const inRegion = civs.filter(c => c.region === region.id);
    inRegion.forEach((c, i) => {
      c.lane = i;
      c.yCenter = region.yStart + i * LANE_PITCH + LANE_PITCH / 2;
    });
    region.laneCount = inRegion.length;
    y += inRegion.length * LANE_PITCH + REGION_GAP;
  }
  return y + 40;
}
