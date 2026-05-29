# CRONONAUTA 2.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir CRONONAUTA como un atlas interactivo donde las civilizaciones fluyen como ríos del tiempo, con exploración libre (pan/zoom) y un modo Recorrido (tour), estética pergamino moderno, en HTML/CSS/JS vanilla con ES modules.

**Architecture:** Un único estado de cámara `{x, y, scale}` (módulo `core/viewport`) transforma una capa SVG (ríos, líneas, eras) y una capa HTML superpuesta (etiquetas, marcadores). `core/coords` define el mapeo año↔píxel y el layout de carriles. `render/*` genera el DOM/SVG; `ui/*` maneja la interacción; `data/*` son módulos planos editables por colaboradores. El modo tour anima la cámara entre hitos con tweens rAF.

**Tech Stack:** HTML5, CSS3 (custom properties), JavaScript ES modules nativos (sin bundler). Tests de lógica pura con el runner nativo `node --test` (cero dependencias). SVG para ríos, Canvas para minimapa.

**Testing convention:**
- **Lógica pura** (coords, rivers paths, viewport math, easing, tour camera) → tests con `node --test` en `tests/*.test.js`. Los módulos `core/`/`render/` que se testean no deben importar `document` en su top-level; las funciones puras reciben datos y devuelven strings/números.
- **Visual / DOM / UI** → verificación en producción. Tras cada tarea visual, el dueño recarga `crononauta.neracosu.com` y confirma. Estos pasos se marcan con **VERIFICAR EN PRODUCCIÓN**.
- Frecuencia de commit: un commit por tarea (al final), salvo que se indique.

**Nota sobre el prototipo:** El HTML monolítico previo es la referencia funcional para tooltip, panel, búsqueda, leyenda y minimapa. Este plan incluye el código adaptado completo; no hace falta tener el prototipo a mano.

---

## Task 1: Andamiaje — estructura, tokens y shell HTML

**Files:**
- Create: `index.html`
- Create: `assets/css/tokens.css`
- Create: `assets/css/base.css`
- Create: `assets/js/main.js`

- [ ] **Step 1: Crear `assets/css/tokens.css`** (variables y fuentes)

```css
:root {
  /* Paleta pergamino moderno */
  --parchment: #f0e2c4;
  --parchment-2: #e8d5a8;
  --parchment-dark: #d4c4a0;
  --ink: #2a1f14;
  --ink-light: #5c4a3a;
  --ink-faint: #8b7d6b;
  --gold: #b8860b;
  --gold-light: #daa520;
  --red-accent: #8b1a1a;
  --border-ornate: #6b5b4b;
  --chrome-bg: rgba(26, 20, 16, 0.92);

  /* Tipografía */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-ui: 'Inter', system-ui, sans-serif;
  --font-label: 'EB Garamond', Georgia, serif;

  /* Motion */
  --ease-soft: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --dur-cam: 900ms;
}
```

- [ ] **Step 2: Crear `assets/css/base.css`** (reset, body, scrollbar)

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

html, body { height: 100%; }

body {
  background: #1a1410;
  overflow: hidden;
  font-family: var(--font-ui);
  color: var(--ink);
  cursor: grab;
}
body.dragging { cursor: grabbing; }

#app {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* Capa que se mueve con la cámara (contiene SVG + overlay HTML) */
#world {
  position: absolute;
  top: 0; left: 0;
  transform-origin: 0 0;
  will-change: transform;
}

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
::-webkit-scrollbar-thumb { background: rgba(184,134,11,0.35); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: rgba(184,134,11,0.55); }

@media (prefers-reduced-motion: reduce) {
  :root { --dur-cam: 0ms; }
}
```

- [ ] **Step 3: Crear `index.html`** (shell con capa world = SVG + overlay)

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
<meta name="referrer" content="no-referrer">
<title>CRONONAUTA — 6000 años de historia en tus manos</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@400;500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/tokens.css">
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/chart.css">
<link rel="stylesheet" href="assets/css/ui.css">
<link rel="stylesheet" href="assets/css/panel.css">
<link rel="stylesheet" href="assets/css/tour.css">
<link rel="stylesheet" href="assets/css/responsive.css">
</head>
<body>
<div id="app">
  <div id="world">
    <svg id="chart-svg" xmlns="http://www.w3.org/2000/svg"></svg>
    <div id="overlay"></div>
  </div>
</div>
<script type="module" src="assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Crear `assets/js/data/version.js`** (única fuente de versión para la UI)

```js
// Sube esto en cada deploy con cambio visible (ver CHANGELOG.md y CLAUDE.md raíz).
export const VERSION = '0.1.0';
```

- [ ] **Step 5: Añadir el badge de versión a `index.html`** (antes de `<script>`)

```html
<footer id="appfoot">
  <a href="https://github.com/neracosu/crononauta" target="_blank" rel="noopener">github.com/neracosu/crononauta</a>
  <span id="version-badge"></span>
</footer>
```

- [ ] **Step 6: Crear `assets/js/main.js`** (placeholder de arranque + badge)

```js
import { VERSION } from './data/version.js';
// Punto de entrada. Se completa en tareas posteriores.
const world = document.getElementById('world');
world.style.transform = 'translate(40px, 40px) scale(1)';
document.getElementById('version-badge').textContent = 'v' + VERSION;
```

- [ ] **Step 7: Estilo del footer** — añadir a `assets/css/ui.css` cuando exista (Task 8); por ahora añadir a `base.css`:

```css
#appfoot { position: fixed; bottom: 6px; left: 12px; z-index: 80; display: flex; gap: 10px;
  align-items: center; font-family: var(--font-ui); font-size: 11px; color: #8b7d6b; pointer-events: none; }
#appfoot a { color: #8b7d6b; pointer-events: auto; text-decoration: none; }
#appfoot a:hover { color: var(--gold-light); }
#version-badge { font-family: var(--font-label); padding: 1px 7px; border: 1px solid rgba(184,134,11,.3);
  border-radius: 10px; color: var(--gold-light); background: rgba(26,20,16,.6); }
