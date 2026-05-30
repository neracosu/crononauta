# CRONONAUTA — Contexto del proyecto

App web interactiva: recreación de la *Adams' Synchronological Chart* (1871) donde las
civilizaciones fluyen como ríos del tiempo. Pública y colaborativa.
Producción: https://crononauta.neracosu.com · Repo: https://github.com/neracosu/crononauta

## Stack

- **Frontend**: HTML + CSS + JavaScript vanilla, ES modules nativos. **Cero dependencias,
  sin build tool.** Render SVG (ríos/líneas/eras) + overlay HTML + `<canvas>` (minimapa).
  Motor propio de pan/zoom/cámara (`core/viewport` + `core/smoothZoom`, interpolación van Wijk).
- **Backend (v2)**: API REST en **PHP 8.2** (PDO) sobre **MariaDB** (`neracosu_crononauta`).
  El frontend pide datos a `api/*.php` (`fetch`); los módulos estáticos quedan como respaldo offline.
- **Ingesta**: `node scripts/import-wikidata.mjs` (SPARQL → DB, con cita de fuente).
- Tests de lógica pura: `node --test tests/`.
- Despliegue: `git push` a `main`; producción servida desde este directorio (Apache/cPanel). Sin build.
- **Credenciales DB fuera del repo**: `~/.config/crononauta/db.php` (no versionar). Ver `docs/ARQUITECTURA.md`.

## Estructura

```
index.html
api/        _db.php · capas · regiones · civilizaciones · eventos   (API PHP)
db/         schema.sql · seed.mjs                                   (esquema + semilla)
scripts/    import-wikidata.mjs · download-images.sh
assets/
  css/   tokens · base · chart · ui · panel · tour · responsive
  js/
    data/    layers · civilizations · events · eras · regions · tour · images · version · load  (+ CLAUDE.md)
    core/    coords · viewport · smoothZoom · easing
    render/  rivers · timeline · markers · minimap
    ui/      layers · tooltip · panel · search · legend · controls · splash · tour · imageLoader
    main.js
  img/   civs/   (descargadas con scripts/download-images.sh; en .gitignore)
docs/       ARQUITECTURA.md · superpowers/{specs,plans}
tests/      *.test.js  (node --test)
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
- **Frontend** sin dependencias ni build tools (vanilla puro). **Backend** PHP sobre MariaDB
  (sin framework). No introducir build tools sin acordarlo.
- Los datos viven en la **DB** (servidos por la API). Los módulos en `assets/js/data/` son la
  **semilla** curada (cargada con `db/seed.mjs`) y el respaldo offline. Para añadir contenido a
  escala: `scripts/import-wikidata.mjs`. Ver `docs/ARQUITECTURA.md`.
