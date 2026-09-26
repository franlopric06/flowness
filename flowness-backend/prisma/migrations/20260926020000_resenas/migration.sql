-- Reseñas con estrellas de clases y cursos (se publican cuando se aprueban)
CREATE TABLE "Resena" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "claseId" INTEGER,
    "cursoId" INTEGER,
    "estrellas" INTEGER NOT NULL,
    "texto" TEXT NOT NULL DEFAULT '',
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "respuesta" TEXT,
    "destacada" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resena_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Resena_estado_idx" ON "Resena"("estado");
CREATE UNIQUE INDEX "Resena_usuarioId_claseId_key" ON "Resena"("usuarioId", "claseId");
CREATE UNIQUE INDEX "Resena_usuarioId_cursoId_key" ON "Resena"("usuarioId", "cursoId");

ALTER TABLE "Resena" ADD CONSTRAINT "Resena_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Resena" ADD CONSTRAINT "Resena_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES "Clase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Resena" ADD CONSTRAINT "Resena_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