```

- [ ] **Step 8: Crear los CSS aún vacíos referenciados** (para que no fallen los `<link>`)

```bash
touch assets/css/chart.css assets/css/ui.css assets/css/panel.css assets/css/tour.css assets/css/responsive.css
```

- [ ] **Step 9: VERIFICAR EN PRODUCCIÓN**

Desplegar y abrir `crononauta.neracosu.com`. Esperado: fondo oscuro, sin errores en consola, badge `v0.1.0` y link al repo abajo a la izquierda. Confirmar con el dueño.

- [ ] **Step 10: Commit**

```bash
git add index.html assets/css assets/js/main.js assets/js/data/version.js
git commit -m "feat(scaffold): estructura, tokens, shell HTML y badge de versión"
```

---

## Task 2: Datos — migrar a módulos ES con campos de río

**Files:**
- Create: `assets/js/data/regions.js`
- Create: `assets/js/data/eras.js`
- Create: `assets/js/data/civilizations.js`
- Create: `assets/js/data/events.js`
- Create: `assets/js/data/images.js`

- [ ] **Step 1: Crear `assets/js/data/regions.js`**

```js
// Regiones en orden de apilado vertical. El índice es el id usado por civs/eventos.
export const REGIONS = [
  { id: 0, name: 'MEDIO ORIENTE' },
  { id: 1, name: 'MEDITERRÁNEO / EUROPA' },
  { id: 2, name: 'ASIA' },
  { id: 3, name: 'ÁFRICA' },
  { id: 4, name: 'AMÉRICAS' },
  { id: 5, name: 'NÓRDICO / OTROS' },
];
```

- [ ] **Step 2: Crear `assets/js/data/eras.js`** (última era extendida a 2026)

```js
export const ERAS = [
  { name: 'Edad Antigua',       start: -4004, end: 476,  color: 'rgba(139,26,26,0.42)' },
  { name: 'Edad Media',         start: 476,   end: 1453, color: 'rgba(85,107,47,0.42)' },
  { name: 'Renacimiento',       start: 1453,  end: 1600, color: 'rgba(75,0,130,0.40)' },
  { name: 'Edad Moderna',       start: 1600,  end: 1789, color: 'rgba(0,100,140,0.42)' },
  { name: 'Edad Contemporánea', start: 1789,  end: 2026, color: 'rgba(139,69,19,0.42)' },
];
```

- [ ] **Step 3: Crear `assets/js/data/civilizations.js`** con `tier`/`rise`/`parent` añadidos. Migrar las 42 del prototipo. `tier`: 1=Egipto/Roma/Grecia/China/Persia/Califato/Otomano/Inglaterra/Francia/España/Rusia/India/Japón/EE.UU.; 2=mayoría; 3=cortas/menores. `parent` para sucesiones claras.

```js
// Año negativo = a.C. tier: 1 mayor · 2 media · 3 menor. rise: años de crecimiento (opcional).
// parent: id de la civ de la que deriva (dibuja conector río).
export const CIVS = [
  // MEDIO ORIENTE (region 0)
  { id:'sumer', name:'Sumeria', start:-3500, end:-2000, color:'#c2955a', region:0, tier:2, desc:'Primera civilización conocida. Escritura cuneiforme, la rueda, el sistema sexagesimal. Ciudades-estado como Ur, Uruk y Lagash.' },
  { id:'egypt', name:'Egipto', start:-3100, end:-30, color:'#d4a843', region:0, tier:1, desc:'Una de las civilizaciones más longevas. Pirámides, momificación, jeroglíficos. Faraones como Ramsés II, Tutankamón y Cleopatra.' },
  { id:'akkad', name:'Acad', start:-2334, end:-2154, color:'#a67c52', region:0, tier:3, parent:'sumer', desc:'Primer imperio conocido, fundado por Sargón de Acad. Unificó las ciudades-estado sumerias.' },
  { id:'babylon', name:'Babilonia', start:-1894, end:-539, color:'#8b6914', region:0, tier:2, desc:'Centro cultural del mundo antiguo. Código de Hammurabi, Jardines Colgantes. Nabucodonosor II.' },
  { id:'assyria', name:'Asiria', start:-2500, end:-609, color:'#7a5c3a', region:0, tier:2, desc:'Imperio militar formidable. Capitales en Nínive y Asur. Biblioteca de Asurbanipal.' },
  { id:'hittites', name:'Hititas', start:-1600, end:-1178, color:'#9e8c6c', region:0, tier:3, desc:'Pueblo indoeuropeo en Anatolia. Pioneros del hierro. Batalla de Kadesh contra Egipto.' },
  { id:'phoenicia', name:'Fenicia', start:-1500, end:-300, color:'#4a90a4', region:0, tier:2, desc:'Maestros navegantes. Inventaron el primer alfabeto. Fundaron Cartago. Púrpura de Tiro.' },
  { id:'israel', name:'Israel / Judá', start:-1200, end:-586, color:'#3a6b8c', region:0, tier:2, desc:'Reinos hebreos. Saúl, David y Salomón. Primer Templo en Jerusalén.' },
  { id:'persia', name:'Persia / Aqueménida', start:-550, end:-330, color:'#b5651d', region:0, tier:1, desc:'Mayor imperio del mundo antiguo bajo Ciro y Darío. Satrapías, Camino Real. Guerras Médicas.' },
  { id:'parthia', name:'Partia', start:-247, end:224, color:'#8c6239', region:0, tier:2, desc:'Imperio iranio que rivalizó con Roma. Caballería y arqueros montados. Capital en Ctesifonte.' },
  { id:'sassanid', name:'Sasánida', start:224, end:651, color:'#9b6b3c', region:0, tier:2, parent:'parthia', desc:'Último gran imperio persa preislámico. Zoroastrismo. Rivales de Bizancio.' },
  { id:'caliphate', name:'Califato Islámico', start:632, end:1258, color:'#2e8b57', region:0, tier:1, desc:'Omeyas y Abasíes. Edad de Oro del Islam: álgebra, medicina, astronomía. Bagdad como centro cultural.' },
  { id:'ottoman', name:'Imperio Otomano', start:1299, end:1922, color:'#8b0000', region:0, tier:1, desc:'Uno de los imperios más longevos. Conquista de Constantinopla (1453). Solimán el Magnífico.' },

  // MEDITERRÁNEO / EUROPA (region 1)
  { id:'minoan', name:'Minoica', start:-2700, end:-1450, color:'#6495ed', region:1, tier:3, desc:'Civilización cretense. Palacio de Cnosos, Lineal A. Origen del mito del Minotauro.' },
  { id:'mycenae', name:'Micénica', start:-1600, end:-1100, color:'#4169e1', region:1, tier:3, parent:'minoan', desc:'Griegos de la Edad del Bronce. Guerra de Troya. Máscara de Agamenón. Lineal B.' },
  { id:'greece', name:'Grecia', start:-800, end:-146, color:'#1e90ff', region:1, tier:1, desc:'Cuna de la democracia, filosofía y teatro. Atenas, Esparta, Alejandro. Sócrates, Platón, Aristóteles.' },
  { id:'rome', name:'Roma', start:-753, end:476, color:'#dc143c', region:1, tier:1, desc:'De ciudad-estado a imperio mundial. Julio César, Augusto. Derecho romano, acueductos, coliseo.' },
  { id:'byzantine', name:'Bizancio', start:330, end:1453, color:'#9932cc', region:1, tier:1, parent:'rome', desc:'Imperio Romano de Oriente. Constantinopla. Justiniano I, Santa Sofía. Preservó la cultura clásica.' },
  { id:'frankish', name:'Francos / Francia', start:481, end:2026, color:'#4682b4', region:1, tier:1, desc:'De Clodoveo a Carlomagno, de la Revolución a la República. Catedrales góticas, Ilustración.' },
  { id:'hre', name:'Sacro Imperio Romano', start:800, end:1806, color:'#b8860b', region:1, tier:2, desc:'Sucesión del imperio carolingio. "Ni santo, ni romano, ni imperio". Centro de Europa central.' },
  { id:'england', name:'Inglaterra / G.B.', start:927, end:2026, color:'#e63946', region:1, tier:1, desc:'De Alfredo el Grande al Imperio Británico. Magna Carta, Shakespeare, Revolución Industrial.' },
  { id:'spain', name:'España', start:1479, end:2026, color:'#ff8c00', region:1, tier:1, desc:'Unión de Castilla y Aragón. Conquista de América, Siglo de Oro. Cervantes, Velázquez, Goya.' },
  { id:'russia', name:'Rusia', start:862, end:2026, color:'#556b2f', region:1, tier:1, desc:'De los varegos a los zares. Iván el Terrible, Pedro y Catalina la Grande. Hasta el Pacífico.' },
  { id:'portugal', name:'Portugal', start:1139, end:2026, color:'#228b22', region:1, tier:2, desc:'Pioneros de la exploración marítima. Vasco da Gama, Brasil, imperio en África y Asia.' },
  { id:'viking', name:'Vikingos / Nórdicos', start:793, end:1100, color:'#708090', region:1, tier:2, desc:'Navegantes y guerreros escandinavos. Islandia, Groenlandia y Vinland. Sagas y mitología.' },

  // ASIA (region 2)
  { id:'indus', name:'Valle del Indo', start:-3300, end:-1300, color:'#cd853f', region:2, tier:2, desc:'Harappa y Mohenjo-Daro. Urbanismo avanzado, drenajes, escritura no descifrada.' },
  { id:'china_ancient', name:'China (Dinastías)', start:-2070, end:1912, color:'#b22222', region:2, tier:1, desc:'Xia a Qing. Gran Muralla, pólvora, papel, brújula, imprenta. Confucio, Lao-Tse.' },
  { id:'india', name:'India', start:-600, end:2026, color:'#ff6347', region:2, tier:1, desc:'Maurya, Gupta, Mogol. Budismo, hinduismo. El cero, sistema decimal, Taj Mahal, especias.' },
  { id:'japan', name:'Japón', start:-660, end:2026, color:'#ff69b4', region:2, tier:1, desc:'De Jōmon a Meiji. Samuráis, shogunes, ukiyo-e. Aislamiento (sakoku) y modernización.' },
  { id:'mongol', name:'Imperio Mongol', start:1206, end:1368, color:'#8b4513', region:2, tier:1, desc:'Gengis Kan: el mayor imperio terrestre contiguo. Ruta de la Seda, Pax Mongolica.' },
  { id:'korea', name:'Corea', start:-57, end:2026, color:'#da70d6', region:2, tier:2, desc:'Tres Reinos, Goryeo, Joseon. Imprenta de tipos móviles de metal, hangul.' },

  // ÁFRICA (region 3)
  { id:'carthage', name:'Cartago', start:-814, end:-146, color:'#c0392b', region:3, tier:2, parent:'phoenicia', desc:'Potencia comercial fenicia del norte de África. Aníbal y los elefantes. Guerras Púnicas.' },
  { id:'ethiopia', name:'Etiopía / Aksum', start:-400, end:940, color:'#27ae60', region:3, tier:2, desc:'Reino de Aksum. Obeliscos monumentales. Uno de los primeros reinos cristianos.' },
  { id:'ghana', name:'Ghana / Mali / Songhai', start:300, end:1591, color:'#f39c12', region:3, tier:2, desc:'Imperios del África Occidental. Mansa Musa, Tombuctú como centro de aprendizaje.' },

  // AMÉRICAS (region 4)
  { id:'olmec', name:'Olmeca', start:-1500, end:-400, color:'#1abc9c', region:4, tier:2, desc:'Cultura madre de Mesoamérica. Cabezas colosales, juego de pelota, primer calendario.' },
  { id:'maya', name:'Maya', start:-2000, end:1500, color:'#16a085', region:4, tier:1, desc:'Escritura jeroglífica, calendario preciso, astronomía, pirámides, el concepto del cero.' },
  { id:'aztec', name:'Azteca / Mexica', start:1325, end:1521, color:'#e74c3c', region:4, tier:1, desc:'Tenochtitlán, de las mayores ciudades del mundo. Chinampas. Conquista por Cortés.' },
  { id:'inca', name:'Inca', start:1438, end:1533, color:'#e67e22', region:4, tier:1, desc:'Tahuantinsuyo: mayor imperio precolombino. Machu Picchu, quipus, 40.000 km de caminos.' },

  // NÓRDICO / OTROS (region 5)
  { id:'netherlands', name:'Países Bajos', start:1581, end:2026, color:'#f1c40f', region:5, tier:2, desc:'Siglo de Oro neerlandés. Compañía de las Indias Orientales, Rembrandt, Vermeer.' },
  { id:'prussia', name:'Prusia / Alemania', start:1525, end:2026, color:'#34495e', region:5, tier:1, desc:'De ducado a potencia. Federico el Grande, unificación bajo Bismarck (1871).' },
  { id:'usa', name:'Estados Unidos', start:1776, end:2026, color:'#2980b9', region:5, tier:1, desc:'Independencia, Constitución, Guerra Civil, expansión al oeste, potencia mundial.' },
  { id:'italy_unified', name:'Italia (Unificada)', start:1861, end:2026, color:'#16796f', region:5, tier:2, desc:'Risorgimento: unificación liderada por Garibaldi, Cavour y Víctor Manuel II.' },
];
```

- [ ] **Step 4: Crear `assets/js/data/events.js`** (migrar 42, `y_hint`→`region`)

```js
// region = índice 0..5 donde se ancla el marcador. golden = hito destacado.
export const EVENTS = [
  { year:-3100, name:'Unificación de Egipto', desc:'Narmer/Menes unifica Alto y Bajo Egipto.', region:0 },
  { year:-2560, name:'Gran Pirámide de Guiza', desc:'Construida para el faraón Keops.', region:0 },
  { year:-1754, name:'Código de Hammurabi', desc:'Primer código legal escrito de la historia.', region:0 },
  { year:-1274, name:'Batalla de Kadesh', desc:'Egipto vs Hititas — primer tratado de paz conocido.', region:0 },
  { year:-776, name:'Primeros Juegos Olímpicos', desc:'Celebrados en Olimpia, Grecia.', region:1 },
  { year:-753, name:'Fundación de Roma', desc:'Según la tradición, por Rómulo y Remo.', region:1 },
  { year:-509, name:'República Romana', desc:'Roma expulsa a su último rey etrusco.', region:1 },
  { year:-490, name:'Batalla de Maratón', desc:'Victoria griega sobre el Imperio Persa.', region:1 },
  { year:-331, name:'Alejandro conquista Persia', desc:'Gaugamela: cae el Imperio Aqueménida.', region:1 },
  { year:-221, name:'Unificación de China', desc:'Qin Shi Huang unifica China; Gran Muralla.', region:2 },
  { year:-146, name:'Destrucción de Cartago', desc:'Roma arrasa Cartago en la Tercera Guerra Púnica.', region:3 },
  { year:-44, name:'Asesinato de César', desc:'Julio César asesinado en los Idus de Marzo.', region:1 },
  { year:0, name:'Inicio de la Era Cristiana', desc:'Nacimiento de Jesús según la cronología tradicional.', region:0, golden:true },
  { year:79, name:'Erupción del Vesubio', desc:'Destrucción de Pompeya y Herculano.', region:1 },
  { year:313, name:'Edicto de Milán', desc:'Constantino legaliza el cristianismo en Roma.', region:1 },
  { year:476, name:'Caída de Roma', desc:'Fin del Imperio Romano de Occidente.', region:1, golden:true },
  { year:622, name:'Hégira', desc:'Mahoma emigra a Medina; inicio del Islam.', region:0, golden:true },
  { year:732, name:'Batalla de Tours/Poitiers', desc:'Carlos Martel detiene el avance musulmán en Europa.', region:1 },
  { year:800, name:'Coronación de Carlomagno', desc:'Sacro Emperador Romano por el Papa León III.', region:1 },
  { year:1066, name:'Batalla de Hastings', desc:'Guillermo el Conquistador invade Inglaterra.', region:1 },
  { year:1096, name:'Primera Cruzada', desc:'Los cruzados europeos toman Jerusalén.', region:0 },
  { year:1206, name:'Imperio Mongol', desc:'Gengis Kan unifica las tribus mongolas.', region:2, golden:true },
  { year:1215, name:'Magna Carta', desc:'Limitación del poder real en Inglaterra.', region:1 },
  { year:1325, name:'Fundación de Tenochtitlán', desc:'Los mexicas fundan su gran capital.', region:4 },
  { year:1347, name:'Peste Negra', desc:'Mata a un tercio de la población europea.', region:1, golden:true },
  { year:1440, name:'Imprenta de Gutenberg', desc:'Revoluciona la difusión del conocimiento.', region:1, golden:true },
  { year:1453, name:'Caída de Constantinopla', desc:'Los otomanos toman la capital bizantina.', region:0, golden:true },
  { year:1492, name:'Descubrimiento de América', desc:'Colón llega al Nuevo Mundo.', region:4, golden:true },
  { year:1517, name:'Reforma Protestante', desc:'Martín Lutero publica sus 95 tesis.', region:1, golden:true },
  { year:1521, name:'Caída de Tenochtitlán', desc:'Hernán Cortés conquista el Imperio Azteca.', region:4 },
  { year:1533, name:'Caída del Imperio Inca', desc:'Pizarro ejecuta a Atahualpa.', region:4 },
  { year:1588, name:'Derrota de la Armada', desc:'La Armada Invencible española es derrotada.', region:1 },
  { year:1642, name:'Rev. Científica: Newton', desc:'Nacimiento de Isaac Newton.', region:1 },
  { year:1776, name:'Independencia de EE.UU.', desc:'Declaración de Independencia.', region:5, golden:true },
  { year:1789, name:'Revolución Francesa', desc:'Toma de la Bastilla; inicio de la Revolución.', region:1, golden:true },
  { year:1804, name:'Napoleón Emperador', desc:'Napoleón se corona emperador de Francia.', region:1 },
  { year:1815, name:'Batalla de Waterloo', desc:'Derrota final de Napoleón Bonaparte.', region:1 },
  { year:1848, name:'Revoluciones de 1848', desc:'Ola revolucionaria por toda Europa.', region:1 },
  { year:1859, name:'El Origen de las Especies', desc:'Darwin publica su teoría de la evolución.', region:1 },
  { year:1865, name:'Fin Guerra Civil EE.UU.', desc:'Abolición de la esclavitud.', region:5 },
  { year:1871, name:'Unificación de Alemania', desc:'Bismarck unifica los estados alemanes.', region:5 },
  { year:1876, name:'Teléfono', desc:'Alexander Graham Bell patenta el teléfono.', region:5 },
];
```

- [ ] **Step 5: Crear `assets/js/data/images.js`** (rutas locales + iconos fallback)

```js
// Las imágenes se descargan a /assets/img/ en la Task 16. Hasta entonces, el loader
// usará el fallback de emoji+color. Ruta local por id de civ y por nombre de evento.
export const CIV_IMG = id => `assets/img/civs/${id}.jpg`;
export const EVENT_IMG = name => `assets/img/events/${slug(name)}.jpg`;

