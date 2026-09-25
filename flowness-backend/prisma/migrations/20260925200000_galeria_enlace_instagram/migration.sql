-- Link de la publicación de Instagram de donde vino cada foto o video
ALTER TABLE "Foto" ADD COLUMN "enlace" TEXT;
ALTER TABLE "Reel" ADD COLUMN "enlace" TEXT;

-- Lo que ya estaba como recuadro de Instagram guarda su propio link
UPDATE "Foto" SET "enlace" = "url" WHERE "tipo" = 'INSTAGRAM';
UPDATE "Reel" SET "enlace" = "url" WHERE "tipo" = 'INSTAGRAM';
