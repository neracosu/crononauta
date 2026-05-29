# Contribuir a CRONONAUTA

¡Gracias por querer aportar! Este proyecto vive de la colaboración. Puedes ayudar de
dos formas: **aportando datos históricos** (no requiere programar) o **mejorando el
código**.

---

## 🏛️ Aportar datos históricos (sin programar)

Toda la historia vive en archivos legibles dentro de `assets/js/data/`. Cada entrada
es un objeto sencillo. Edita el archivo, sigue el formato del ejemplo, y manda tu
cambio.

### Añadir una civilización

Archivo: [`assets/js/data/civilizations.js`](assets/js/data/civilizations.js)

```js
{
  id: "rome",            // identificador único, en minúsculas, sin espacios
  name: "Roma",          // nombre para mostrar
  start: -753,           // año de inicio (negativo = a.C.)
  end: 476,              // año de fin (negativo = a.C.)
  color: "#dc143c",      // color del río (hex)
  region: 1,             // índice de región (ver regions.js): 0..5
  tier: 1,               // importancia: 1 = mayor, 2 = media, 3 = menor
  parent: "",            // (opcional) id de la civ de la que deriva, ej: "rome" → "byzantine"
  desc: "De ciudad-estado a imperio mundial. Derecho romano, acueductos, coliseo.",
}
```

**Reglas de oro para los datos:**
- Años a.C. son **negativos** (`-753`), años d.C. positivos (`476`).
- `id` único y sin tildes ni espacios.
- `region` es un número 0–5 (Medio Oriente, Mediterráneo/Europa, Asia, África,
  Américas, Nórdico/Otros). Mira `regions.js`.
- Usa `parent` cuando una civilización deriva de otra (Roma → Bizancio): dibuja un
  conector de "río que se divide/fusiona".
- Cita una fuente confiable en tu PR (Wikipedia, libro, enciclopedia).

### Añadir un evento histórico

Archivo: [`assets/js/data/events.js`](assets/js/data/events.js)

```js
{
  year: 1492,
  name: "Descubrimiento de América",
  desc: "Colón llega al Nuevo Mundo.",
  region: 4,             // dónde posicionar el marcador (0..5)
  golden: true,          // true = hito destacado (marcador dorado)
}
```

### Añadir hitos del Recorrido (modo tour)

Archivo: [`assets/js/data/tour.js`](assets/js/data/tour.js) — la secuencia narrada
por la que viaja la cámara. Mira los ejemplos existentes.

### Imágenes

Las ilustraciones van en `assets/img/civs/` y `assets/img/events/`. Si propones una,
que sea de **dominio público o CC** (preferible Wikimedia Commons) e indica la fuente.

---

## 💻 Aportar código

1. Sigue el estilo existente: **vanilla JS, ES modules, sin dependencias ni build tools.**
2. Cada módulo tiene una sola responsabilidad. Respeta los límites de `core/`,
   `render/` y `ui/`.
3. Prueba tu cambio en local antes del PR (`python3 -m http.server`).

---

## 📥 Cómo enviar tu cambio

1. Haz *fork* del repo.
2. Crea una rama: `git checkout -b aporte/nombre-descriptivo`.
3. Haz tus cambios y un commit claro (en español o inglés).
4. Abre un *Pull Request* describiendo qué aportas y, si son datos, **tu fuente**.

¿Dudas o encontraste un error? Abre un *issue*. ¡Toda ayuda cuenta! 🧭