export function slug(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const CIV_ICONS = {
  sumer:'🏛️', egypt:'🔺', akkad:'⚔️', babylon:'🏗️', assyria:'🦁', hittites:'🗡️',
  phoenicia:'⚓', israel:'✡️', persia:'🏛️', parthia:'🐴', sassanid:'🔥', caliphate:'☪️',
  ottoman:'🕌', minoan:'🐂', mycenae:'🛡️', greece:'🏛️', rome:'🏟️', byzantine:'⛪',
  frankish:'⚜️', hre:'👑', england:'🏰', spain:'🏰', russia:'🪆', portugal:'⛵',
  viking:'⚔️', indus:'🧱', china_ancient:'🐉', india:'🕉️', japan:'⛩️', mongol:'🏹',
  korea:'🎋', carthage:'⚓', ethiopia:'🗿', ghana:'👑', olmec:'🗿', maya:'🔮', aztec:'☀️',
  inca:'🏔️', netherlands:'🌷', prussia:'🦅', usa:'🗽', italy_unified:'🏟️',
};

export const DEFAULT_ICON = '📜';
```

- [ ] **Step 6: Crear `assets/js/data/CLAUDE.md`** (doc path-scoped para colaboradores de datos)

```markdown
# assets/js/data/ — Datos históricos (zona de colaboración)

Se carga automáticamente al editar archivos de esta carpeta. Aquí viven los datos que
cualquiera puede aportar. **No requiere saber programar**: editar un objeto y abrir PR.

## Schema

**Civilización** (`civilizations.js`): `id` único sin tildes/espacios · `name` · `start`/`end`
(año, **negativo = a.C.**) · `color` hex · `region` 0–5 (ver `regions.js`) · `tier` 1|2|3
(importancia → grosor del río) · `parent` opcional (id del que deriva → dibuja conector) · `desc`.

**Evento** (`events.js`): `year` · `name` · `desc` · `region` 0–5 · `golden` opcional (hito).

**Hito de tour** (`tour.js`): `id` · `title` · `caption` · `focus` ({civId}|{year,region}|{eventName}) · `zoom`.

## Reglas
- Años a.C. **negativos** (`-753`). `id` único y estable (no renombrar; otros datos lo referencian).
- Citar fuente confiable en el PR. Imágenes solo de dominio público / CC.
- No tocar `version.js` ni la lógica de `core/`/`render/`/`ui/` al aportar datos.
```

- [ ] **Step 7: Commit**

```bash
git add assets/js/data
git commit -m "feat(data): civilizaciones, eventos, eras, regiones + doc path-scoped"
```

---

## Task 3: `core/coords` — mapeo año↔píxel y layout (TDD)

**Files:**
- Create: `assets/js/core/coords.js`
- Test: `tests/coords.test.js`

- [ ] **Step 1: Escribir el test que falla** `tests/coords.test.js`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  YEAR_START, PX_PER_YEAR, LEFT_PAD, yearToX, xToYear, formatYear,
  bandPeak, layout, CHART_WIDTH,
} from '../assets/js/core/coords.js';

test('yearToX ubica YEAR_START en LEFT_PAD', () => {
  assert.equal(yearToX(YEAR_START), LEFT_PAD);
});

test('yearToX avanza PX_PER_YEAR por año', () => {
  assert.equal(yearToX(YEAR_START + 100), LEFT_PAD + 100 * PX_PER_YEAR);
});

test('xToYear es inverso de yearToX', () => {
  assert.equal(xToYear(yearToX(1492)), 1492);
});

test('formatYear marca a.C. / d.C. y año 0 como 1 d.C.', () => {
  assert.equal(formatYear(-753), '753 a.C.');
  assert.equal(formatYear(476), '476 d.C.');
  assert.equal(formatYear(0), '1 d.C.');
});

test('bandPeak decrece con el tier', () => {
  assert.ok(bandPeak(1) > bandPeak(2));
  assert.ok(bandPeak(2) > bandPeak(3));
});

test('layout asigna yCenter creciente dentro de una región y devuelve altura total', () => {
  const regions = [{ id:0, name:'R0' }, { id:1, name:'R1' }];
  const civs = [
    { id:'a', region:0 }, { id:'b', region:0 }, { id:'c', region:1 },
  ];
  const total = layout(regions, civs);
  assert.ok(regions[0].yStart < regions[1].yStart);
  assert.ok(civs[1].yCenter > civs[0].yCenter);
  assert.equal(civs[0].region, regions[0].id);
  assert.ok(total > regions[1].yStart);
  assert.ok(CHART_WIDTH > 0);
});
```

- [ ] **Step 2: Ejecutar el test y verque falla**

Run: `node --test tests/coords.test.js`
Expected: FAIL (módulo inexistente / exports indefinidos).

- [ ] **Step 3: Implementar `assets/js/core/coords.js`**

```js
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
```

- [ ] **Step 4: Ejecutar el test y verificar que pasa**

Run: `node --test tests/coords.test.js`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add assets/js/core/coords.js tests/coords.test.js
git commit -m "feat(core): coords con mapeo año↔píxel y layout de carriles (TDD)"
```

---

## Task 4: `core/viewport` — pan/zoom y cámara animada con van Wijk (TDD para la matemática)

**Files:**
- Create: `assets/js/core/easing.js`
- Create: `assets/js/core/smoothZoom.js`
- Create: `assets/js/core/viewport.js`
- Test: `tests/viewport.test.js`
- Test: `tests/smoothZoom.test.js`

- [ ] **Step 1: Escribir el test que falla** `tests/viewport.test.js`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { easeInOutCubic } from '../assets/js/core/easing.js';
import { zoomAtMath, frameRect, clampScale } from '../assets/js/core/viewport.js';

test('easeInOutCubic en extremos y medio', () => {
  assert.equal(easeInOutCubic(0), 0);
  assert.equal(easeInOutCubic(1), 1);
  assert.ok(Math.abs(easeInOutCubic(0.5) - 0.5) < 1e-9);
});

test('clampScale respeta límites', () => {
  assert.equal(clampScale(100), 8);
  assert.equal(clampScale(0.001), 0.12);
  assert.equal(clampScale(1), 1);
});

test('zoomAtMath mantiene fijo el punto bajo el cursor', () => {
  const s = { x: 0, y: 0, scale: 1 };
  // mundo bajo el cursor de pantalla (200,100) antes del zoom:
  const worldBefore = { x: (200 - s.x) / s.scale, y: (100 - s.y) / s.scale };
  const r = zoomAtMath(s, 2, 200, 100);
  const worldAfter = { x: (200 - r.x) / r.scale, y: (100 - r.y) / r.scale };
  assert.ok(Math.abs(worldBefore.x - worldAfter.x) < 1e-6);
  assert.ok(Math.abs(worldBefore.y - worldAfter.y) < 1e-6);
  assert.equal(r.scale, 2);
});

test('frameRect centra y escala un rect en el viewport', () => {
  const rect = { x: 1000, y: 500, w: 400, h: 200 };
  const t = frameRect(rect, 800, 600, 1.5); // zoom objetivo 1.5
  // el centro del rect debe caer en el centro del viewport
  const cx = t.x + (rect.x + rect.w / 2) * t.scale;
  const cy = t.y + (rect.y + rect.h / 2) * t.scale;
  assert.ok(Math.abs(cx - 400) < 1e-6);
  assert.ok(Math.abs(cy - 300) < 1e-6);
  assert.equal(t.scale, 1.5);
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `node --test tests/viewport.test.js`
Expected: FAIL.

- [ ] **Step 3: Implementar `assets/js/core/easing.js`**

```js
export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
```

- [ ] **Step 3b: Escribir test de smoothZoom** `tests/smoothZoom.test.js`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interpolateZoom } from '../assets/js/core/smoothZoom.js';

test('interpolateZoom respeta extremos y da duración positiva', () => {
  const a = [0, 0, 1000], b = [4000, 600, 300];
  const i = interpolateZoom(a, b);
  const v0 = i(0), v1 = i(1);
  for (let k = 0; k < 3; k++) {
    assert.ok(Math.abs(v0[k] - a[k]) < 1e-3);
    assert.ok(Math.abs(v1[k] - b[k]) < 1e-3);
  }
  assert.ok(i.duration > 0);
});

test('interpolateZoom maneja el caso de mismo punto (solo zoom)', () => {
  const i = interpolateZoom([100, 100, 1000], [100, 100, 200]);
  const mid = i(0.5);
  assert.ok(Math.abs(mid[0] - 100) < 1e-6);
  assert.ok(mid[2] < 1000 && mid[2] > 200);
});
```

- [ ] **Step 3c: Implementar `assets/js/core/smoothZoom.js`** (interpolación de zoom van Wijk, igual que `d3.interpolateZoom`)

```js
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
```

- [ ] **Step 4: Implementar `assets/js/core/viewport.js`** (matemática pura + factory con DOM/rAF + cámara van Wijk)

```js
import { easeInOutCubic } from './easing.js';
import { interpolateZoom } from './smoothZoom.js';

export const SCALE_MIN = 0.12;
export const SCALE_MAX = 8;

export function clampScale(s) {
  return Math.max(SCALE_MIN, Math.min(SCALE_MAX, s));
}

// Zoom hacia (sx,sy) en coords de pantalla. Devuelve nuevo {x,y,scale}.
export function zoomAtMath(state, factor, sx, sy) {
  const scale = clampScale(state.scale * factor);
  const k = scale / state.scale;
  return { x: sx - (sx - state.x) * k, y: sy - (sy - state.y) * k, scale };
}

// Transform que enmarca y centra worldRect {x,y,w,h} en un viewport vw×vh a un zoom dado.
export function frameRect(rect, vw, vh, scale) {
  const cxWorld = rect.x + rect.w / 2;
  const cyWorld = rect.y + rect.h / 2;
  return { x: vw / 2 - cxWorld * scale, y: vh / 2 - cyWorld * scale, scale };
}

// Factory con estado vivo, aplica transform al DOM y anima con rAF.
export function createViewport(el, onChange) {
  const state = { x: 0, y: 0, scale: 1 };
  let raf = null;

  function apply() {
    el.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
    onChange && onChange(state);
  }
  function set(next) {
    state.x = next.x; state.y = next.y; state.scale = clampScale(next.scale);
    apply();
  }
  function panBy(dx, dy) { state.x += dx; state.y += dy; apply(); }
  function zoomAt(factor, sx, sy) { set(zoomAtMath(state, factor, sx, sy)); }

  // estado {x,y,scale} ↔ vista van Wijk [cx,cy,w] (centro en mundo + ancho visible en mundo)
  function viewOf(st, vw) { return [ (vw/2 - st.x)/st.scale, (innerHeight/2 - st.y)/st.scale, vw/st.scale ]; }
  function stateOfView([cx, cy, w], vw) { const s = vw / w; return { x: vw/2 - cx*s, y: innerHeight/2 - cy*s, scale: s }; }

  function animateTo(target) {
    if (raf) cancelAnimationFrame(raf);
    const to = { ...target, scale: clampScale(target.scale) };
    // reduce-motion → salto directo
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { set(to); return; }
    const vw = innerWidth;
    const interp = interpolateZoom(viewOf(state, vw), viewOf(to, vw));
    const dur = Math.max(220, Math.min(1400, interp.duration));
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur);
      const ns = stateOfView(interp(easeInOutCubic(p)), vw);   // easing temporal sobre la trayectoria van Wijk
      state.x = ns.x; state.y = ns.y; state.scale = clampScale(ns.scale);
      apply();
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  return { state, set, panBy, zoomAt, animateTo, apply };
}
```

- [ ] **Step 5: Ejecutar y verificar que pasan**

Run: `node --test tests/viewport.test.js tests/smoothZoom.test.js`
Expected: PASS (4 + 2 tests).

- [ ] **Step 6: Commit**

```bash
git add assets/js/core/easing.js assets/js/core/smoothZoom.js assets/js/core/viewport.js tests/viewport.test.js tests/smoothZoom.test.js
git commit -m "feat(core): viewport con zoom-al-cursor + cámara van Wijk (TDD)"
```

---

## Task 5: Render de timeline + bandas simples y pan/zoom de extremo a extremo

Meta: ver el lienzo navegable en producción con bandas rectangulares (los ríos llegan en Task 6).

**Files:**
- Create: `assets/js/render/timeline.js`
- Create: `assets/css/chart.css` (reemplaza el vacío)
- Modify: `assets/js/main.js`

- [ ] **Step 1: Implementar `assets/js/render/timeline.js`** (eras, líneas de siglo, etiquetas, regiones → SVG + overlay)

```js
import { ERAS } from '../data/eras.js';
import { yearToX, formatYear, TOP_OFFSET } from '../core/coords.js';

const SVGNS = 'http://www.w3.org/2000/svg';

export function renderTimeline(svg, overlay, regions, totalHeight) {
  // Bandas de era
  ERAS.forEach(era => {
    const x = yearToX(era.start);
    const w = (era.end - era.start) * yearToX.PX; // se usa width directo abajo
    const rect = document.createElementNS(SVGNS, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', 30);
    rect.setAttribute('width', yearToX(era.end) - x);
    rect.setAttribute('height', 22);
    rect.setAttribute('fill', era.color);
    rect.setAttribute('rx', 3);
    svg.appendChild(rect);

    const label = document.createElement('div');
    label.className = 'era-banner';
    label.style.left = x + 'px';
    label.style.width = (yearToX(era.end) - x) + 'px';
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
```
> Nota: elimina la línea `const w = ...` no usada; el width se calcula con `yearToX(era.end) - x`. (Incluida arriba solo como recordatorio — bórrala al implementar.)

- [ ] **Step 2: Escribir `assets/css/chart.css`**

```css
#chart-svg { position: absolute; top: 0; left: 0; overflow: visible; }
#overlay { position: absolute; top: 0; left: 0; }

#world {
  background:
    repeating-linear-gradient(90deg, transparent 0 199px, rgba(107,91,75,.07) 199px 200px),
    linear-gradient(135deg, #f5e6c8, #eedcb5 25%, #f0e2c4 50%, #e8d5a8 75%, #f2e4c0);
  border: 3px solid var(--border-ornate);
  box-shadow: inset 0 0 80px rgba(42,31,20,.15);
}

.century-line { stroke: rgba(42,31,20,.13); stroke-width: 1; }
.century-line.major { stroke: rgba(42,31,20,.22); stroke-width: 2; }

.century-label {
  position: absolute; transform: translateX(-50%);
  font-family: var(--font-display); font-size: 11px; font-weight: 700;
  color: var(--ink-light); white-space: nowrap; pointer-events: none;
  text-shadow: 1px 1px 2px rgba(240,226,196,.9);
}
.century-label.major { font-size: 13px; color: var(--red-accent); }

.era-banner {
  position: absolute; top: 30px; height: 22px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: 10px; font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,.95);
  text-shadow: 0 1px 2px rgba(0,0,0,.5); pointer-events: none;
  border: 1px solid rgba(255,255,255,.15); border-radius: 3px;
}

.region-label {
  position: absolute; left: 6px;
  font-family: var(--font-display); font-size: 11px; font-weight: 900;
  letter-spacing: 3px; text-transform: uppercase; color: var(--ink-faint);
  writing-mode: vertical-rl; transform: rotate(180deg); pointer-events: none;
}

/* Banda temporal (simple, sustituida por ríos en Task 6) */
.civ-band { position: absolute; border-radius: 4px; cursor: pointer; }
.civ-label {
  position: absolute; font-family: var(--font-label); font-size: 11px; font-weight: 600;
  color: rgba(255,255,255,.96); text-shadow: 0 1px 3px rgba(0,0,0,.7);
  white-space: nowrap; pointer-events: none; transform: translateY(-50%);
}
```

- [ ] **Step 3: Implementar `assets/js/main.js`** (wire: layout, svg sizing, timeline, bandas simples, viewport + listeners)

```js
import { REGIONS } from './data/regions.js';
import { CIVS } from './data/civilizations.js';
import { layout, yearToX, bandPeak, CHART_WIDTH } from './core/coords.js';
import { createViewport } from './core/viewport.js';
import { renderTimeline } from './render/timeline.js';

const world = document.getElementById('world');
const svg = document.getElementById('chart-svg');
const overlay = document.getElementById('overlay');

const totalHeight = layout(REGIONS, CIVS);
world.style.width = CHART_WIDTH + 'px';
world.style.height = totalHeight + 'px';
svg.setAttribute('width', CHART_WIDTH);
svg.setAttribute('height', totalHeight);
svg.setAttribute('viewBox', `0 0 ${CHART_WIDTH} ${totalHeight}`);

renderTimeline(svg, overlay, REGIONS, totalHeight);

// Bandas simples (provisional)
CIVS.forEach(civ => {
  const x = yearToX(civ.start);
  const w = Math.max(yearToX(civ.end) - x, 18);
  const peak = bandPeak(civ.tier);
  const band = document.createElement('div');
  band.className = 'civ-band';
  band.dataset.id = civ.id;
  band.style.left = x + 'px';
  band.style.top = (civ.yCenter - peak / 2) + 'px';
  band.style.width = w + 'px';
  band.style.height = peak + 'px';
  band.style.background = civ.color;
  overlay.appendChild(band);

  const lab = document.createElement('div');
  lab.className = 'civ-label';
  lab.style.left = (x + 6) + 'px';
  lab.style.top = civ.yCenter + 'px';
  lab.textContent = civ.name;
  overlay.appendChild(lab);
});

// Viewport + interacción
const vp = createViewport(world);
vp.set({ x: -yearToX(-1000) * 0.55 + innerWidth / 2, y: -totalHeight * 0.2, scale: 0.55 });

const app = document.getElementById('app');
let drag = null;
app.addEventListener('mousedown', e => {
  drag = { sx: e.clientX, sy: e.clientY, px: vp.state.x, py: vp.state.y };
  document.body.classList.add('dragging');
});
addEventListener('mousemove', e => {
  if (!drag) return;
  vp.set({ x: drag.px + (e.clientX - drag.sx), y: drag.py + (e.clientY - drag.sy), scale: vp.state.scale });
});
addEventListener('mouseup', () => { drag = null; document.body.classList.remove('dragging'); });

app.addEventListener('wheel', e => {
  e.preventDefault();
  const r = app.getBoundingClientRect();
  vp.zoomAt(e.deltaY > 0 ? 0.9 : 1.1, e.clientX - r.left, e.clientY - r.top);
}, { passive: false });

// Exponer para depurar / siguientes tareas
window.CRONO = { vp, REGIONS, CIVS, totalHeight };
```

- [ ] **Step 4: VERIFICAR EN PRODUCCIÓN**

Desplegar y recargar. Esperado: pergamino con eras arriba, líneas de siglo, etiquetas de región vertical, bandas de colores por civilización; arrastrar mueve, scroll hace zoom hacia el cursor. Confirmar con el dueño.

- [ ] **Step 5: Commit**

```bash
git add assets/js/render/timeline.js assets/css/chart.css assets/js/main.js
git commit -m "feat(render): timeline (eras/siglos/regiones) + bandas simples + pan/zoom navegable"
```

---

## Task 6: `render/rivers` — bandas orgánicas afiladas (TDD del path) + integración

**Files:**
- Create: `assets/js/render/rivers.js`
- Test: `tests/rivers.test.js`
- Modify: `assets/js/main.js` (sustituir bandas simples por ríos SVG)
- Modify: `assets/css/chart.css` (estilo de río + etiqueta)

- [ ] **Step 1: Escribir el test que falla** `tests/rivers.test.js`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { riverPath } from '../assets/js/render/rivers.js';
import { yearToX } from '../assets/js/core/coords.js';

const civ = { start:-753, end:476, tier:1, yCenter:200 };

test('riverPath devuelve un path cerrado que empieza con M y termina con Z', () => {
  const d = riverPath(civ);
  assert.match(d, /^M/);
  assert.match(d.trim(), /Z$/);
});

test('riverPath empieza y termina en la línea central (afilado)', () => {
  const d = riverPath(civ);
  const first = d.match(/M\s*([-\d.]+)[ ,]+([-\d.]+)/);
  const x0 = parseFloat(first[1]); const y0 = parseFloat(first[2]);
  assert.ok(Math.abs(x0 - yearToX(civ.start)) < 1);
  assert.ok(Math.abs(y0 - civ.yCenter) < 1); // nace fino en el centro
});

test('riverPath de tier 1 es más grueso que tier 3', () => {
  // contamos la coordenada Y mínima alcanzada (más arriba = más grueso)
  const minY = d => Math.min(...[...d.matchAll(/[-\d.]+[ ,]+([-\d.]+)/g)].map(m => parseFloat(m[1])));
  const t1 = minY(riverPath({ ...civ, tier:1 }));
  const t3 = minY(riverPath({ ...civ, tier:3 }));
  assert.ok(t1 < t3); // tier1 sube más (más grueso)
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `node --test tests/rivers.test.js`
Expected: FAIL.

- [ ] **Step 3: Implementar `assets/js/render/rivers.js`**

```js
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

  // Borde superior (izq→der) y borde inferior (der→izq), cerrado.
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
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `node --test tests/rivers.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Integrar en `main.js`** — reemplazar el bloque "Bandas simples (provisional)" por ríos SVG con gradiente y etiqueta. Sustituir ese bloque por:

```js
import { riverPath } from './render/rivers.js';   // añadir junto a los demás imports
// ... (tras renderTimeline)

// Gradiente de volumen reutilizable
const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
defs.innerHTML = `<linearGradient id="riverShade" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="rgba(255,255,255,0.28)"/>
  <stop offset="45%" stop-color="rgba(255,255,255,0)"/>
  <stop offset="100%" stop-color="rgba(0,0,0,0.16)"/>
</linearGradient>`;
svg.appendChild(defs);

const SVGNS = 'http://www.w3.org/2000/svg';
const brightColors = ['#d4a843','#f1c40f','#f39c12','#ff8c00','#daa520','#cd853f','#c2955a'];

CIVS.forEach(civ => {
  // río (color) + sombreado
  const fill = document.createElementNS(SVGNS, 'path');
  fill.setAttribute('d', riverPath(civ));
  fill.setAttribute('fill', civ.color);
  fill.setAttribute('class', 'river');
  fill.dataset.id = civ.id;
  svg.appendChild(fill);

  const shade = document.createElementNS(SVGNS, 'path');
  shade.setAttribute('d', riverPath(civ));
  shade.setAttribute('fill', 'url(#riverShade)');
  shade.setAttribute('pointer-events', 'none');
  svg.appendChild(shade);

  // etiqueta (overlay HTML)
  const lab = document.createElement('div');
  lab.className = 'civ-label' + (brightColors.includes(civ.color) ? ' dark' : '');
  lab.style.left = (yearToX(civ.start) + 8) + 'px';
  lab.style.top = civ.yCenter + 'px';
  lab.textContent = civ.name;
  overlay.appendChild(lab);
});
```

- [ ] **Step 6: Añadir estilo de río a `assets/css/chart.css`** (sustituye la regla `.civ-band`)

```css
.river { cursor: pointer; transition: filter .18s; }
.river:hover { filter: brightness(1.12) saturate(1.15); }
.civ-label.dark { color: rgba(0,0,0,.82); text-shadow: 0 1px 2px rgba(255,255,255,.5); }
```

- [ ] **Step 7: VERIFICAR EN PRODUCCIÓN**

Recargar. Esperado: cada civilización ahora es un río afilado (fino→grueso→fino) con volumen; los de tier 1 más gruesos. Confirmar con el dueño.

- [ ] **Step 8: Commit**

```bash
git add assets/js/render/rivers.js tests/rivers.test.js assets/js/main.js assets/css/chart.css
git commit -m "feat(render): ríos orgánicos afilados en SVG con gradiente de volumen (TDD)"
```

---

## Task 7: Conectores de división/fusión

**Files:**
- Modify: `assets/js/main.js`
- Modify: `assets/css/chart.css`

- [ ] **Step 1: Dibujar conectores antes de los ríos** en `main.js` (insertar tras crear `defs`, antes del `CIVS.forEach`):

```js
import { connectorPath } from './render/rivers.js'; // añadir al import existente de rivers
const byId = Object.fromEntries(CIVS.map(c => [c.id, c]));
CIVS.filter(c => c.parent && byId[c.parent]).forEach(child => {
  const conn = document.createElementNS(SVGNS, 'path');
  conn.setAttribute('d', connectorPath(byId[child.parent], child));
  conn.setAttribute('class', 'river-connector');
  conn.setAttribute('fill', child.color);
  svg.appendChild(conn);
});
```

- [ ] **Step 2: Estilo del conector** en `chart.css`:

```css
.river-connector { opacity: .45; pointer-events: none; }
```

- [ ] **Step 3: VERIFICAR EN PRODUCCIÓN**

Recargar. Esperado: cintas tenues conectan Roma→Bizancio, Sumeria→Acad, Minoica→Micénica, Partia→Sasánida, Fenicia→Cartago. Confirmar.

- [ ] **Step 4: Commit**

```bash
git add assets/js/main.js assets/css/chart.css
git commit -m "feat(render): conectores bezier de división/fusión entre civilizaciones"
```

---

## Task 8: `ui/tooltip` — hover con imagen/fallback

**Files:**
- Create: `assets/js/ui/imageLoader.js`
- Create: `assets/js/ui/tooltip.js`
- Create: `assets/css/ui.css` (reemplaza vacío)
- Modify: `assets/js/main.js`

- [ ] **Step 1: Implementar `assets/js/ui/imageLoader.js`** (carga robusta con fallback emoji+color)

```js
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
```

- [ ] **Step 2: Implementar `assets/js/ui/tooltip.js`**

```js
import { formatYear } from '../core/coords.js';
import { loadImage } from './imageLoader.js';
import { CIV_IMG, EVENT_IMG, CIV_ICONS, DEFAULT_ICON } from '../data/images.js';

let el;
function ensure() {
  if (el) return el;
  el = document.createElement('div');
  el.id = 'tooltip';
  el.innerHTML = `<img class="tt-img" referrerpolicy="no-referrer"><div class="tt-fb"></div>
    <div class="tt-title"></div><div class="tt-dates"></div><div class="tt-desc"></div>`;
  document.body.appendChild(el);
  return el;
}

export function showTooltip(e, data) {
  ensure();
  el.querySelector('.tt-title').textContent = data.name;
  el.querySelector('.tt-dates').textContent = data.end != null
    ? `${formatYear(data.start)} — ${formatYear(data.end)}` : formatYear(data.start);
  el.querySelector('.tt-desc').textContent = data.desc || '';
  const url = data.id ? CIV_IMG(data.id) : EVENT_IMG(data.name);
  const icon = (data.id && CIV_ICONS[data.id]) || DEFAULT_ICON;
  loadImage(el.querySelector('.tt-img'), el.querySelector('.tt-fb'), url, data.color, icon, data.name);
  el.style.display = 'block';
  moveTooltip(e);
}

export function moveTooltip(e) {
  if (!el) return;
  let x = e.clientX + 16, y = e.clientY + 16;
  if (x + 320 > innerWidth) x = e.clientX - 320;
  if (y + 220 > innerHeight) y = e.clientY - 220;
  el.style.left = x + 'px'; el.style.top = y + 'px';
}

export function hideTooltip() { if (el) el.style.display = 'none'; }
```

- [ ] **Step 3: Escribir `assets/css/ui.css`** (tooltip + chrome base; el resto del chrome se añade en tareas siguientes)

```css
#tooltip {
  position: fixed; display: none; z-index: 1000; max-width: 320px; pointer-events: none;
  background: linear-gradient(135deg,#2a1f14,#3d2b1f); color: #f0e2c4;
  padding: 12px 14px; border: 1px solid var(--gold); border-radius: 6px;
  box-shadow: 0 8px 32px rgba(0,0,0,.5); font-family: var(--font-ui); line-height: 1.45;
}
#tooltip .tt-img { width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px; display: none; }
#tooltip .tt-fb { width: 100%; height: 80px; border-radius: 4px; margin-bottom: 8px; display: none;
  align-items: center; justify-content: center; font-size: 16px; color: rgba(255,255,255,.85); gap: 8px; }
#tooltip .tt-fb .icon { font-size: 28px; }
#tooltip .tt-title { font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--gold-light); }
#tooltip .tt-dates { font-size: 12px; color: #b8a88a; font-style: italic; margin: 2px 0 6px; }
#tooltip .tt-desc { font-size: 13px; }
```

- [ ] **Step 4: Conectar hover en `main.js`** — dentro del `CIVS.forEach`, tras crear `fill`, añadir:

```js
import { showTooltip, moveTooltip, hideTooltip } from './ui/tooltip.js'; // import arriba
fill.addEventListener('mouseenter', e => showTooltip(e, civ));
fill.addEventListener('mousemove', moveTooltip);
fill.addEventListener('mouseleave', hideTooltip);
```

- [ ] **Step 5: VERIFICAR EN PRODUCCIÓN**

Recargar. Esperado: hover sobre un río muestra tooltip con fechas, descripción y (de momento) fallback de emoji+color. Confirmar.

- [ ] **Step 6: Commit**

```bash
git add assets/js/ui/imageLoader.js assets/js/ui/tooltip.js assets/css/ui.css assets/js/main.js
git commit -m "feat(ui): tooltip con carga de imagen robusta y fallback"
```

---

## Task 9: `ui/panel` — panel lateral al hacer click

**Files:**
- Create: `assets/js/ui/panel.js`
- Create: `assets/css/panel.css` (reemplaza vacío)
- Modify: `index.html` (añadir nodo del panel)
- Modify: `assets/js/main.js`

- [ ] **Step 1: Añadir el panel a `index.html`** (antes de `<script>`)

```html
<aside id="info-panel" aria-hidden="true">
  <button class="panel-close" aria-label="Cerrar">✕</button>
  <img id="panel-hero" referrerpolicy="no-referrer" alt="">
  <div id="panel-fb" class="panel-fb"></div>
  <div class="panel-head"><h2 id="panel-title"></h2><div id="panel-dates"></div></div>
  <div id="panel-body" class="panel-body"></div>
</aside>
```

- [ ] **Step 2: Implementar `assets/js/ui/panel.js`**

```js
import { formatYear } from '../core/coords.js';
import { CIVS } from '../data/civilizations.js';
import { EVENTS } from '../data/events.js';
import { REGIONS } from '../data/regions.js';
import { loadImage } from './imageLoader.js';
import { CIV_IMG, EVENT_IMG, CIV_ICONS, DEFAULT_ICON } from '../data/images.js';

let onNavigate = null;
export function initPanel(navFn) {
  onNavigate = navFn;
  document.querySelector('.panel-close').addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
}

export function openPanel(data) {
  const panel = document.getElementById('info-panel');
  document.getElementById('panel-title').textContent = data.name;
  document.getElementById('panel-dates').textContent = data.end != null
    ? `${formatYear(data.start)} — ${formatYear(data.end)}` : formatYear(data.start);

  const url = data.id ? CIV_IMG(data.id) : EVENT_IMG(data.name);
  loadImage(document.getElementById('panel-hero'), document.getElementById('panel-fb'),
    url, data.color || '#daa520', (data.id && CIV_ICONS[data.id]) || DEFAULT_ICON, data.name);

  let html = `<p>${data.desc || ''}</p>`;
  if (!data.isEvent) {
    const dur = data.end - data.start;
    html += `<p class="muted">Duración aproximada: <strong>${dur.toLocaleString('es')} años</strong></p>`;
    html += `<div class="tags"><span class="tag">${REGIONS[data.region]?.name || ''}</span></div>`;
    const contemp = CIVS.filter(c => c.id !== data.id && c.start < data.end && c.end > data.start);
    if (contemp.length) {
      html += `<p class="muted strong">Contemporáneas:</p><div class="tags">`;
      contemp.forEach(c => html += `<span class="tag link" data-civ="${c.id}" style="border-color:${c.color}">${c.name}</span>`);
      html += `</div>`;
    }
    const evs = EVENTS.filter(ev => ev.year >= data.start && ev.year <= data.end);
    if (evs.length) {
      html += `<p class="muted strong">Eventos del período:</p>`;
      evs.forEach(ev => html += `<p class="ev"><strong>${formatYear(ev.year)}</strong> — ${ev.name}</p>`);
    }
  }
  const body = document.getElementById('panel-body');
  body.innerHTML = html;
  body.querySelectorAll('.tag.link').forEach(t =>
    t.addEventListener('click', () => onNavigate && onNavigate(t.dataset.civ)));
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
}

export function closePanel() {
  const p = document.getElementById('info-panel');
  p.classList.remove('open'); p.setAttribute('aria-hidden', 'true');
}
```

- [ ] **Step 3: Escribir `assets/css/panel.css`**

```css
#info-panel {
  position: fixed; top: 0; right: -440px; width: 420px; max-width: 92vw; height: 100vh;
  background: linear-gradient(180deg,#2a1f14,#1a1410); color: #f0e2c4; z-index: 500;
  border-left: 2px solid var(--gold); box-shadow: -8px 0 40px rgba(0,0,0,.5);
  transition: right .4s var(--ease-soft); overflow-y: auto;
}
#info-panel.open { right: 0; }
.panel-close { position: absolute; top: 14px; right: 14px; z-index: 2; width: 32px; height: 32px;
  border-radius: 50%; background: rgba(26,20,16,.7); border: 1px solid rgba(184,134,11,.4);
  color: var(--gold-light); cursor: pointer; font-size: 15px; }
.panel-close:hover { background: rgba(184,134,11,.2); }
#panel-hero { width: 100%; height: 200px; object-fit: cover; display: none; }
.panel-fb { height: 120px; display: none; align-items: center; justify-content: center; font-size: 40px; }
.panel-head { padding: 18px 20px 14px; border-bottom: 1px solid rgba(184,134,11,.3); }
.panel-head h2 { font-family: var(--font-display); font-size: 22px; color: var(--gold-light); }
#panel-dates { font-style: italic; color: #b8a88a; font-size: 14px; margin-top: 4px; }
.panel-body { padding: 18px 20px; font-size: 15px; line-height: 1.6; }
.panel-body p { margin-bottom: 12px; }
.panel-body .muted { color: #b8a88a; font-size: 13px; }
.panel-body .strong { font-weight: 600; margin-top: 16px; }
.panel-body .ev { font-size: 13px; padding-left: 8px; border-left: 2px solid var(--gold); margin: 4px 0; }
.panel-body .ev strong { color: var(--gold-light); }
.tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
.tag { padding: 3px 10px; border: 1px solid rgba(184,134,11,.3); border-radius: 12px; font-size: 11px;
  color: var(--gold-light); text-transform: uppercase; letter-spacing: .5px; }
.tag.link { cursor: pointer; } .tag.link:hover { background: rgba(184,134,11,.15); }
```

- [ ] **Step 4: Conectar en `main.js`** — añadir click en ríos + init. Tras los listeners de hover:

```js
import { initPanel, openPanel } from './ui/panel.js'; // import arriba
fill.addEventListener('click', () => openPanel(civ));  // dentro del CIVS.forEach
// y una sola vez, cerca del final:
initPanel(goToCiv); // goToCiv se define en Task 11; por ahora: initPanel(id => openPanel(byId[id]));
```
> En esta tarea usa `initPanel(id => openPanel(byId[id]))`. Se reemplaza por `goToCiv` en la Task 11.

- [ ] **Step 5: VERIFICAR EN PRODUCCIÓN**

Recargar. Esperado: click en un río abre panel lateral con descripción, duración, contemporáneas (clicables) y eventos del período; ✕ y Esc lo cierran. Confirmar.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/js/ui/panel.js assets/css/panel.css assets/js/main.js
git commit -m "feat(ui): panel lateral con contemporáneas y eventos del período"
```

---

## Task 10: `render/markers` — marcadores de evento + tooltip/panel

**Files:**
- Create: `assets/js/render/markers.js`
- Modify: `assets/css/chart.css`
- Modify: `assets/js/main.js`

- [ ] **Step 1: Implementar `assets/js/render/markers.js`**

```js
import { yearToX } from '../core/coords.js';
import { EVENTS } from '../data/events.js';
import { REGIONS } from '../data/regions.js';
import { showTooltip, moveTooltip, hideTooltip } from '../ui/tooltip.js';
import { openPanel } from '../ui/panel.js';

export function renderMarkers(overlay) {
  EVENTS.forEach(ev => {
    const region = REGIONS[ev.region] || REGIONS[0];
    const m = document.createElement('div');
    m.className = 'event-marker' + (ev.golden ? ' golden' : '');
    m.style.left = yearToX(ev.year) + 'px';
    m.style.top = (region.yStart - 10) + 'px';
    const data = { name: ev.name, start: ev.year, end: null, desc: ev.desc,
      color: ev.golden ? '#daa520' : '#8b1a1a', isEvent: true };
    m.addEventListener('mouseenter', e => showTooltip(e, data));
    m.addEventListener('mousemove', moveTooltip);
    m.addEventListener('mouseleave', hideTooltip);
    m.addEventListener('click', () => openPanel(data));
    overlay.appendChild(m);
  });
}
```

- [ ] **Step 2: Estilo del marcador** en `chart.css`:

```css
.event-marker { position: absolute; width: 9px; height: 9px; border-radius: 50%;
  background: var(--red-accent); border: 1.5px solid var(--gold); cursor: pointer; z-index: 8;
  transform: translate(-50%,-50%); transition: transform .18s, box-shadow .18s; }
.event-marker:hover { transform: translate(-50%,-50%) scale(2); box-shadow: 0 0 12px rgba(139,26,26,.6); z-index: 20; }
.event-marker.golden { background: var(--gold); border-color: var(--gold-light); width: 11px; height: 11px; }
```

- [ ] **Step 3: Llamar en `main.js`** (tras el `CIVS.forEach`):

```js
import { renderMarkers } from './render/markers.js'; // import arriba
renderMarkers(overlay);
```

- [ ] **Step 4: VERIFICAR EN PRODUCCIÓN**

Recargar. Esperado: puntos de evento (dorados los golden) sobre cada región; hover = tooltip, click = panel. Confirmar.

- [ ] **Step 5: Commit**

```bash
git add assets/js/render/markers.js assets/css/chart.css assets/js/main.js
git commit -m "feat(render): marcadores de evento con tooltip y panel"
```

---

## Task 11: `ui/controls` + navegación a civilización + atajos de teclado

**Files:**
- Create: `assets/js/ui/controls.js`
- Modify: `index.html`
- Modify: `assets/css/ui.css`
- Modify: `assets/js/main.js`

- [ ] **Step 1: Añadir controles a `index.html`** (antes de `<script>`)

```html
<div id="controls">
  <button data-act="zoomout" aria-label="Alejar">−</button>
  <span id="zoom-display">100%</span>
  <button data-act="zoomin" aria-label="Acercar">+</button>
  <span class="divider"></span>
  <button data-act="reset" aria-label="Reiniciar">⌂</button>
  <button data-act="tour" aria-label="Recorrido">🎬</button>
</div>
```

- [ ] **Step 2: Implementar `assets/js/ui/controls.js`**

```js
import { yearToX, bandPeak } from '../core/coords.js';
import { frameRect } from '../core/viewport.js';

// Crea funciones de navegación ligadas al viewport y wirea botones + teclado.
export function initControls(vp, { byId, openPanel, totalHeight, onTour }) {
  const display = document.getElementById('zoom-display');
  const orig = vp.apply;
  vp.apply = () => { orig(); display.textContent = Math.round(vp.state.scale * 100) + '%'; };
  vp.apply();

  function centerOn(x, y, scale) {
    vp.animateTo({ x: innerWidth / 2 - x * scale, y: innerHeight / 2 - y * scale, scale });
  }
  function goToCiv(id) {
    const c = byId[id]; if (!c) return;
    const x = (yearToX(c.start) + yearToX(c.end)) / 2;
    centerOn(x, c.yCenter, Math.max(vp.state.scale, 1.4));
    openPanel(c);
  }
  function reset() { vp.animateTo({ x: -yearToX(-1000) * 0.55 + innerWidth/2, y: -totalHeight*0.2, scale: 0.55 }); }

  document.getElementById('controls').addEventListener('click', e => {
    const act = e.target.dataset.act; if (!act) return;
    const cx = innerWidth/2, cy = innerHeight/2;
    if (act === 'zoomin') vp.zoomAt(1.3, cx, cy);
    if (act === 'zoomout') vp.zoomAt(1/1.3, cx, cy);
    if (act === 'reset') reset();
    if (act === 'tour') onTour && onTour();
  });

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    const cx = innerWidth/2, cy = innerHeight/2;
    switch (e.key.toLowerCase()) {
      case 'r': reset(); break;
      case 't': onTour && onTour(); break;
      case '+': case '=': vp.zoomAt(1.3, cx, cy); break;
      case '-': vp.zoomAt(1/1.3, cx, cy); break;
      case 'arrowleft': vp.panBy(180, 0); break;
      case 'arrowright': vp.panBy(-180, 0); break;
      case 'arrowup': vp.panBy(0, 150); break;
      case 'arrowdown': vp.panBy(0, -150); break;
      case 'f': document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); break;
    }
  });

  return { goToCiv, centerOn, reset };
}
```

- [ ] **Step 3: Estilo de controles** en `ui.css`:

```css
#controls { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 8px; align-items: center; z-index: 100; padding: 8px 14px;
  background: var(--chrome-bg); border: 1px solid rgba(184,134,11,.3); border-radius: 40px;
  backdrop-filter: blur(10px); box-shadow: 0 4px 20px rgba(0,0,0,.4); }
