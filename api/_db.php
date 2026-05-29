<?php
// Conexión PDO + helpers JSON. Las credenciales viven FUERA del repo (no versionar).
declare(strict_types=1);

function db(): PDO {
  static $pdo = null;
  if ($pdo === null) {
    $cfg = require '/home/neracosu/.config/crononauta/db.php';
    $pdo = new PDO($cfg['dsn'], $cfg['user'], $cfg['pass'], [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
  }
  return $pdo;
}

function json_out($data): void {
  header('Content-Type: application/json; charset=utf-8');
  header('Access-Control-Allow-Origin: *');
  header('Cache-Control: public, max-age=300');
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function fail(int $code, string $msg): void {
  http_response_code($code);
  json_out(['error' => $msg]);
}
