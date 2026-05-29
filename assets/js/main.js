import { VERSION } from './data/version.js';
// Punto de entrada. Se completa en tareas posteriores.
const world = document.getElementById('world');
world.style.transform = 'translate(40px, 40px) scale(1)';
document.getElementById('version-badge').textContent = 'v' + VERSION;
