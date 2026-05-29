<?php
require __DIR__ . '/_db.php';
try {
  $rows = db()->query('SELECT id, nombre AS name, color, icono AS icon, orden FROM capas ORDER BY orden')->fetchAll();
  foreach ($rows as &$r) { $r['orden'] = (int)$r['orden']; }
  json_out($rows);
} catch (Throwable $e) { fail(500, 'db'); }
