# CRONONAUTA — Arquitectura (v2 multicapa)

Atlas interactivo de la historia mundial: las civilizaciones fluyen como **ríos del tiempo**
sobre un eje de 4004 a.C. a 2026, con **capas temáticas** conmutables. Recreación moderna de
la *Adams' Synchronological Chart* (1871).

## Visión de capas

Una sola plataforma = muchas "líneas de tiempo especializadas". El usuario elige *su* historia
con un **selector** (perfiles: Todo, Fe/Bíblica, Medicina, Guerras, Ciencia…; o una capa suelta).
El **Recorrido** se adapta a la capa elegida. Capas actuales: civilizaciones, religión, política,
guerras, ciencia, tecnología, exploración, cultura, salud, naturaleza (abiertas a más).

## Pila

```
Navegador (estático, vanilla JS + SVG)
   │  fetch JSON
   ▼
API REST PHP 8.2  ──PDO──►  MariaDB 10.11  (neracosu_crononauta)
   ▲
   │  node scripts/import-wikidata.mjs  (SPARQL, build-time)
Wikidata (CC0) + Wikipedia (CC BY-SA)
```

- **Frontend**: HTML + CSS + JS ES modules, **sin build, sin dependencias**. Render SVG
  (ríos/líneas/eras) + overlay HTML (etiquetas/marcadores) + canvas (minimapa). Motor propio
  de pan/zoom/cámara (interpolación van Wijk). Pide datos a la API; si falla, usa los módulos
  estáticos como respaldo offline.
- **Backend**: API REST en PHP (PDO) sobre **MariaDB**. Sin framework.
- **Ingesta**: script Node que consulta Wikidata por capa e inserta en la DB con cita de fuente.

## Base de datos (MariaDB)

Esquema en `db/schema.sql`. Tablas: `regiones`, `capas`, `civilizaciones`, `eventos`.
Cada fila de contenido guarda `fuente_url` y `wikidata` (QID) para **citar**. Clave única
`eventos.wikidata` para deduplicar la ingesta.

- Credenciales: `~/.config/crononauta/db.php` (**fuera del repo**, chmod 600). La API hace `require`.
- Provisión: `uapi Mysql create_database/create_user/set_privileges_on_database`.

## API (PHP)

`api/_db.php` (PDO + JSON + CORS) y endpoints:

| Endpoint | Parámetros | Devuelve |
|---|---|---|
| `api/capas.php` | — | capas (id, name, color, icon, orden) |
| `api/regiones.php` | — | regiones (id, name, orden) |
| `api/civilizaciones.php` | `?capa=`, `?region=` | civs (id, name, start, end, color, region, layer, tier, parent, desc, source, wd) |
| `api/eventos.php` | `?capa=`, `?region=`, `?desde=`, `?hasta=` | eventos (id, year, name, desc, region, layer, golden, source, wd) |

## Datos / ingesta

- **Semilla** (datos curados a mano): módulos en `assets/js/data/` (`civilizations.js`,
  `events.js`, `regions.js`, `layers.js`). `db/seed.mjs` los carga a la DB.
- **Ingesta masiva**: `scripts/import-wikidata.mjs` consulta Wikidata SPARQL por capa
  (clase `P31` + fecha `P585/P580/P571`, etiquetas `es`, artículo de Wikipedia) y hace
  upsert en `eventos`. Re-ejecutable (dedup por QID).
  - Aplicar esquema: `mariadb <db> < db/schema.sql`
  - Sembrar curados: `node db/seed.mjs | mariadb <db>`
  - Importar: `node scripts/import-wikidata.mjs | mariadb <db>`
- **Cita en vivo**: para eventos sin texto guardado, el panel trae resumen + imagen desde
  la API REST de Wikipedia (`es.wikipedia.org/api/rest_v1/page/summary/<título>`).

## Rendimiento

Capas conmutables (no se renderiza lo oculto) + **culling** por viewport + **LOD** (alejado
solo hitos dorados). Suficiente en SVG para miles de eventos visibles parcialmente; canvas se
diferiría solo si se superan ~15k simultáneos.

## Despliegue

Producción servida desde este directorio en el VPS (Apache + cPanel). `git push` a `main`.
Cache: imágenes 30 días; HTML/CSS/JS revalidados (sin build/hash → cambios al instante).

## Documentación path-scoped

- `CLAUDE.md` (raíz) — contexto y reglas. `assets/js/data/CLAUDE.md` — schema para aportar datos.

## Fuentes y licencias

Ver `CREDITS.md`. Código GPL-3.0. Datos: Wikidata CC0, Wikipedia CC BY-SA, imágenes Commons.
