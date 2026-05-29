<?php
require __DIR__ . '/_db.php';
// Opcional: ?capa=guerras  ?desde=-1000  ?hasta=1500  ?region=1
try {
  $sql = 'SELECT id, anio, nombre AS name, descripcion, region_id, capa_id, golden, fuente_url, wikidata FROM eventos';
  $where = []; $args = [];
  if (!empty($_GET['capa']))   { $where[] = 'capa_id = ?'; $args[] = $_GET['capa']; }
  if (isset($_GET['region']) && $_GET['region'] !== '') { $where[] = 'region_id = ?'; $args[] = (int)$_GET['region']; }
  if (isset($_GET['desde']) && $_GET['desde'] !== '') { $where[] = 'anio >= ?'; $args[] = (int)$_GET['desde']; }
  if (isset($_GET['hasta']) && $_GET['hasta'] !== '') { $where[] = 'anio <= ?'; $args[] = (int)$_GET['hasta']; }
  if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
  $sql .= ' ORDER BY anio';
  $st = db()->prepare($sql); $st->execute($args);
  $out = [];
  foreach ($st as $r) {
    $out[] = [
      'id' => (int)$r['id'], 'year' => (int)$r['anio'], 'name' => $r['name'],
      'desc' => $r['descripcion'], 'region' => (int)$r['region_id'], 'layer' => $r['capa_id'],
      'golden' => (bool)$r['golden'], 'source' => $r['fuente_url'], 'wd' => $r['wikidata'],
    ];
  }
  json_out($out);
} catch (Throwable $e) { fail(500, 'db'); }
