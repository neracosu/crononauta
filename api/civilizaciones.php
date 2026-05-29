<?php
require __DIR__ . '/_db.php';
// Opcional: ?capa=guerras  ?region=1
try {
  $sql = 'SELECT id, nombre AS name, anio_inicio, anio_fin, color, region_id, capa_id, tier, parent_id, descripcion, fuente_url, wikidata FROM civilizaciones';
  $where = []; $args = [];
  if (!empty($_GET['capa']))   { $where[] = 'capa_id = ?';   $args[] = $_GET['capa']; }
  if (isset($_GET['region']) && $_GET['region'] !== '') { $where[] = 'region_id = ?'; $args[] = (int)$_GET['region']; }
  if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
  $sql .= ' ORDER BY region_id, anio_inicio';
  $st = db()->prepare($sql); $st->execute($args);
  $out = [];
  foreach ($st as $r) {
    $out[] = [
      'id' => $r['id'], 'name' => $r['name'],
      'start' => (int)$r['anio_inicio'], 'end' => (int)$r['anio_fin'],
      'color' => $r['color'], 'region' => (int)$r['region_id'], 'layer' => $r['capa_id'],
      'tier' => (int)$r['tier'], 'parent' => $r['parent_id'],
      'desc' => $r['descripcion'], 'source' => $r['fuente_url'], 'wd' => $r['wikidata'],
    ];
  }
  json_out($out);
} catch (Throwable $e) { fail(500, 'db'); }
