-- Avisos con tipo (novedad, clase gratis, promo), botón, imagen y vencimiento
ALTER TABLE "Aviso" ADD COLUMN "tipo" TEXT NOT NULL DEFAULT 'NOVEDAD';
ALTER TABLE "Aviso" ADD COLUMN "destino" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Aviso" ADD COLUMN "enlace" TEXT;
ALTER TABLE "Aviso" ADD COLUMN "imagenUrl" TEXT;
ALTER TABLE "Aviso" ADD COLUMN "hasta" TEXT;

-- Antes "eliminar" solo ocultaba el aviso; ahora ocultar y eliminar son cosas distintas,
-- así que los que ya se habían eliminado se borran de verdad
DELETE FROM "Aviso" WHERE "activo" = false;
