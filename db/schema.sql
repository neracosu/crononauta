-- CRONONAUTA — esquema MariaDB. Sin secretos (versionable).
-- Aplicar: mariadb <db> < db/schema.sql   (credenciales fuera del repo)
SET NAMES utf8mb4;

DROP TABLE IF EXISTS eventos;
DROP TABLE IF EXISTS civilizaciones;
DROP TABLE IF EXISTS capas;
DROP TABLE IF EXISTS regiones;

CREATE TABLE regiones (
  id     INT PRIMARY KEY,
  nombre VARCHAR(80)  NOT NULL,
  orden  INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE capas (
  id     VARCHAR(40) PRIMARY KEY,
  nombre VARCHAR(80)  NOT NULL,
  color  VARCHAR(16)  NOT NULL,
  icono  VARCHAR(16)  NULL,
  orden  INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE civilizaciones (
  id          VARCHAR(48) PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL,
  anio_inicio INT NOT NULL,
  anio_fin    INT NOT NULL,
  color       VARCHAR(16) NOT NULL,
  region_id   INT NOT NULL,
  capa_id     VARCHAR(40) NOT NULL,
  tier        TINYINT NOT NULL DEFAULT 2,
  parent_id   VARCHAR(48) NULL,
  descripcion TEXT NULL,
  fuente_url  VARCHAR(500) NULL,
  wikidata    VARCHAR(20) NULL,
  KEY k_civ_region (region_id),
  KEY k_civ_capa (capa_id),
  KEY k_civ_inicio (anio_inicio),
  KEY k_civ_fin (anio_fin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE eventos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  anio        INT NOT NULL,
  nombre      VARCHAR(200) NOT NULL,
  descripcion TEXT NULL,
  region_id   INT NOT NULL,
  capa_id     VARCHAR(40) NOT NULL,
  golden      TINYINT NOT NULL DEFAULT 0,
  fuente_url  VARCHAR(500) NULL,
  wikidata    VARCHAR(20) NULL,
  KEY k_ev_capa (capa_id),
  KEY k_ev_region (region_id),
  KEY k_ev_anio (anio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