#controls button { width: 36px; height: 36px; border-radius: 50%; cursor: pointer;
  background: rgba(184,134,11,.15); border: 1px solid rgba(184,134,11,.3); color: var(--gold-light);
  font-size: 16px; display: flex; align-items: center; justify-content: center; }
#controls button:hover { background: rgba(184,134,11,.3); }
#controls .divider { width: 1px; height: 24px; background: rgba(184,134,11,.3); }
#zoom-display { color: #b8a88a; font-size: 12px; min-width: 42px; text-align: center; }
```

- [ ] **Step 4: Conectar en `main.js`** — reemplazar `initPanel(...)` provisional por el wiring final:

```js
import { initControls } from './ui/controls.js'; // import arriba
const controls = initControls(vp, { byId, openPanel, totalHeight, onTour: () => window.CRONO?.startTour?.() });
initPanel(controls.goToCiv);
window.CRONO.goToCiv = controls.goToCiv;
```

- [ ] **Step 5: VERIFICAR EN PRODUCCIÓN**

Recargar. Esperado: barra inferior con zoom ±, %, reset y botón tour; teclado R/+/-/flechas/F funcionan; click en una "contemporánea" del panel navega y centra esa civilización. Confirmar.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/js/ui/controls.js assets/css/ui.css assets/js/main.js
git commit -m "feat(ui): controles, navegación a civilización y atajos de teclado"
```

