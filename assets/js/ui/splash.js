export function initSplash(onExplore, onTour) {
  const el = document.getElementById('splash');
  el.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;

    // Preset de audiencia: fija el selector de capas y entra a explorar
    if (btn.dataset.preset) {
      const sel = document.getElementById('layer-select');
      if (sel) { sel.value = 'preset:' + btn.dataset.preset; sel.dispatchEvent(new Event('change')); }
      el.classList.add('hidden');
      onExplore && onExplore();
      return;
    }

    const a = btn.dataset.splash;
    if (!a) return;
    el.classList.add('hidden');
    if (a === 'explore') onExplore && onExplore();
    if (a === 'tour') onTour && onTour();
  });
}
