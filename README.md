# 🧭 CRONONAUTA

### 6000 años de historia en tus manos

Una recreación web **interactiva** y **colaborativa** de la legendaria
*Adams' Synchronological Chart or Map of History* (Sebastian C. Adams, 1871):
un mapa de ~6000 años de historia humana donde las civilizaciones fluyen como
**ríos del tiempo** que nacen, crecen, se dividen y se fusionan.

🔗 **En vivo:** [crononauta.neracosu.com](https://crononauta.neracosu.com)

> Llevamos ese mapa antiguo a algo nuevo, innovador y moderno **sin perder su esencia.**

---

## ✨ Qué es

CRONONAUTA es un **atlas de museo interactivo**. Dos formas de explorar la historia
sobre un mismo lienzo:

- **🗺️ Exploración libre** — arrastra y haz zoom por 6000 años; mira muchas
  civilizaciones *en paralelo* sobre el mismo eje de tiempo (lo "sincronológico"
  del original de Adams).
- **🎬 Modo Recorrido** — la cámara viaja sola por los hitos clave de la historia
  mientras te cuenta la narrativa (ideal en móvil).

Estética **pergamino moderno**: el alma cálida del original (sepia, dorado,
ilustraciones) con tipografía y movimiento contemporáneos.

## 🛠️ Stack

HTML + CSS + **JavaScript vanilla con ES modules nativos**. Sin frameworks, sin
build tools, sin dependencias. Render vectorial (SVG) para los ríos, Canvas para
el minimapa. Solo abres `index.html` en un servidor estático.

```
crononauta.neracosu.com/
├── index.html
├── assets/
│   ├── css/   estilos (tokens, chart, ui, tour, responsive)
│   ├── js/
│   │   ├── data/    👈 civilizaciones, eventos, eras, regiones, tour
│   │   ├── core/    coordenadas y viewport (pan/zoom + cámara)
│   │   ├── render/  ríos, timeline, marcadores, minimapa
│   │   └── ui/      tooltip, panel, búsqueda, leyenda, controles, tour
│   └── img/   ilustraciones (civs/ y events/)
└── docs/      documentación de diseño
```

## 🚀 Correr en local

No necesita compilación. Cualquier servidor estático sirve:

```bash
# Con Python
python3 -m http.server 8000
# Con Node
npx serve .
```

Abre `http://localhost:8000`.

## 🤝 Contribuir

**Este es un proyecto abierto y queremos tu ayuda.** Especialmente con *datos
históricos*: civilizaciones, eventos y correcciones que se nos hayan pasado por alto.

No necesitas saber programar para aportar historia — los datos viven en archivos
sencillos y legibles en [`assets/js/data/`](assets/js/data/). Lee la guía:

👉 **[CONTRIBUTING.md](CONTRIBUTING.md)** — cómo añadir una civilización, un evento
o una corrección, paso a paso.

¿Encontraste un error histórico o falta una cultura importante? Abre un *issue* o
manda un *pull request*. Toda contribución cuenta.

## 📜 Licencia

Código bajo licencia [GNU GPL-3.0](LICENSE) — software libre y copyleft: cualquiera
puede usar, estudiar, modificar y compartir, manteniendo la misma libertad. El
contenido histórico y las descripciones se comparten con espíritu de dominio público
/ educativo.

Imágenes de referencia: [Wikimedia Commons](https://commons.wikimedia.org) (dominio
público / CC). El mapa original de Adams (1871) es de dominio público.

---

*Creado por [Neri Colón](https://neracosu.com) — VIP SOFT / Desarrollos Turísticos
Siglo XXII, C.A. · [github.com/neracosu](https://github.com/neracosu)*
