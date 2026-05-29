# CRONONAUTA 2.0 — Documento de Diseño

**Fecha:** 2026-05-29
**URL:** crononauta.neracosu.com
**Autor:** Neri (VIP SOFT) + Claude
**Estado:** Aprobado — listo para plan de implementación

---

## 1. Resumen

Rediseño de CRONONAUTA: llevar la *Adams' Synchronological Chart or Map of History* (1871)
a una web interactiva **moderna e innovadora sin perder su esencia**. El prototipo previo
(barras rectangulares planas, navegación poco intuitiva) se reemplaza por un **atlas de museo
interactivo** donde las civilizaciones fluyen como **ríos del tiempo**.

La esencia que conservamos del original:
- **Sincronología**: muchas civilizaciones visibles en paralelo sobre un eje de tiempo compartido.
- **Río del tiempo**: las corrientes nacen, crecen, se afinan y se dividen/fusionan.
- **Alma de pergamino**: cálido, sepia, dorado, ilustraciones históricas.

Lo que modernizamos: tipografía y jerarquía limpias, movimiento suave, un modo guiado
(scrollytelling) que resuelve la falta de intuición del prototipo, y render vectorial nítido.

## 2. Decisiones de diseño (tomadas en brainstorming)

| Decisión | Elección |
|---|---|
| Paradigma de navegación | **Híbrido**: mapa-río horizontal (exploración libre) + modo Recorrido vertical (scrollytelling que viaja la cámara por hitos) |
| Estética | **Pergamino moderno (fusión)**: alma cálida de Adams + tipografía/espaciado modernos. Atlas de museo 2026 |
| Render de civilizaciones | **Bandas orgánicas afiladas**: nacen finas → crecen → se afinan; conectores bezier para divisiones/fusiones |
| Rango temporal | 4004 a.C. → **2026** (extendido desde 1900 para sentirse actual) |
| Semilla de datos | Dataset actual (42 civs / 42 eventos) reestructurado + relaciones río; sin expandir civs en v1 |
| Stack | **HTML + CSS + JS vanilla con ES modules nativos** (sin build tool), fiel al stack del sitio |
| Despliegue | Incremental en este directorio del VPS; el dueño valida en producción recargando |

## 3. Concepto de interacción

**Dos modos sobre un mismo lienzo, un solo estado de cámara `{x, y, scale}`:**

1. **Exploración libre** — arrastrar para mover (pan), scroll/pinch para zoom (hacia el cursor),
   click en un río o evento abre el panel lateral, hover muestra tooltip. Minimapa, leyenda,
   búsqueda y controles disponibles.
2. **Modo Recorrido (tour)** — una secuencia curada de hitos. Al avanzar (scroll o botón
   siguiente), la cámara hace *tween* (pan+zoom) para enmarcar el hito, resalta el río/evento
   relevante y muestra una tarjeta narrativa. Se puede salir a exploración libre en cualquier
   momento. En **móvil es el modo principal**: el scroll vertical conduce la cámara.

## 4. Estética — pergamino moderno

**Paleta (tokens CSS):**
```
--parchment: #f0e2c4   --parchment-dark: #d4c4a0
--ink: #2a1f14         --ink-light: #5c4a3a    --ink-faint: #8b7d6b
--gold: #b8860b        --gold-light: #daa520
--red-accent: #8b1a1a  --border-ornate: #6b5b4b
```
- **Tipografía:** Playfair Display (títulos/display), Inter (UI y cuerpo — moderniza), EB Garamond
  (etiquetas en el mapa). Los colores de río se heredan del dataset (saturados, históricos).
- **Tono:** mucho aire, jerarquía clara, easing suave (sin rebotes). Limpio, cálido, legible.
  No skeuomorfismo pesado.

## 5. Arquitectura de render — capas

- **SVG** (mapa): bandas-río como `path` afilados (bezier) que escalan nítidos a cualquier zoom;
  conectores bezier para divisiones/fusiones; líneas de siglo; bandas de era.
