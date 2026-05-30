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

// Asigna a cada grupo (región o capa) su yStart y a cada civ su carril y yCenter.
// keyOf(civ) decide a qué grupo pertenece cada civ (default: por región).
// minLanes da altura mínima a grupos sin civs (para vista Capas con filas de eventos).
// Devuelve la altura total del lienzo.
export function layout(groups, civs, keyOf = c => c.region, minLanes = 0) {
  let y = TOP_OFFSET;
  for (const g of groups) {
    g.yStart = y;
    const inG = civs.filter(c => keyOf(c) === g.id);
    inG.forEach((c, i) => {
      c.lane = i;
      c.yCenter = g.yStart + i * LANE_PITCH + LANE_PITCH / 2;
    });
    g.laneCount = inG.length;
    y += Math.max(inG.length, minLanes) * LANE_PITCH + REGION_GAP;
  }
  return y + 40;
}
