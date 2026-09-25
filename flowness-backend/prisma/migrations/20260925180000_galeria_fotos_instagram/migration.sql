-- Las fotos de la galería también pueden venir de un link de Instagram
ALTER TABLE "Foto" ADD COLUMN "tipo" TEXT NOT NULL DEFAULT 'ARCHIVO';