---

## Task 12: `ui/search` + `ui/legend` + header

**Files:**
- Create: `assets/js/ui/search.js`
- Create: `assets/js/ui/legend.js`
- Modify: `index.html`
- Modify: `assets/css/ui.css`
- Modify: `assets/js/main.js`

- [ ] **Step 1: Añadir header, búsqueda y leyenda a `index.html`**

```html
<header id="topbar">
  <div class="brand"><strong>CRONONAUTA</strong><span>6000 años de historia en tus manos</span></div>
  <input id="search-input" type="text" placeholder="Buscar civilización o evento…" aria-label="Buscar">
</header>
<button id="legend-toggle">☰ Leyenda</button>
<div id="legend-panel" hidden></div>
```

- [ ] **Step 2: Implementar `assets/js/ui/search.js`**

```js
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
```

- [ ] **Step 3: Implementar `assets/js/ui/legend.js`**

```js
import { REGIONS } from '../data/regions.js';
import { CIVS } from '../data/civilizations.js';

export function initLegend(goToCiv) {
  const panel = document.getElementById('legend-panel');
  let html = '';
  REGIONS.forEach(r => {
    html += `<div class="legend-region">${r.name}</div>`;
    CIVS.filter(c => c.region === r.id).forEach(c => {
      html += `<div class="legend-item" data-civ="${c.id}">
        <span class="sw" style="background:${c.color}"></span><span>${c.name}</span></div>`;
    });
  });
  panel.innerHTML = html;
  panel.querySelectorAll('.legend-item').forEach(it =>
    it.addEventListener('click', () => goToCiv(it.dataset.civ)));
  const toggle = () => panel.hidden = !panel.hidden;
  document.getElementById('legend-toggle').addEventListener('click', toggle);
  document.addEventListener('keydown', e => { if (e.target.tagName !== 'INPUT' && e.key.toLowerCase() === 'l') toggle(); });
}
```

