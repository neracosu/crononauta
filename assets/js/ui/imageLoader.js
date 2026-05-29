const failed = new Set();

// Intenta cargar url en imgEl; si falla/timeout, muestra fallback en fbEl.
export function loadImage(imgEl, fbEl, url, color, icon, name) {
  imgEl.classList.remove('loaded');
  imgEl.style.display = 'none';
  fbEl.style.display = 'none';
  if (!url || failed.has(url)) return showFallback(fbEl, color, icon, name);

  const to = setTimeout(() => { failed.add(url); showFallback(fbEl, color, icon, name); }, 2500);
  imgEl.onload = () => { clearTimeout(to); imgEl.style.display = 'block'; imgEl.classList.add('loaded'); fbEl.style.display = 'none'; };
  imgEl.onerror = () => { clearTimeout(to); failed.add(url); imgEl.style.display = 'none'; showFallback(fbEl, color, icon, name); };
  imgEl.src = url;
}

export function showFallback(el, color, icon, name) {
  const bg = color || '#5c4a3a';
  el.style.display = 'flex';
  el.style.background = `linear-gradient(135deg, ${bg}cc, ${bg}88)`;
  el.innerHTML = `<span class="icon">${icon || '📜'}</span>${name || ''}`;
}
