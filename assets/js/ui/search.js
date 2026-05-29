import { CIVS } from '../data/civilizations.js';

export function initSearch(goToCiv) {
  const input = document.getElementById('search-input');
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    document.querySelectorAll('.river').forEach(el => {
      if (!q) { el.style.opacity = '1'; return; }
      const c = CIVS.find(x => x.id === el.dataset.id);
      const hit = c && (c.name.toLowerCase().includes(q) || (c.desc || '').toLowerCase().includes(q));
      el.style.opacity = hit ? '1' : '.15';
    });
  });
  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const q = input.value.toLowerCase().trim();
    const found = CIVS.find(c => c.name.toLowerCase().includes(q));
    if (found) goToCiv(found.id);
  });
}