- [ ] **Step 4: Estilos** en `ui.css`:

```css
#topbar { position: fixed; top: 0; left: 0; right: 0; z-index: 90; display: flex;
  align-items: center; justify-content: space-between; padding: 12px 18px; pointer-events: none;
  background: linear-gradient(180deg, rgba(26,20,16,.95), rgba(26,20,16,0)); }
#topbar > * { pointer-events: auto; }
.brand strong { font-family: var(--font-display); color: var(--gold-light); font-size: 18px; letter-spacing: 1px; }
.brand span { display: block; font-size: 12px; color: #8b7d6b; font-style: italic; }
#search-input { background: rgba(240,226,196,.08); border: 1px solid rgba(184,134,11,.3); color: #f0e2c4;
  padding: 7px 13px; border-radius: 20px; font-family: var(--font-ui); font-size: 13px; width: 220px; outline: none; }
#search-input:focus { border-color: var(--gold-light); width: 280px; transition: width .2s; }
#legend-toggle { position: fixed; top: 64px; right: 18px; z-index: 100; padding: 6px 14px; cursor: pointer;
  background: var(--chrome-bg); border: 1px solid rgba(184,134,11,.3); color: var(--gold-light); border-radius: 20px; font-size: 13px; }
#legend-panel { position: fixed; top: 104px; right: 18px; z-index: 100; width: 230px; max-height: 62vh; overflow-y: auto;
  background: rgba(26,20,16,.96); border: 1px solid rgba(184,134,11,.3); border-radius: 8px; padding: 12px; }
.legend-region { font-family: var(--font-display); font-size: 10px; font-weight: 700; color: var(--gold-light);
  letter-spacing: 1.5px; text-transform: uppercase; margin: 10px 0 4px; border-bottom: 1px solid rgba(184,134,11,.2); padding-bottom: 3px; }
.legend-region:first-child { margin-top: 0; }
.legend-item { display: flex; align-items: center; gap: 8px; padding: 3px 0; cursor: pointer; font-size: 12px; color: #b8a88a; }
.legend-item:hover { color: #f0e2c4; }
.legend-item .sw { width: 16px; height: 10px; border-radius: 2px; flex-shrink: 0; }
```

- [ ] **Step 5: Conectar en `main.js`** (cerca del final):

```js
import { initSearch } from './ui/search.js';
import { initLegend } from './ui/legend.js';
initSearch(controls.goToCiv);
initLegend(controls.goToCiv);
```

- [ ] **Step 6: VERIFICAR EN PRODUCCIÓN**

Recargar. Esperado: header con marca y buscador (atenúa no-coincidentes, Enter navega), botón Leyenda despliega lista por región (click navega), tecla L alterna. Confirmar.

- [ ] **Step 7: Commit**

```bash
git add index.html assets/js/ui/search.js assets/js/ui/legend.js assets/css/ui.css assets/js/main.js
git commit -m "feat(ui): header, búsqueda en vivo y leyenda por región"
```

---

## Task 13: `render/minimap` — minimapa de navegación

**Files:**
- Create: `assets/js/render/minimap.js`
- Modify: `index.html`
- Modify: `assets/css/ui.css`
- Modify: `assets/js/main.js`

- [ ] **Step 1: Añadir nodo a `index.html`**

```html
<div id="minimap"><canvas id="minimap-canvas" width="240" height="84"></canvas><div id="minimap-vp"></div></div>
```

- [ ] **Step 2: Implementar `assets/js/render/minimap.js`**

```js
import { CIVS } from '../data/civilizations.js';
import { yearToX, CHART_WIDTH } from '../core/coords.js';

const MM_W = 240, MM_H = 84;

export function initMinimap(vp, totalHeight) {
  const cv = document.getElementById('minimap-canvas');
  const ctx = cv.getContext('2d');
  const vpEl = document.getElementById('minimap-vp');
  const sx = MM_W / CHART_WIDTH, sy = MM_H / totalHeight;

  // dibujo estático de las bandas
  ctx.fillStyle = '#1a1410'; ctx.fillRect(0, 0, MM_W, MM_H);
  ctx.globalAlpha = .75;
  CIVS.forEach(c => {
    ctx.fillStyle = c.color;
    ctx.fillRect(yearToX(c.start) * sx, (c.yCenter - 9) * sy, Math.max((yearToX(c.end) - yearToX(c.start)) * sx, 1), Math.max(3 * sy, 1));
  });
  ctx.globalAlpha = 1;

  function update() {
    const vx = (-vp.state.x / vp.state.scale) * sx;
    const vy = (-vp.state.y / vp.state.scale) * sy;
    vpEl.style.left = Math.max(0, vx) + 'px';
    vpEl.style.top = Math.max(0, vy) + 'px';
    vpEl.style.width = Math.min((innerWidth / vp.state.scale) * sx, MM_W) + 'px';
    vpEl.style.height = Math.min((innerHeight / vp.state.scale) * sy, MM_H) + 'px';
  }
  // engancharse al apply existente
  const prev = vp.apply;
  vp.apply = () => { prev(); update(); };
  update();

  document.getElementById('minimap').addEventListener('click', e => {
    const r = e.currentTarget.getBoundingClientRect();
    const wx = (e.clientX - r.left) / sx, wy = (e.clientY - r.top) / sy;
    vp.animateTo({ x: innerWidth/2 - wx * vp.state.scale, y: innerHeight/2 - wy * vp.state.scale, scale: vp.state.scale });
  });
}
```

