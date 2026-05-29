// Registro de capas temáticas. Abierto y extensible: añadir una capa = una entrada aquí
// + sus datos. El `id` es la clave estable que referencian eventos y civilizaciones.
export const LAYERS = [
  { id:'civilizaciones', name:'Civilizaciones',          color:'#b07a3a', icon:'🏛️', orden:1 },
  { id:'religion',       name:'Religión',                color:'#7e57c2', icon:'📖', orden:2 },
  { id:'politica',       name:'Política y sociedad',     color:'#8a8d91', icon:'⚖️', orden:3 },
  { id:'guerras',        name:'Guerras y conflictos',    color:'#b03030', icon:'⚔️', orden:4 },
  { id:'ciencia',        name:'Ciencia',                 color:'#3a7ca5', icon:'🔬', orden:5 },
  { id:'tecnologia',     name:'Tecnología',              color:'#9b6dc7', icon:'⚙️', orden:6 },
  { id:'exploracion',    name:'Exploración y geografía', color:'#1f9e89', icon:'🧭', orden:7 },
  { id:'cultura',        name:'Arte y cultura',          color:'#d2691e', icon:'🎨', orden:8 },
  { id:'salud',          name:'Salud y medicina',        color:'#2e8b57', icon:'⚕️', orden:9 },
  { id:'naturaleza',     name:'Naturaleza y desastres',  color:'#6b8e23', icon:'🌋', orden:10 },
];

export function layerById(id) {
  return LAYERS.find(l => l.id === id) || LAYERS[0];
}

// Capa de una civilización/banda: los patriarcas (región 6) son 'religion', el resto 'civilizaciones'.
export function civLayer(civ) {
  return civ.layer || (civ.region === 6 ? 'religion' : 'civilizaciones');
}

// Presets por interés/audiencia (puerta de entrada): mapean un perfil a un conjunto de capas.
export const PRESETS = [
  { id:'todo',       label:'Todo',                 layers: LAYERS.map(l => l.id) },
  { id:'fe',         label:'Fe / Bíblica',         layers:['religion'] },
  { id:'medicina',   label:'Medicina',             layers:['salud','ciencia'] },
  { id:'ciencia',    label:'Ciencia y tecnología', layers:['ciencia','tecnologia'] },
  { id:'guerras',    label:'Guerras',              layers:['guerras','politica'] },
  { id:'civilizaciones', label:'Civilizaciones',   layers:['civilizaciones','religion','politica'] },
];
