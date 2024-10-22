-- Este comando se debe ejecutar fuera de este script SQL, ya que PostgreSQL no permite condicionales en la creación de DB directamente.
-- CREATE DATABASE "TECH_CONSULTING";

DROP TABLE IF EXISTS "compras";
DROP TABLE IF EXISTS "servicios";
DROP TABLE IF EXISTS "usuarios";
DROP TABLE IF EXISTS "productos_deseados";

CREATE TABLE usuarios (
  "id" SERIAL PRIMARY KEY,
  "nombre_usuario" VARCHAR NOT NULL,
  "email" VARCHAR NOT NULL,
  "password" VARCHAR NOT NULL,
  "dt_creado" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "admin" INT DEFAULT 0,
  "image_bin" BYTEA DEFAULT NULL,
  "image_name" VARCHAR DEFAULT NULL,
  "image_url" VARCHAR DEFAULT NULL,
  "parte_equipo" INT DEFAULT 0 
);

CREATE TABLE servicios (
  "id" SERIAL PRIMARY KEY,
  "srv_nom" VARCHAR NOT NULL,
  "srv_desc" VARCHAR,
  "srv_desc_corta" VARCHAR,
  "srv_info" VARCHAR,
  "srv_precio" NUMERIC NOT NULL,
  "srv_imagen" BYTEA DEFAULT NULL,
  "srv_nombre_imagen" VARCHAR DEFAULT NULL,
  "srv_imagen_url" VARCHAR DEFAULT NULL,
  "activo" INT default 1,
  "dt_creado" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE compras (
  "id" SERIAL PRIMARY KEY,
  "dt_compra" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "cantidad" INT DEFAULT 0,
  "id_servicio" INT REFERENCES "servicios"("id"),
  "id_usuario" INT REFERENCES "usuarios"("id")
);


CREATE TABLE productos_deseados (
  "id" SERIAL PRIMARY KEY,
  "dt_registro" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "id_servicio" INT REFERENCES "servicios"("id"),
  "id_usuario" INT REFERENCES "usuarios"("id")
);


CREATE TABLE flask_sessions (
    "id" SERIAL PRIMARY KEY,
    "session_id" VARCHAR(255) UNIQUE NOT NULL,
    "data" BYTEA NOT NULL,
    "expiry" TIMESTAMP NOT NULL
);


-- VISTA Mis Compras
CREATE VIEW vista_compras_servicios AS
SELECT 
	  p.id AS id_producto,
    p.srv_nom AS titulo,
    p.srv_precio AS precio,
    p.srv_imagen_url AS imagen,
    c.cantidad AS cantidad,
    c.dt_compra AS fecha,
    c.id_usuario
FROM 
    compras c
JOIN 
    servicios p ON c.id_servicio = p.id;


-- VISTA Productos Deseados
CREATE VIEW vista_productos_deseados AS
SELECT 
	pd.id_usuario AS id_usuario,
	s.id AS id_servicio,
	s.srv_nom AS titulo, 
	s.srv_desc AS descripcion, 
	s.srv_desc_corta AS descripcion_previa, 
	s.srv_info AS info, 
	s.srv_precio AS precio,
	s.srv_imagen_url AS imagen
FROM 
	productos_deseados pd
JOIN 
	servicios s ON pd.id_servicio = s.id;


-- Detalles de usuario
CREATE VIEW vista_detalle_usuario AS
SELECT
  u.id,
  u.nombre_usuario,
  u.email,
  COUNT(DISTINCT c.id) AS total_compras,
  COUNT(DISTINCT pd.id) AS total_productos_deseados
FROM
  usuarios u
LEFT JOIN compras c ON u.id = c.id_usuario
LEFT JOIN productos_deseados pd ON u.id = pd.id_usuario
GROUP BY
  u.id;

-- Productos populares
CREATE VIEW vista_servicios_populares AS
SELECT
  s.id,
  s.srv_nom,
  s.srv_desc_corta,
  s.srv_precio,
  COUNT(DISTINCT c.id) AS total_compras,
  COUNT(DISTINCT pd.id) AS veces_deseado
FROM
  servicios s
LEFT JOIN compras c ON s.id = c.id_servicio
LEFT JOIN productos_deseados pd ON s.id = pd.id_servicio
GROUP BY
  s.id
ORDER BY
  total_compras DESC, veces_deseado DESC;