- [ ] **Step 3: Estilos** en `ui.css`:

```css
#minimap { position: fixed; bottom: 78px; right: 18px; width: 240px; height: 84px; z-index: 100;
  background: var(--chrome-bg); border: 1px solid rgba(184,134,11,.3); border-radius: 6px; overflow: hidden; cursor: pointer; }
#minimap-vp { position: absolute; border: 1.5px solid var(--gold-light); background: rgba(184,134,11,.1); pointer-events: none; }
```

- [ ] **Step 4: Conectar en `main.js`** (tras initControls):

```js
import { initMinimap } from './render/minimap.js';
initMinimap(vp, totalHeight);
```

- [ ] **Step 5: VERIFICAR EN PRODUCCIÓN**

Recargar. Esperado: minimapa abajo-derecha con miniatura de bandas y rectángulo de viewport que sigue el pan/zoom; click navega. Confirmar.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/js/render/minimap.js assets/css/ui.css assets/js/main.js
git commit -m "feat(render): minimapa de navegación con viewport sincronizado"
```

---

## Task 14: `data/tour` + `ui/tour` — modo Recorrido (scrollytelling)

**Files:**
- Create: `assets/js/data/tour.js`
- Create: `assets/js/ui/tour.js`
- Create: `assets/css/tour.css` (reemplaza vacío)
- Modify: `index.html`
- Modify: `assets/js/main.js`

- [ ] **Step 1: Crear `assets/js/data/tour.js`** (hitos curados)

```js
// focus: { civId } | { year, region } | { eventName }. zoom: nivel objetivo.
export const TOUR = [
  { id:'inicio', title:'El amanecer de la historia', zoom:0.7, focus:{ year:-3500, region:0 },
    caption:'Hace ~6000 años, en Mesopotamia y Egipto, nacen las primeras grandes civilizaciones.' },
  { id:'egipto', title:'Egipto eterno', zoom:1.5, focus:{ civId:'egypt' },
    caption:'Tres mil años de faraones, pirámides y jeroglíficos junto al Nilo.' },
  { id:'grecia', title:'La Grecia clásica', zoom:1.6, focus:{ civId:'greece' },
    caption:'Democracia, filosofía y teatro: las raíces del pensamiento occidental.' },
  { id:'roma', title:'Roma, de aldea a imperio', zoom:1.4, focus:{ civId:'rome' },
    caption:'Más de mil años que moldearon el derecho, la lengua y la ciudad.' },
  { id:'cristo', title:'Un punto de quiebre', zoom:1.8, focus:{ eventName:'Inicio de la Era Cristiana' },
    caption:'El año que parte en dos la cronología tradicional de Occidente.' },
  { id:'islam', title:'La Edad de Oro del Islam', zoom:1.4, focus:{ civId:'caliphate' },
    caption:'De Córdoba a Bagdad: álgebra, medicina y astronomía florecen.' },
  { id:'mongoles', title:'El mayor imperio terrestre', zoom:1.6, focus:{ civId:'mongol' },
    caption:'Gengis Kan y la Pax Mongolica reconectan Oriente y Occidente.' },
  { id:'america', title:'1492: dos mundos se encuentran', zoom:1.8, focus:{ eventName:'Descubrimiento de América' },
    caption:'El viaje de Colón inicia el intercambio que cambió el planeta.' },
  { id:'revolucion', title:'La era de las revoluciones', zoom:1.6, focus:{ eventName:'Revolución Francesa' },
    caption:'Independencias y revoluciones redibujan el poder y los derechos.' },
  { id:'moderno', title:'El mundo contemporáneo', zoom:0.8, focus:{ year:1900, region:5 },
    caption:'Industria, naciones modernas y el umbral del siglo XX.' },
];
```

- [ ] **Step 2: Implementar `assets/js/ui/tour.js`**

```js
import { TOUR } from '../data/tour.js';
import { EVENTS } from '../data/events.js';
import { REGIONS } from '../data/regions.js';
import { yearToX } from '../core/coords.js';

// Resuelve el punto de mundo (x,y) a enfocar para un hito.
function focusPoint(stop, byId) {
  const f = stop.focus;
  if (f.civId) { const c = byId[f.civId]; return { x: (yearToX(c.start)+yearToX(c.end))/2, y: c.yCenter }; }
  if (f.eventName) { const ev = EVENTS.find(e => e.name === f.eventName); const r = REGIONS[ev.region];
    return { x: yearToX(ev.year), y: r.yStart + 40 }; }
  const r = REGIONS[f.region] || REGIONS[0];
  return { x: yearToX(f.year), y: r.yStart + 60 };
}

export function initTour(vp, byId) {
  let active = false, idx = 0;
  const rail = document.getElementById('tour-rail');
  const card = document.getElementById('tour-card');

  function goto(i) {
    idx = Math.max(0, Math.min(TOUR.length - 1, i));
    const stop = TOUR[idx];
    const p = focusPoint(stop, byId);
    vp.animateTo({ x: innerWidth/2 - p.x * stop.zoom, y: innerHeight/2 - p.y * stop.zoom, scale: stop.zoom });
    card.querySelector('.tour-title').textContent = stop.title;
    card.querySelector('.tour-caption').textContent = stop.caption;
    card.querySelector('.tour-progress').textContent = `${idx + 1} / ${TOUR.length}`;
    card.querySelector('[data-tour="prev"]').disabled = idx === 0;
    card.querySelector('[data-tour="next"]').disabled = idx === TOUR.length - 1;
  }
  function start() { active = true; rail.classList.add('active'); goto(0); }
  function stop() { active = false; rail.classList.remove('active'); }

  card.addEventListener('click', e => {
    const a = e.target.dataset.tour;
    if (a === 'next') goto(idx + 1);
    if (a === 'prev') goto(idx - 1);
    if (a === 'close') stop();
  });
  // rueda del ratón avanza/retrocede hitos cuando el tour está activo
  let lock = false;
  addEventListener('wheel', e => {
    if (!active) return;
    e.stopPropagation();
    if (lock) return; lock = true; setTimeout(() => lock = false, 700);
    goto(idx + (e.deltaY > 0 ? 1 : -1));
  }, { capture: true });
  document.addEventListener('keydown', e => {
    if (!active) return;
    if (e.key === 'ArrowRight') goto(idx + 1);
    if (e.key === 'ArrowLeft') goto(idx - 1);
    if (e.key === 'Escape') stop();
  });

  return { start, stop };
}
```

- [ ] **Step 3: Añadir nodos del tour a `index.html`**

```html
<div id="tour-rail">
  <div id="tour-card">
    <button data-tour="close" class="tour-close" aria-label="Salir del recorrido">✕</button>
    <div class="tour-progress"></div>
    <h3 class="tour-title"></h3>
    <p class="tour-caption"></p>
    <div class="tour-nav">
      <button data-tour="prev">◂ Anterior</button>
      <button data-tour="next">Siguiente ▸</button>
    </div>
  </div>
</div>
```

- [ ] **Step 4: Escribir `assets/css/tour.css`**

```css
#tour-rail { position: fixed; left: 0; right: 0; bottom: 0; z-index: 400; display: flex;
  justify-content: center; padding: 0 16px 84px; pointer-events: none;
  opacity: 0; transform: translateY(20px); transition: opacity .4s, transform .4s; }
#tour-rail.active { opacity: 1; transform: none; }
#tour-card { pointer-events: auto; width: min(560px, 92vw); position: relative;
  background: linear-gradient(135deg, rgba(42,31,20,.97), rgba(26,20,16,.97)); color: #f0e2c4;
  border: 1px solid var(--gold); border-radius: 12px; padding: 18px 22px; box-shadow: 0 12px 40px rgba(0,0,0,.5); }
