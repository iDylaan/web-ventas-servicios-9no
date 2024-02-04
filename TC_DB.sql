CREATE TABLE "usuarios" (
  "id" SERIAL PRIMARY KEY,
  "nombre_usuario" VARCHAR NOT NULL,
  "email" VARCHAR NOT NULL,
  "password" VARCHAR NOT NULL,
  "dt_creado" DATETIME DEFAULT 'CURRENT_TIMESTAMP',
  "admin" INT DEFAULT 0,
  "parte_equipo" INT DEFAULT 0
);

CREATE TABLE "servicios" (
  "id" SERIAL PRIMARY KEY,
  "srv_nom" VARCHAR NOT NULL,
  "srv_desc" VARCHAR,
  "srv_precio" NUMBER NOT NULL,
  "srv_imagen" BYTEA
);

CREATE TABLE "compras" (
  "id" SERIAL PRIMARY KEY,
  "dt_compra" datetime DEFAULT 'CURRENT_TIMESTAMP',
  "cantidad" INT DEFAULT 0,
  "id_servicio" INT REFERENCES servicios(id),
  "id_usuario" INT REFERENCES usuarios(id)
);

CREATE TABLE "compras_servicios" (
  "compras_id_servicio" INT REFERENCES compras(id_servicio),
  "servicios_id" INT REFERENCES servicios(id),
  PRIMARY KEY ("compras_id_servicio", "servicios_id")
);