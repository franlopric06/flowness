-- Las clases dejan de depender de una fase y suman miniatura y duración

-- DropForeignKey
ALTER TABLE "Clase" DROP CONSTRAINT "Clase_faseId_fkey";

-- AlterTable
ALTER TABLE "Clase" ADD COLUMN     "duracion" TEXT,
ADD COLUMN     "miniaturaUrl" TEXT,
ALTER COLUMN "faseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Clase" ADD CONSTRAINT "Clase_faseId_fkey" FOREIGN KEY ("faseId") REFERENCES "Fase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
