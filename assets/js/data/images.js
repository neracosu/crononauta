// Civilizaciones con imagen local descargada (scripts/download-images.sh). Solo pedimos
// estas para no disparar 404s en patriarcas/eventos sin imagen — esos usan fallback de
// emoji (tooltip) y resumen+imagen en vivo de Wikipedia (panel). Menos almacenamiento local.
const CIV_WITH_IMG = new Set([
  'sumer','egypt','akkad','babylon','assyria','hittites','phoenicia','israel','persia','parthia',
  'sassanid','caliphate','ottoman','minoan','mycenae','greece','rome','byzantine','frankish','hre',
  'england','spain','russia','portugal','viking','indus','china_ancient','india','japan','mongol',
  'korea','carthage','ethiopia','ghana','olmec','maya','aztec','inca','netherlands','prussia','usa','italy_unified',
]);
export const CIV_IMG = id => CIV_WITH_IMG.has(id) ? `assets/img/civs/${id}.jpg` : null;
export const EVENT_IMG = () => null; // sin imágenes locales de eventos: Wikipedia en vivo / fallback

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
