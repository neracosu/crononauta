<?php
require __DIR__ . '/_db.php';
try {
  $rows = db()->query('SELECT id, nombre AS name, orden FROM regiones ORDER BY orden')->fetchAll();
  foreach ($rows as &$r) { $r['id'] = (int)$r['id']; $r['orden'] = (int)$r['orden']; }
  json_out($rows);
} catch (Throwable $e) { fail(500, 'db'); }
