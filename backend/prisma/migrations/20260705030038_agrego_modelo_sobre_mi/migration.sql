-- CreateTable
CREATE TABLE "SobreMi" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion1" TEXT NOT NULL,
    "descripcion2" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SobreMi_pkey" PRIMARY KEY ("id")
);
