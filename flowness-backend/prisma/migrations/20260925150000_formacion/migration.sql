-- Formación: cursos por nivel con sus lecciones, y compras de cursos

-- DropForeignKey
ALTER TABLE "Compra" DROP CONSTRAINT "Compra_claseId_fkey";

-- AlterTable
ALTER TABLE "Compra" ADD COLUMN     "cursoId" INTEGER,
ALTER COLUMN "claseId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Curso" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "subtitulo" TEXT,
    "descripcion" TEXT NOT NULL DEFAULT '',
    "dirigidoA" TEXT,
    "duracion" TEXT,
    "totalVideos" INTEGER,
    "precio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "portadaUrl" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leccion" (
    "id" SERIAL NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "videoUrl" TEXT,
    "pdfUrl" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Leccion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Curso_slug_key" ON "Curso"("slug");

-- AddForeignKey
ALTER TABLE "Leccion" ADD CONSTRAINT "Leccion_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES "Clase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Los 3 niveles ya creados: Florencia completa textos y precio desde el panel.
-- Con precio 0 se muestran como "Próximamente" y no se pueden comprar.
INSERT INTO "Curso" ("slug", "nombre", "subtitulo", "orden") VALUES
  ('esencial', 'Flowness Esencial', 'Nivel 1', 1),
  ('avanza',   'Flowness Avanza',   'Nivel 2', 2),
  ('pro',      'Flowness Pro',      'Nivel 3', 3);
