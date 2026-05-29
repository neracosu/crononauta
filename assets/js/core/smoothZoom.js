// Interpolación de zoom suave (van Wijk & Nuij, 2003). Interpola entre dos "vistas"
// [cx, cy, w] = centro en mundo + ancho visible en mundo, de modo que el recorrido
// se sienta natural (no un escalado lineal feo). Devuelve i(t∈[0,1]) → [cx,cy,w],
// con i.duration = duración recomendada en ms.
export function interpolateZoom(a, b) {
  const rho = Math.SQRT2, rho2 = 2, rho4 = 4, eps = 1e-6;
  const [ux0, uy0, w0] = a, [ux1, uy1, w1] = b;
  const dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx*dx + dy*dy, d1 = Math.sqrt(d2);
  let S, i;
  if (d2 < eps) {
    S = Math.abs(Math.log(w1 / w0)) / rho;
    i = t => [ux0 + t*dx, uy0 + t*dy, w0 * Math.exp(rho * t * (w1 < w0 ? -S : S))];
  } else {
    const b0 = (w1*w1 - w0*w0 + rho4*d2) / (2*w0*rho2*d1);
    const b1 = (w1*w1 - w0*w0 - rho4*d2) / (2*w1*rho2*d1);
    const r0 = Math.log(Math.sqrt(b0*b0 + 1) - b0);
    const r1 = Math.log(Math.sqrt(b1*b1 + 1) - b1);
    S = (r1 - r0) / rho;
    const coshr0 = Math.cosh(r0), sinhr0 = Math.sinh(r0);
    i = t => {
      const s = t * S, u = w0 / (rho2*d1) * (coshr0 * Math.tanh(rho*s + r0) - sinhr0);
      return [ux0 + u*dx, uy0 + u*dy, w0 * coshr0 / Math.cosh(rho*s + r0)];
    };
  }
  i.duration = S * 1000 * 0.9;
  return i;
}
