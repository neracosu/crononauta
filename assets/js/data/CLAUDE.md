# assets/js/data/ — Datos históricos (semilla + capas)

> **Arquitectura v2:** en producción los datos vienen de la **DB** (vía `api/*.php`).
> Estos módulos son la **semilla curada** (se cargan a la DB con `db/seed.mjs`) y el
> **respaldo offline**. Para añadir contenido a escala se usa `scripts/import-wikidata.mjs`.
> Tras editar la semilla, re-sembrar: `node db/seed.mjs | mariadb <db>`.

Se carga automáticamente al editar archivos de esta carpeta. **No requiere saber programar**:
editar un objeto y abrir PR. Las **capas** se definen en `layers.js` (añadir capa = una entrada).

## Schema

**Civilización** (`civilizations.js`): `id` único sin tildes/espacios · `name` · `start`/`end`
(año, **negativo = a.C.**) · `color` hex · `region` 0–5 (ver `regions.js`) · `tier` 1|2|3
(importancia → grosor del río) · `parent` opcional (id del que deriva → dibuja conector) · `desc`.

**Evento** (`events.js`): `year` · `name` · `desc` · `region` 0–6 · `layer` (capa temática,
ver `layers.js`) · `golden` opcional (hito) · `source`/`wd` opcionales (cita Wikipedia/Wikidata).

**Hito de tour** (`tour.js`): `id` · `title` · `caption` · `focus` ({civId}|{year,region}|{eventName}) · `zoom`.

## Reglas
- Años a.C. **negativos** (`-753`). `id` único y estable (no renombrar; otros datos lo referencian).
- Citar fuente confiable en el PR. Imágenes solo de dominio público / CC.
- No tocar `version.js` ni la lógica de `core/`/`render/`/`ui/` al aportar datos.
