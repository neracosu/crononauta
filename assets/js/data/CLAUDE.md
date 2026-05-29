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
