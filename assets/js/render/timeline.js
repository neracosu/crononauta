import { ERAS } from '../data/eras.js';
import { yearToX, formatYear, TOP_OFFSET } from '../core/coords.js';

const SVGNS = 'http://www.w3.org/2000/svg';

export function renderTimeline(svg, overlay, regions, totalHeight) {
  // Bandas de era
  ERAS.forEach(era => {
    const x = yearToX(era.start);
    const w = yearToX(era.end) - x;
    const rect = document.createElementNS(SVGNS, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', 30);
    rect.setAttribute('width', w);
    rect.setAttribute('height', 22);
    rect.setAttribute('fill', era.color);
    rect.setAttribute('rx', 3);
    svg.appendChild(rect);

    const label = document.createElement('div');
    label.className = 'era-banner';
    label.style.left = x + 'px';
    label.style.width = w + 'px';
    label.textContent = era.name;
    overlay.appendChild(label);
  });

  // Líneas de siglo + etiquetas
  for (let year = -4000; year <= 2000; year += 100) {
    const x = yearToX(year);
    const major = year % 500 === 0;
    const line = document.createElementNS(SVGNS, 'line');
    line.setAttribute('x1', x); line.setAttribute('x2', x);
    line.setAttribute('y1', TOP_OFFSET - 20); line.setAttribute('y2', totalHeight);
    line.setAttribute('class', 'century-line' + (major ? ' major' : ''));
    svg.appendChild(line);

    if (major || (year >= 1500 && year % 100 === 0)) {
      const lab = document.createElement('div');
      lab.className = 'century-label' + (year % 1000 === 0 ? ' major' : '');
      lab.style.left = x + 'px';
      lab.style.top = (TOP_OFFSET - 18) + 'px';
      lab.textContent = formatYear(year);
      overlay.appendChild(lab);
    }
  }

  // Etiquetas de región (vertical)
  regions.forEach(region => {
    const lab = document.createElement('div');
    lab.className = 'region-label';
    lab.style.top = (region.yStart + 6) + 'px';
    lab.textContent = region.name;
    overlay.appendChild(lab);
  });
}
