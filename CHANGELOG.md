# Changelog

Todos los cambios notables de CRONONAUTA. Formato basado en
[Keep a Changelog](https://keepachangelog.com/es-ES/) y versionado [SemVer](https://semver.org/lang/es/).
Lo más reciente arriba.

## [Sin publicar]

## [2.0.0] - 2026-05-29 — Refocus: producto enfocado y profundo

### Cambiado (decisión de producto: profundidad sobre amplitud)
- **Cortado el ruido**: eliminados los 146 eventos de Wikidata sin curar, la **vista Capas**
  (swimlanes) y el río de densidad. Una sola vista excelente: el **Atlas**. Las capas siguen
  como **filtro** temático en el selector.
- **Dataset curado y ampliado a 78 eventos** (de 48): capa **Religión** de 6 a **21 hitos**
  bíblicos (José, Conquista de Canaán, David, división del reino, exilio, Macabeos,
  Crucifixión, destrucción del Templo…) + ciencia/tecnología/salud (escritura, Buda, Confucio,
  Galileo, Newton, vapor, vacuna, ADN, Luna, la Web, COVID-19…).
- **Imagen y detalle en vivo de Wikipedia** en el panel para todo evento con fuente, manteniendo
  la descripción curada.
- Verificado en **navegador real** (headless Chromium): 0 errores JS, 0 404, render correcto.

## [1.6.3] - 2026-05-29

### Corregido
- **Inundación de 404 en consola** por imágenes inexistentes (18 patriarcas + todos los
  eventos nunca tuvieron imagen local). Ya no se piden: solo se solicitan las 42 imágenes
  de civilización que existen; el resto usa emoji (tooltip) + Wikipedia en vivo (panel).
  Verificado en navegador real: 0 404 de imágenes.

## [1.6.2] - 2026-05-29

### Corregido (verificado en navegador real con headless Chromium)
- **El zoom semántico, el % de zoom y el minimapa no se actualizaban** tras la carga: el
  viewport se "envolvía" desde fuera (`vp.apply`), pero los métodos internos llaman al apply
  interno → los envoltorios nunca corrían. Reemplazado por un **registro de listeners** propio
  del viewport que se dispara en cada movimiento.
- **Las etiquetas de evento nunca aparecían** al hacer zoom: el CSS las pone `display:none` y
  se "mostraban" con `display=''` (que revierte al CSS). Ahora se muestran con `display:block`.
- Favicon SVG inline (elimina el 404 de `favicon.ico`).

## [1.6.1] - 2026-05-29

### Corregido
- `ReferenceError: EVENTS is not defined` al entrar: faltaba importar `EVENTS` en `main.js`
  (lo usaban `frameActive` y los ríos de densidad). Rompía el encuadre inicial y las capas.

## [1.6.0] - 2026-05-29

### Añadido
- **Zoom semántico estilo Google Maps**: alejado se ve el panorama (ríos + eras + hitos
  dorados); al **acercar** aparecen, por niveles, los nombres de civilización → todos los
  marcadores → las **etiquetas con el nombre de cada evento**. El detalle se revela al
  maximizar, no encogiendo el contenido.

## [1.5.2] - 2026-05-29

### Corregido
- **Inicio en espacio en blanco**: al entrar o resetear, la cámara ahora **encuadra el
  contenido de las capas activas** (te lleva a donde hay cosas). En vistas de solo capas
  temáticas ya no se ocultan los marcadores por nivel de detalle.

## [1.5.1] - 2026-05-29

### Añadido
- **Ríos de densidad por capa** en la vista Capas: cada capa de eventos (guerras, ciencia,
  salud…) ahora fluye como un río que se ensancha donde tiene más actividad histórica
  (antes esos carriles salían vacíos, solo con puntos).

## [1.5.0] - 2026-05-29

### Añadido (Fase 3 — doble modo)
- **Vista "Capas"** (swimlanes por tema) además de la vista **"Atlas"** (filas por región).
  Botón conmutador ⇄ en los controles; `layout()` agrupa por región o por capa según `?vista=`.
  Con esto, el rediseño v2 multicapa queda completo (Fases 0–4).

## [1.4.0] - 2026-05-29

### Añadido
- **Presets de audiencia en el inicio**: "¿Qué historia quieres explorar?" → Todo,
  Fe/Bíblica, Medicina, Guerras, Ciencia y tecnología (Fase 3).
- **Nivel de detalle + culling** (Fase 4): alejado se ven solo los hitos dorados; al
  acercarte aparecen todos; solo se renderiza lo visible. Limpia las capas densas y
  prepara el rendimiento para miles de eventos.

## [1.3.0] - 2026-05-29

### Añadido (Fase 2 — motor de contenido)
- **Motor de ingesta Wikidata** (`scripts/import-wikidata.mjs`): consulta SPARQL por capa
  e inserta en la DB con deduplicación por QID. Sembradas las capas **Guerras** (+118) y
  **Salud** (+28) — de 48 a **194 eventos**.
- **Cita de la fuente**: cada evento importado enlaza a su artículo de Wikipedia; el panel
  trae **resumen + imagen en vivo** desde la API de Wikipedia cuando no hay texto guardado.
- Aviso de licencias (footer + `CREDITS.md`): Wikidata CC0 · Wikipedia CC BY-SA.
- Marcadores escalonados verticalmente para reducir amontonamiento.

## [1.2.1] - 2026-05-29

### Cambiado
- El panel de capas (toggles ambiguos) se reemplaza por un **selector desplegable** con
  perfiles (Todo, Fe/Bíblica, Medicina, Ciencia y tecnología, Guerras…) + capas sueltas.
- **El Recorrido se adapta a la capa seleccionada**: con "Todo" corre el tour global curado;
  con una capa/perfil, se genera un recorrido cronológico con sus hitos.

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
