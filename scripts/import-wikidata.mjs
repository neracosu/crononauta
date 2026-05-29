// Ingesta híbrida: consulta Wikidata (CC0) por capa y emite SQL upsert → DB.
// Uso: node scripts/import-wikidata.mjs | mariadb neracosu_crononauta
// (credenciales fuera del repo). Cada fila guarda fuente_url (Wikipedia) y wikidata (QID).
const UA = 'CrononautaBot/1.0 (https://crononauta.neracosu.com; neracosu@gmail.com)';
const ENDPOINT = 'https://query.wikidata.org/sparql';

// País (Wikidata QID) → región del atlas (0..6). Default 1 (Mediterráneo/Europa).
const COUNTRY_REGION = {
  Q43:0, Q794:0, Q796:0, Q801:0, Q79:0,                 // Medio Oriente / Egipto
  Q148:2, Q17:2, Q668:2, Q884:2, Q889:2,                // Asia
  Q258:3, Q1033:3, Q1041:3,                             // África
  Q96:4, Q155:4, Q414:4, Q298:4, Q739:4, Q717:4, Q77:4, // Américas
  Q30:5,                                                // EE.UU.
};

// Capas a sembrar: clase (P31) + propiedad de fecha + límite.
const CONFIGS = [
  { layer:'guerras', cls:'Q198',     dateProp:'P580', limit:70 },  // guerra
  { layer:'guerras', cls:'Q178561',  dateProp:'P585', limit:50 },  // batalla
  { layer:'salud',   cls:'Q3241045', dateProp:'P580', limit:40 },  // epidemia
];

function sparql(cls, dateProp, limit) {
  return `SELECT ?item ?itemLabel ?fecha ?country ?article WHERE {
    ?item wdt:P31 wd:${cls} ; wdt:${dateProp} ?fecha .
    ?article schema:about ?item ; schema:isPartOf <https://es.wikipedia.org/> .
    OPTIONAL { ?item wdt:P17 ?country . }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "es" . }
  } ORDER BY ?fecha LIMIT ${limit}`;
}

const q = v => v === null || v === undefined ? 'NULL' : `'${String(v).replace(/\\/g,'\\\\').replace(/'/g,"''")}'`;
const yearOf = iso => { const m = String(iso).match(/^(-?\d+)-/); return m ? parseInt(m[1], 10) : null; };

async function run() {
  const seen = new Set();
  const rows = [];
  for (const c of CONFIGS) {
    const url = `${ENDPOINT}?query=${encodeURIComponent(sparql(c.cls, c.dateProp, c.limit))}&format=json`;
    const res = await fetch(url, { headers: { 'Accept':'application/sparql-results+json', 'User-Agent':UA } });
    if (!res.ok) { process.stderr.write(`WDQS ${c.cls} -> ${res.status}\n`); continue; }
    const data = await res.json();
    for (const b of data.results.bindings) {
      const qid = b.item.value.split('/').pop();
      if (seen.has(qid)) continue;
      const year = yearOf(b.fecha.value);
      const name = b.itemLabel?.value;
      if (year === null || !name || /^Q\d+$/.test(name)) continue; // sin etiqueta ES útil
      seen.add(qid);
      const cQid = b.country ? b.country.value.split('/').pop() : null;
      rows.push({
        year, name, layer: c.layer,
        region: (cQid && COUNTRY_REGION[cQid] !== undefined) ? COUNTRY_REGION[cQid] : 1,
        source: b.article?.value || null, wd: qid,
      });
    }
    process.stderr.write(`${c.layer}/${c.cls}: ${data.results.bindings.length} filas\n`);
  }

  const out = ['SET NAMES utf8mb4;', 'START TRANSACTION;'];
  for (const r of rows) {
    out.push(
      `INSERT INTO eventos (anio,nombre,region_id,capa_id,golden,fuente_url,wikidata) VALUES (` +
      `${r.year},${q(r.name)},${r.region},${q(r.layer)},0,${q(r.source)},${q(r.wd)}) ` +
      `ON DUPLICATE KEY UPDATE anio=VALUES(anio),nombre=VALUES(nombre),region_id=VALUES(region_id),` +
      `capa_id=VALUES(capa_id),fuente_url=VALUES(fuente_url);`);
  }
  out.push('COMMIT;');
  process.stderr.write(`Total a insertar: ${rows.length}\n`);
  process.stdout.write(out.join('\n') + '\n');
}
run();
