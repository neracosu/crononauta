// Las imágenes se descargan a /assets/img/ en la Task 16. Hasta entonces, el loader
// usará el fallback de emoji+color. Ruta local por id de civ y por nombre de evento.
export const CIV_IMG = id => `assets/img/civs/${id}.jpg`;
export const EVENT_IMG = name => `assets/img/events/${slug(name)}.jpg`;

export function slug(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const CIV_ICONS = {
  sumer:'🏛️', egypt:'🔺', akkad:'⚔️', babylon:'🏗️', assyria:'🦁', hittites:'🗡️',
  phoenicia:'⚓', israel:'✡️', persia:'🏛️', parthia:'🐴', sassanid:'🔥', caliphate:'☪️',
  ottoman:'🕌', minoan:'🐂', mycenae:'🛡️', greece:'🏛️', rome:'🏟️', byzantine:'⛪',
  frankish:'⚜️', hre:'👑', england:'🏰', spain:'🏰', russia:'🪆', portugal:'⛵',
  viking:'⚔️', indus:'🧱', china_ancient:'🐉', india:'🕉️', japan:'⛩️', mongol:'🏹',
  korea:'🎋', carthage:'⚓', ethiopia:'🗿', ghana:'👑', olmec:'🗿', maya:'🔮', aztec:'☀️',
  inca:'🏔️', netherlands:'🌷', prussia:'🦅', usa:'🗽', italy_unified:'🏟️',
  // Relato bíblico (patriarcas)
  adam:'🌱', seth:'📜', enos:'📜', cainan:'📜', mahalaleel:'📜', jared:'📜',
  enoch:'✨', methuselah:'⏳', lamech:'📜', noah:'🚢', shem:'📜', arphaxad:'📜',
  eber:'📜', peleg:'🌍', terah:'🐪', abraham:'⭐', isaac:'📜', jacob:'✡️',
};

export const DEFAULT_ICON = '📜';
