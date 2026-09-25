-- Videos cortos de muestra para las tarjetas (fases, clases y niveles)
ALTER TABLE "Fase" ADD COLUMN "muestraUrl" TEXT;
ALTER TABLE "Clase" ADD COLUMN "muestraUrl" TEXT;
ALTER TABLE "Curso" ADD COLUMN "muestraUrl" TEXT;

-- Video de la historia en "Sobre mí"
ALTER TABLE "SobreMi" ADD COLUMN "videoUrl" TEXT;
