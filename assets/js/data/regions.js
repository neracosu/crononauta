// El orden del array = orden de apilado vertical (arriba → abajo).
// El `id` es la clave estable que referencian civs y eventos (NO usar el índice posicional).
export const REGIONS = [
  { id: 6, name: 'RELATO BÍBLICO' },
  { id: 0, name: 'MEDIO ORIENTE' },
  { id: 1, name: 'MEDITERRÁNEO / EUROPA' },
  { id: 2, name: 'ASIA' },
  { id: 3, name: 'ÁFRICA' },
  { id: 4, name: 'AMÉRICAS' },
  { id: 5, name: 'NÓRDICO / OTROS' },
];

// Buscar región por su id (desacopla el id del orden del array).
export function regionById(id) {
  return REGIONS.find(r => r.id === id) || REGIONS[0];
}
