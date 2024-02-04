-- Este comando se debe ejecutar fuera de este script SQL, ya que PostgreSQL no permite condicionales en la creación de DB directamente.
-- CREATE DATABASE "TECH_CONSULTING";

DROP TABLE IF EXISTS "compras_servicios";
DROP TABLE IF EXISTS "compras";
DROP TABLE IF EXISTS "servicios";
DROP TABLE IF EXISTS "usuarios";

CREATE TABLE "usuarios" (
  "id" SERIAL PRIMARY KEY,
  "nombre_usuario" VARCHAR NOT NULL,
  "email" VARCHAR NOT NULL,
  "password" VARCHAR NOT NULL,
  "dt_creado" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "admin" INT DEFAULT 0,
  "parte_equipo" INT DEFAULT 0
);

CREATE TABLE "servicios" (
  "id" SERIAL PRIMARY KEY,
  "srv_nom" VARCHAR NOT NULL,
  "srv_desc" VARCHAR,
  "srv_precio" NUMERIC NOT NULL,
  "srv_imagen" BYTEA
);

CREATE TABLE "compras" (
  "id" SERIAL PRIMARY KEY,
  "dt_compra" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "cantidad" INT DEFAULT 0,
  "id_servicio" INT REFERENCES "servicios"("id"),
  "id_usuario" INT REFERENCES "usuarios"("id")
);

CREATE TABLE "compras_servicios" (
  "compras_id_servicio" INT,
  "servicios_id" INT,
  PRIMARY KEY ("compras_id_servicio", "servicios_id"),
  FOREIGN KEY ("compras_id_servicio") REFERENCES "compras"("id"),
  FOREIGN KEY ("servicios_id") REFERENCES "servicios"("id")
);