.tour-close { position: absolute; top: 12px; right: 14px; background: none; border: none; color: var(--gold-light); cursor: pointer; font-size: 15px; }
.tour-progress { font-family: var(--font-label); font-size: 12px; color: #b8a88a; letter-spacing: 1px; }
.tour-title { font-family: var(--font-display); font-size: 22px; color: var(--gold-light); margin: 2px 0 8px; }
.tour-caption { font-size: 15px; line-height: 1.55; }
.tour-nav { display: flex; gap: 10px; margin-top: 14px; }
.tour-nav button { flex: 1; padding: 9px; cursor: pointer; border-radius: 8px;
  background: rgba(184,134,11,.18); border: 1px solid rgba(184,134,11,.35); color: var(--gold-light); font-family: var(--font-ui); font-size: 14px; }
.tour-nav button:hover { background: rgba(184,134,11,.3); }
.tour-nav button:disabled { opacity: .35; cursor: default; }
```

- [ ] **Step 5: Conectar en `main.js`** y exponer `startTour`:

```js
import { initTour } from './ui/tour.js';
const tour = initTour(vp, byId);
window.CRONO.startTour = tour.start;
```

- [ ] **Step 6: VERIFICAR EN PRODUCCIÓN**

Recargar. Esperado: el botón 🎬 (o tecla T) inicia el recorrido; aparece una tarjeta narrativa abajo y la cámara viaja a cada hito; rueda/flechas avanzan, ✕/Esc salen. Confirmar.

- [ ] **Step 7: Commit**

```bash
git add assets/js/data/tour.js assets/js/ui/tour.js assets/css/tour.css index.html assets/js/main.js
git commit -m "feat(tour): modo Recorrido con cámara animada y tarjetas narrativas"
```

---

## Task 15: `ui/splash` — pantalla de inicio

**Files:**
- Create: `assets/js/ui/splash.js`
- Modify: `index.html`
- Modify: `assets/css/ui.css`
- Modify: `assets/js/main.js`

- [ ] **Step 1: Añadir splash a `index.html`** (justo tras `<body>`)

```html
<div id="splash">
  <h1>CRONONAUTA</h1>
  <p class="splash-sub">6000 años de historia en tus manos</p>
  <div class="splash-line"></div>
  <div class="splash-actions">
    <button data-splash="explore">Explorar libremente</button>
    <button data-splash="tour" class="ghost">▶ Hacer el recorrido</button>
  </div>
  <p class="splash-keys">Arrastrar · Scroll para zoom · Click para detalles · <kbd>T</kbd> recorrido</p>
</div>
```

- [ ] **Step 2: Implementar `assets/js/ui/splash.js`**

```js
export function initSplash(onExplore, onTour) {
  const el = document.getElementById('splash');
  el.addEventListener('click', e => {
    const a = e.target.dataset.splash; if (!a) return;
    el.classList.add('hidden');
    if (a === 'explore') onExplore && onExplore();
    if (a === 'tour') onTour && onTour();
  });
}
```

- [ ] **Step 3: Estilos** en `ui.css`:

```css
#splash { position: fixed; inset: 0; z-index: 2000; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
  background: radial-gradient(ellipse at center, #2a1f14, #1a1410 60%, #0d0a07);
  transition: opacity .8s, visibility .8s; }
#splash.hidden { opacity: 0; visibility: hidden; }
#splash h1 { font-family: var(--font-display); font-size: 40px; font-weight: 900; letter-spacing: 2px; color: var(--gold-light); }
.splash-sub { font-style: italic; color: #8b7d6b; margin-top: 6px; }
.splash-line { width: 120px; height: 1px; margin: 26px 0; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
.splash-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
#splash button { padding: 12px 30px; border-radius: 30px; cursor: pointer; font-family: var(--font-display);
  font-size: 15px; letter-spacing: 1px; color: var(--gold-light);
  background: linear-gradient(135deg, rgba(184,134,11,.25), rgba(184,134,11,.12)); border: 1px solid var(--gold); }
#splash button:hover { box-shadow: 0 0 26px rgba(184,134,11,.25); transform: translateY(-1px); }
#splash button.ghost { background: transparent; }
.splash-keys { margin-top: 26px; font-size: 12px; color: #5c4a3a; }
.splash-keys kbd { padding: 2px 6px; border: 1px solid rgba(240,226,196,.15); border-radius: 3px; background: rgba(240,226,196,.06); }
```

- [ ] **Step 4: Conectar en `main.js`**:

```js
import { initSplash } from './ui/splash.js';
initSplash(() => controls.reset(), () => tour.start());
```

- [ ] **Step 5: VERIFICAR EN PRODUCCIÓN**

Recargar. Esperado: splash con dos botones; "Explorar" centra el mapa, "Recorrido" lanza el tour; se desvanece al elegir. Confirmar.

- [ ] **Step 6: Commit**

```bash
git add assets/js/ui/splash.js index.html assets/css/ui.css assets/js/main.js
git commit -m "feat(ui): splash de inicio con explorar/recorrido"
```

---

## Task 16: Imágenes locales + lazy-load

**Files:**
- Create: `scripts/download-images.sh`
- Modify: `assets/js/main.js` (lazy-load de ríos→panel ya usan rutas locales)

- [ ] **Step 1: Crear `scripts/download-images.sh`** (descarga al VPS; mapea id→URL Wikimedia del prototipo y nombres de evento→slug)

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/img/civs assets/img/events
UA="Mozilla/5.0 (X11; Linux x86_64) Crononauta/1.0"

declare -A CIV=(
  [sumer]="e/e4/Standard_of_Ur_-_War.jpg" [egypt]="e/e3/Kheops-Pyramid.jpg"
  [akkad]="4/50/Victory_stele_of_Naram_Sin_9068.jpg" [babylon]="5/52/Hanging_Gardens_of_Babylon.jpg"
  [assyria]="a/a0/Human_headed_winged_bull_facing.jpg" [hittites]="7/79/Hattusa_liongate.jpg"
  [phoenicia]="4/4e/Phoenician_ship.jpg" [israel]="1/10/Western_Wall%2C_Jerusalem%2C_2007.jpg"
  [persia]="5/5b/Persepolis_24.11.2009_11-12-14.jpg" [parthia]="e/ec/Parthian_Statue_from_Hatra.jpg"
  [sassanid]="f/f5/Taq-e_Bostan_-_High-relief_of_the_investiture_of_Ardeshir_II.jpg"
  [caliphate]="d/d1/Mesquita_de_C%C3%B3rdova.jpg" [ottoman]="4/4f/Istambul_-_Mesquita_de_Suleiman_-_Exterior.JPG"
  [minoan]="1/19/Bull-leaping_Fresco_from_Knossos.jpg" [mycenae]="5/55/MaskOfAgamemnon.jpg"
  [greece]="d/da/The_Parthenon_in_Athens.jpg" [rome]="d/d8/Colosseum_in_Rome-April_2007-1-_copie_2B.jpg"
  [byzantine]="2/22/Hagia_Sophia_Mars_2013.jpg"
  [frankish]="6/66/Eug%C3%A8ne_Delacroix_-_La_libert%C3%A9_guidant_le_peuple.jpg"
  [hre]="8/8f/D%C3%BCrer_-_Bildnis_Kaiser_Karl_des_Gro%C3%9Fen.jpg"
  [england]="b/be/Palace_of_Westminster%2C_London_-_Feb_2007.jpg" [spain]="4/44/Alhambra-Granada.jpg"
  [russia]="d/d4/Moscow_July_2011-7a.jpg" [portugal]="7/72/Torre_de_Bel%C3%A9m_-_Lisboa.jpg"
  [viking]="c/c1/Gokstadskipet1.jpg" [indus]="f/f3/Mohenjodaro_-_view_of_the_stupa_mound.JPG"
  [china_ancient]="9/9d/The_Great_wall_-_by_Steve_Jurvetson.jpg" [india]="b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg"
  [japan]="2/20/Matsumoto_Castle01s5s4110.jpg" [mongol]="3/35/YuanEmperorAlbumGenghisPortrait.jpg"
  [korea]="3/3b/Gyeongbokgung-GeunjeongJeon.jpg" [carthage]="b/b5/Tunisie_Carthage_Ruines_08.JPG"
  [ethiopia]="7/7a/Stela_aksum.jpg" [ghana]="5/55/Djinguereber.jpg"
  [olmec]="9/9d/Olmec_Head_from_San_Lorenzo%2C_Veracruz.jpg" [maya]="1/10/Chichen_Itza_3.jpg"
  [aztec]="b/b4/Sunstone.jpg" [inca]="1/13/Before_Machu_Picchu.jpg"
  [netherlands]="c/c6/Nightwatch_by_Rembrandt.jpg"
  [prussia]="b/b1/Anton_von_Werner_-_Kaiserproklamation_am_18._Januar_1871_%283._Fassung_1885%29.jpg"
  [usa]="1/11/Constitution_We_the_People.jpg" [italy_unified]="2/2c/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg"
)
for id in "${!CIV[@]}"; do
  path="${CIV[$id]}"; file="${path##*/}"
  url="https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/400px-${file}"
  echo "civs/$id"; curl -sL -A "$UA" -o "assets/img/civs/${id}.jpg" "$url" || echo "  ⚠ falló $id"
done

# Optimizar si hay ImageMagick
if command -v mogrify >/dev/null; then
  mogrify -resize 400x -quality 80 assets/img/civs/*.jpg || true
fi
echo "Listo. Revisa assets/img/civs/"
```

- [ ] **Step 2: Ejecutar el script en el VPS**

Run: `bash scripts/download-images.sh`
Expected: descarga ~42 imágenes a `assets/img/civs/`. Avisos de fallo aceptables (esas usarán fallback).

- [ ] **Step 3: Añadir lazy-load** en `main.js` — convertir `tt-img`/`panel-hero` ya cargan on-demand (al hacer hover/click), así que ya es perezoso por naturaleza. No se requiere IntersectionObserver para tooltip/panel. (Las miniaturas inline en el mapa se difieren a post-v1.)

- [ ] **Step 4: Actualizar `.gitignore`** para no versionar binarios pesados de imágenes (se regeneran con el script):

```
# Imágenes descargadas (se regeneran con scripts/download-images.sh)
assets/img/civs/*.jpg
assets/img/events/*.jpg
```

- [ ] **Step 5: VERIFICAR EN PRODUCCIÓN**

Recargar. Esperado: tooltips y panel ahora muestran fotos reales (Coliseo, Partenón, etc.); las que falten siguen con fallback. Confirmar.

- [ ] **Step 6: Commit**

```bash
git add scripts/download-images.sh .gitignore
git commit -m "feat(img): script de descarga de imágenes a local + carga perezosa"
```

---

## Task 17: Responsive + accesibilidad (bottom sheet móvil, touch, reduced-motion)

**Files:**
- Create: `assets/css/responsive.css` (reemplaza vacío)
- Modify: `assets/js/main.js` (gestos táctiles)

- [ ] **Step 1: Añadir gestos táctiles en `main.js`** (tras los listeners de ratón)

```js
let touch = null;
app.addEventListener('touchstart', e => {
  if (e.touches.length === 1) {
    touch = { mode:'pan', sx:e.touches[0].clientX, sy:e.touches[0].clientY, px:vp.state.x, py:vp.state.y };
  } else if (e.touches.length === 2) {
    const [a,b] = e.touches; const d = Math.hypot(b.clientX-a.clientX, b.clientY-a.clientY);
    touch = { mode:'pinch', d, scale:vp.state.scale, mx:(a.clientX+b.clientX)/2, my:(a.clientY+b.clientY)/2 };
  }
}, { passive:true });
app.addEventListener('touchmove', e => {
  if (!touch) return;
  if (touch.mode==='pan' && e.touches.length===1) {
    vp.set({ x:touch.px+(e.touches[0].clientX-touch.sx), y:touch.py+(e.touches[0].clientY-touch.sy), scale:vp.state.scale });
  } else if (touch.mode==='pinch' && e.touches.length===2) {
    const [a,b] = e.touches; const d = Math.hypot(b.clientX-a.clientX, b.clientY-a.clientY);
    const r = app.getBoundingClientRect();
    vp.set({ x:vp.state.x, y:vp.state.y, scale: touch.scale * (d/touch.d) });
    void r;
  }
  e.preventDefault();
}, { passive:false });
app.addEventListener('touchend', () => { touch = null; }, { passive:true });
```

- [ ] **Step 2: Escribir `assets/css/responsive.css`**

```css
@media (max-width: 760px) {
  .brand span { display: none; }
  #search-input { width: 130px; } #search-input:focus { width: 170px; }
  #minimap { display: none; }
  #legend-panel { width: 200px; max-height: 50vh; }

  /* panel lateral → hoja inferior */
  #info-panel { top: auto; bottom: -100%; right: 0; left: 0; width: 100%; max-width: 100%;
    height: 78vh; border-left: none; border-top: 2px solid var(--gold);
    border-radius: 16px 16px 0 0; transition: bottom .4s var(--ease-soft); }
  #info-panel.open { right: 0; bottom: 0; }
  #panel-hero { height: 150px; }

  #controls { bottom: 14px; gap: 6px; padding: 6px 10px; }
  #controls button { width: 32px; height: 32px; }
  #tour-rail { padding-bottom: 70px; }
  #tour-card { padding: 14px 16px; }
  .tour-title { font-size: 18px; }
}

@media (prefers-reduced-motion: reduce) {
  #info-panel, #tour-rail, #splash { transition: none; }
}
```

- [ ] **Step 3: VERIFICAR EN PRODUCCIÓN (móvil)**

Abrir en teléfono o DevTools responsive. Esperado: arrastrar y pinch funcionan; el panel sube como hoja inferior; minimapa oculto; controles compactos; el tour se lee bien. Confirmar.

- [ ] **Step 4: Commit**

```bash
git add assets/css/responsive.css assets/js/main.js
git commit -m "feat(responsive): gestos táctiles, bottom sheet móvil y reduced-motion"
```

---

## Task 18: Meta / SEO / JSON-LD + pulido final

**Files:**
- Modify: `index.html` (head)
- Modify: `assets/js/main.js` (revisión final)

- [ ] **Step 1: Completar el `<head>` de `index.html`** (insertar tras el `<title>`)

```html
<meta name="description" content="CRONONAUTA: explora 6000 años de historia humana en un mapa interactivo donde las civilizaciones fluyen como ríos del tiempo. Inspirado en la Adams' Synchronological Chart (1871).">
<link rel="canonical" href="https://crononauta.neracosu.com/">
<meta property="og:type" content="website">
<meta property="og:title" content="CRONONAUTA — 6000 años de historia en tus manos">
<meta property="og:description" content="Atlas interactivo de la historia mundial: civilizaciones como ríos del tiempo. Explora, haz zoom y recorre los hitos de la humanidad.">
<meta property="og:url" content="https://crononauta.neracosu.com/">
<meta property="og:image" content="https://crononauta.neracosu.com/assets/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="CRONONAUTA — 6000 años de historia">
<meta name="twitter:description" content="Atlas interactivo de la historia mundial inspirado en la Adams' Synchronological Chart (1871).">
<meta name="twitter:image" content="https://crononauta.neracosu.com/assets/img/og.jpg">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "CRONONAUTA",
  "url": "https://crononauta.neracosu.com/",
  "description": "Atlas interactivo de 6000 años de historia humana, inspirado en la Adams' Synchronological Chart (1871).",
  "author": { "@type": "Person", "name": "Neri Colón", "url": "https://neracosu.com" },
  "inLanguage": "es"
}
</script>
```

- [ ] **Step 2: Crear imagen OG** (captura del mapa o portada) en `assets/img/og.jpg` (1200×630). Si no hay aún, usar la imagen de referencia 1881 redimensionada:

```bash
command -v convert >/dev/null && convert resources/Adams_Synchronological_Chart,_1881.jpg -resize 1200x630^ -gravity center -extent 1200x630 assets/img/og.jpg || echo "crear og.jpg manualmente"
```

- [ ] **Step 3: Revisión final de consola** — abrir en producción, confirmar 0 errores JS, todas las capas presentes, tour fluido, búsqueda/leyenda/minimapa/panel OK.

- [ ] **Step 4: Ejecutar toda la suite de tests**

Run: `node --test tests/`
Expected: PASS (coords + viewport + rivers).

- [ ] **Step 5: VERIFICAR EN PRODUCCIÓN**

Recargar. Esperado: meta/OG presentes (probar con validador OG si se desea), todo el flujo funcional. Confirmar con el dueño.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/img/og.jpg
git commit -m "feat(seo): meta tags, OpenGraph, Twitter Card y JSON-LD + pulido final"
```

- [ ] **Step 7: Push final**

```bash
git push origin main
```

---

## Notas de cierre

- El prototipo viejo no se borra; este plan crea archivos nuevos. Si existía un `index.html` previo del prototipo en el directorio, se sobrescribe en la Task 1 (confirmar con el dueño antes; el prototipo está respaldado en el historial/mensaje original).
- Diferido a post-v1 (no en este plan): anchos proporcionales por poder, toggle de idioma, deep-zoom de sub-períodos, URLs compartibles, miniaturas inline en el mapa, integración Wikipedia/IA.
- Colaboración: `CONTRIBUTING.md` ya documenta cómo aportar civilizaciones/eventos editando `assets/js/data/`.