- **HTML overlay** (mismo transform que el SVG): etiquetas de civilización, marcadores de evento,
  miniaturas de ilustración — texto nítido y fácil de estilar.
- **Canvas**: solo el minimapa.
- **Chrome fijo** (fuera del transform): header/buscador, leyenda, controles, panel lateral,
  riel del tour, splash.

Pan/zoom y cámara del tour se gestionan en un único módulo de viewport; las transiciones del tour
son *tweens* con `requestAnimationFrame`.

## 6. El "río" — algoritmo

Cada civilización se dibuja como un `path` SVG con perfil de río:

```
nace fino  →  crece a altura plena (rise)  →  se mantiene  →  se afina al morir
   ▄▄███████████████████████████▄▄
```

- Generador de path: dada `start`, `end`, `tier` (altura plena), `rise` (años de crecimiento),
  produce un contorno simétrico con bordes bezier suaves.
- Gradiente de luz superior (blanco translúcido arriba, sombra abajo) para volumen.
- **Divisiones/fusiones:** campo `parent` (o `successor`) en el dato; se dibuja un conector
  bezier tipo cinta desde el final del río padre al inicio del hijo (ej: Roma → Bizancio;
  Castilla+Aragón → España). Solo para las principales en v1.

## 7. Modelo de datos (extensiones al schema actual)

**Civilización:**
```js
{
  id, name, start, end, color, region, desc,   // existentes
  tier: 1|2|3,        // importancia → altura del río y tamaño de etiqueta
  rise: 100,          // años que tarda en alcanzar altura plena (default por tier)
  parent: "rome",     // opcional: id del río del que deriva (dibuja conector)
  img, icon           // ruta local + emoji fallback
}
```

**Evento:**
```js
{
  year, name, desc, region, golden,   // existentes (y_hint → region)
  img, icon
}
```

**Hito de tour:** (módulo `data/tour.js`)
```js
{
  id, title, caption,           // narrativa de la tarjeta
  focus: { year, region } | { civId } | { eventName },  // qué enmarcar
  zoom: 2.5                     // nivel de zoom objetivo
}
```

**Era y Región:** se conservan (5 eras, 6 regiones); las eras pueden extender su última franja a 2026.

## 8. Estructura de archivos (ES modules, sin build)

```
crononauta.neracosu.com/
├── index.html                 # shell HTML + <head> con meta/OG/Twitter/JSON-LD propios
├── assets/
│   ├── css/
│   │   ├── tokens.css         # variables, fuentes
│   │   ├── base.css           # reset, body, scrollbar
│   │   ├── chart.css          # capas SVG/overlay, eras, líneas de siglo, etiquetas
│   │   ├── ui.css             # header, búsqueda, controles, leyenda, minimapa, tooltip
│   │   ├── panel.css          # panel lateral
│   │   ├── tour.css           # riel/tarjetas del modo recorrido
│   │   └── responsive.css     # breakpoints móvil/tablet
│   ├── js/
│   │   ├── data/
│   │   │   ├── civilizations.js   # 42 civs + tier/rise/parent
│   │   │   ├── events.js          # 42 eventos
│   │   │   ├── eras.js            # 5 eras
│   │   │   ├── regions.js         # 6 regiones
│   │   │   ├── tour.js            # hitos curados del recorrido
│   │   │   └── images.js          # mapeo a /assets/img/... + iconos fallback
│   │   ├── core/
│   │   │   ├── coords.js          # yearToX, formatYear, layout de regiones/bandas
│   │   │   └── viewport.js        # estado {x,y,scale}, pan/zoom, tween de cámara
│   │   ├── render/
│   │   │   ├── rivers.js          # generador de path-río + conectores split/merge
│   │   │   ├── timeline.js        # líneas de siglo, etiquetas, bandas de era
│   │   │   ├── markers.js         # marcadores de evento + miniaturas inline
│   │   │   └── minimap.js         # canvas del minimapa
│   │   ├── ui/
│   │   │   ├── tooltip.js
│   │   │   ├── panel.js
│   │   │   ├── search.js
│   │   │   ├── legend.js
│   │   │   ├── controls.js
│   │   │   ├── tour.js            # lógica del modo recorrido (scroll → cámara)
│   │   │   └── splash.js
│   │   └── main.js                # arma todo, listeners globales, init
│   └── img/
│       ├── civs/                  # imágenes descargadas (egypt.jpg, rome.jpg, ...)
│       └── events/
└── docs/superpowers/specs/        # este documento
```

