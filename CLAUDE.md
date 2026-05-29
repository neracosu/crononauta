# CRONONAUTA — Contexto del proyecto

App web interactiva: recreación de la *Adams' Synchronological Chart* (1871) donde las
civilizaciones fluyen como ríos del tiempo. Pública y colaborativa.
Producción: https://crononauta.neracosu.com · Repo: https://github.com/neracosu/crononauta

## Stack

- **HTML + CSS + JavaScript vanilla, ES modules nativos. Cero dependencias, sin build tool.**
- Render: **SVG** (ríos, líneas, eras) + overlay HTML (etiquetas, marcadores) + `<canvas>` (minimapa).
- Motor propio de pan/zoom/cámara (`core/viewport` + `core/smoothZoom` con interpolación van Wijk).
- Tests de lógica pura con el runner nativo de Node: `node --test tests/`.
- Despliegue: copiar archivos al VPS (Apache). No hay paso de build.

## Estructura

```
index.html
assets/
  css/   tokens · base · chart · ui · panel · tour · responsive
  js/
    data/    civilizations · events · eras · regions · tour · images · version  (+ CLAUDE.md)
    core/    coords · viewport · smoothZoom · easing
    render/  rivers · timeline · markers · minimap
    ui/      tooltip · panel · search · legend · controls · splash · imageLoader
    main.js
  img/   civs/ · events/   (descargadas con scripts/download-images.sh; en .gitignore)
docs/superpowers/   specs/ y plans/
tests/   *.test.js  (node --test)
```

## Documentación path-scoped

- `assets/js/data/CLAUDE.md` — reglas para quien aporta datos históricos (schema, fuentes).
  Se carga solo al trabajar en esa carpeta.

## Cómo contribuir

Ver `CONTRIBUTING.md`. Los datos viven en `assets/js/data/` y los puede editar cualquiera.

## Changelog y versión (SemVer)

- Fuente legible: `CHANGELOG.md` (estilo *Keep a Changelog*, lo más reciente arriba).
- Versión para la UI: `assets/js/data/version.js` (`VERSION`); se muestra como badge en el footer.
- **Regla:** en cada deploy con cambio visible, añadir entrada a `CHANGELOG.md` y, si corresponde,
  subir `VERSION`. Tipos: feature→minor, improvement/fix/security→patch, rediseño grande→major.
  Arranque en `v0.1.0`; `v1.0.0` al lanzar.

## Reglas operativas

- Idioma del proyecto y del dueño: **español (Venezuela)**.
- Mantener este `CLAUDE.md` ≤300 líneas. Si crece, mover histórico fuera y crear más path-scoped.
- No introducir dependencias ni build tools sin acordarlo (decisión de stack tomada: vanilla puro).
