# Changelog

Todos los cambios notables de CRONONAUTA. Formato basado en
[Keep a Changelog](https://keepachangelog.com/es-ES/) y versionado [SemVer](https://semver.org/lang/es/).
Lo más reciente arriba.

## [Sin publicar]

## [1.2.0] - 2026-05-29

### Plataforma multicapa — backend + capas (Fases 0 y 1 del rediseño v2)
- **Base de datos propia (MariaDB) + API REST en PHP** en el VPS. Esquema
  `regiones/capas/civilizaciones/eventos` (con `fuente_url`/`wikidata` para citar fuentes).
- El mapa-río ahora **lee de la API** (`fetch`) en vez de archivos JS; los estáticos quedan
  como respaldo offline. Motor de render/cámara/tour sin cambios.
- **Sistema de capas temáticas**: 10 capas (civilizaciones, religión, política, guerras,
  ciencia, tecnología, exploración, cultura, salud, naturaleza). Panel con **toggles**,
  **"ver solo esta capa"** (foco), color por tema y **estado en la URL** (`?capas=`).

## [1.1.0] - 2026-05-29

### Añadido
- **Capa "Relato Bíblico"** (cronología de Ussher, como en el original de Adams):
  banda superior con las líneas de vida de 18 patriarcas (Adán→Jacob) y 6 eventos
  bíblicos dorados (Creación, Diluvio, Babel, Abraham, Éxodo, Templo de Salomón).
- Modo Recorrido ampliado a 15 hitos, incluyendo el arco bíblico.
### Cambiado
- Acceso a regiones por `id` (no por índice), permitiendo añadir capas en cualquier orden.

## [1.0.0] - 2026-05-29

### Lanzamiento oficial 🎉
CRONONAUTA sale en vivo con todo lo descrito en v0.9.0 (atlas-río interactivo,
modo Recorrido, panel, búsqueda, leyenda, minimapa, imágenes, responsive, SEO).
Cache de producción ajustado: imágenes con cache largo; HTML/CSS/JS revalidados.

## [0.9.0] - 2026-05-29

### Añadido
- **Rediseño 2.0 funcional**: atlas interactivo donde las civilizaciones fluyen como
  ríos del tiempo (SVG afilado) sobre un eje de 4004 a.C. a 2026.
- **Exploración libre**: pan (arrastrar), zoom-al-cursor (rueda) y gestos táctiles
  (pan/pinch). Motor de cámara propio con interpolación de zoom van Wijk.
- **Modo Recorrido**: 10 hitos narrados con cámara animada (rueda/flechas/botones).
- Tooltip con imagen, panel lateral (contemporáneas + eventos del período), búsqueda
  en vivo, leyenda por región, minimapa, controles y atajos de teclado.
- 42 civilizaciones, 42 eventos, conectores de división/fusión (p. ej. Roma→Bizancio).
- Imágenes de Wikimedia Commons (descarga reproducible vía `scripts/download-images.sh`).
- Splash de inicio, responsive con hoja inferior en móvil, SEO/OpenGraph/JSON-LD.

## [0.1.0] - 2026-05-29

### Añadido
- Andamiaje del repositorio público y colaborativo (README, CONTRIBUTING, LICENSE GPL-3.0).
- Documento de diseño y plan de implementación de CRONONAUTA 2.0.
- Metodología de proyecto: `CLAUDE.md` raíz, doc path-scoped y este changelog.
