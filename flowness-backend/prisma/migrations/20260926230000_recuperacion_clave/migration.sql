-- Links de un solo uso para recuperar la contraseña
CREATE TABLE "RecuperacionClave" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expira" TIMESTAMP(3) NOT NULL,
    "usadoEn" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecuperacionClave_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RecuperacionClave_tokenHash_key" ON "RecuperacionClave"("tokenHash");
CREATE INDEX "RecuperacionClave_usuarioId_idx" ON "RecuperacionClave"("usuarioId");

ALTER TABLE "RecuperacionClave" ADD CONSTRAINT "RecuperacionClave_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
