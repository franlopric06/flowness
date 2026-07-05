-- CreateTable
CREATE TABLE "Nivel" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "etiqueta" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "para" TEXT NOT NULL,
    "incluye" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Nivel_pkey" PRIMARY KEY ("id")
);
