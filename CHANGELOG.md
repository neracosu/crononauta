# Changelog

Todos los cambios notables de CRONONAUTA. Formato basado en
[Keep a Changelog](https://keepachangelog.com/es-ES/) y versionado [SemVer](https://semver.org/lang/es/).
Lo más reciente arriba.

## [Sin publicar]

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
