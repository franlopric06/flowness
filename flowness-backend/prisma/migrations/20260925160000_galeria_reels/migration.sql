-- Reels de la galería: link de Instagram o video subido a Cloudinary

-- CreateTable
CREATE TABLE "Reel" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'INSTAGRAM',
    "url" TEXT NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reel_pkey" PRIMARY KEY ("id")
);
