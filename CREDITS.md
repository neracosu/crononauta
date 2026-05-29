# Créditos y fuentes de datos

CRONONAUTA se nutre de datos abiertos y cita siempre la fuente.

## Datos

- **Wikidata** — datos estructurados (eventos, fechas, identificadores). Licencia
  [CC0](https://creativecommons.org/publicdomain/zero/1.0/) (dominio público). No requiere
  atribución, pero la damos con gusto. https://www.wikidata.org
- **Wikipedia (español)** — resúmenes y enlaces de los artículos. Licencia
  [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), compatible con la GPL-3.0
  de este proyecto. Cada evento importado enlaza a su artículo de origen. https://es.wikipedia.org

## Imágenes

- **Wikimedia Commons** — fotografías e ilustraciones de dominio público o CC. Se respeta la
  licencia de cada archivo. https://commons.wikimedia.org

## Inspiración

- *Adams' Synchronological Chart or Map of History* (Sebastian C. Adams, 1871) — dominio público.

## Ingesta

Los datos se importan a nuestra base de datos con `scripts/import-wikidata.mjs` (consultas
SPARQL a Wikidata) y se curan/amplían con aportes de la comunidad (ver `CONTRIBUTING.md`).
