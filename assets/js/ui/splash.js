export function initSplash(onExplore, onTour) {
  const el = document.getElementById('splash');
  el.addEventListener('click', e => {
    const a = e.target.dataset.splash; if (!a) return;
    el.classList.add('hidden');
    if (a === 'explore') onExplore && onExplore();
    if (a === 'tour') onTour && onTour();
  });
}