Cada módulo tiene una responsabilidad única, comunica por interfaces claras (exports), y se
puede entender/probar de forma aislada.

## 9. Imágenes

- Descargar thumbs de Wikimedia Commons al VPS con `curl` (User-Agent navegador) a
  `assets/img/civs/` y `assets/img/events/`. En el VPS no hay bloqueo de iframe/CSP.
- Optimizar (resize ~400px, JPEG q80) con ImageMagick si está disponible.
- En cliente: `images.js` apunta a rutas locales; lazy-load con `IntersectionObserver`;
  fallback de emoji+color si una imagen falta (se conserva del prototipo).

## 10. Coordenadas y layout

- `YEAR_START = -4004`, `YEAR_END = 2026`, `PX_PER_YEAR = 3` (ajustable).
- `yearToX(year) = LEFT_PAD + (year - YEAR_START) * PX_PER_YEAR`.
- Regiones apiladas verticalmente; cada civ recibe su carril (`y`) dentro de su región.
- Eras como franjas superiores; líneas de siglo cada 100 años, etiquetas cada 500.

## 11. Atajos y accesibilidad

- Teclado: arrastrar/scroll/click (libre); `R` reiniciar, `T` toggle tour, `L` leyenda,
  `F` pantalla completa, `Esc` cerrar panel, `+/-` zoom, flechas pan, `←/→` también navegan
  hitos del tour cuando está activo.
- Accesibilidad: roles ARIA en controles, foco visible, contraste suficiente, `prefers-reduced-motion`
  desactiva los tweens de cámara (salto directo).

## 12. SEO / meta (página propia)

`<head>` con title, description, OpenGraph, Twitter Card, canonical y un bloque JSON-LD
(`WebSite`/`CreativeWork`). Es una sub-app independiente de la home; no toca el SEO de neracosu.com.

## 13. Responsive

- Desktop: mapa completo + chrome lateral.
- Tablet: igual con controles compactos.
- Móvil: **tour como modo principal** (scroll vertical → cámara), chrome reducido a lo esencial,
  panel lateral pasa a hoja inferior (bottom sheet). Gestos táctiles: arrastrar y pinch.

## 14. Alcance

**v1 (este proyecto):**
- Mapa-río horizontal con bandas orgánicas afiladas + conectores split/merge para principales.
- Modo Recorrido (tour) con hitos curados y cámara animada.
- Tooltip, panel lateral, búsqueda, leyenda, minimapa, controles, splash.
- Imágenes locales con lazy-load y fallback.
- Estética pergamino moderno; responsive; accesibilidad base; meta/SEO propio.

**Diferido (post-v1):**
- Anchos proporcionales por poder (HistoMap).
- Toggle de idioma (ES/EN/PT).
- Deep-zoom de sub-períodos (dinastías egipcias, emperadores romanos).
- URLs compartibles (`?year=&zoom=&civ=`).
- Integración Wikipedia / explicaciones IA.

## 15. Estrategia de implementación

Incremental y verificable en producción. Orden sugerido (se detalla en el plan):
1. Andamiaje: estructura de archivos, tokens, shell HTML, datos reestructurados.
2. Núcleo: coords + viewport (pan/zoom funcional con bandas simples).
3. Render río: generador de paths afilados + conectores.
4. Timeline, marcadores, minimapa.
5. UI: tooltip, panel, búsqueda, leyenda, controles, splash.
6. Modo Recorrido (tour) + cámara animada.
7. Imágenes locales + lazy-load.
8. Responsive + accesibilidad + meta/SEO.
9. Pulido y verificación final.
