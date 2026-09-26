import prisma from '../../config/prisma.js'

// Busca lo que se quiere comprar (una clase o un curso) y valida que se pueda
export const obtenerProducto = async ({ claseId, cursoId }, usuarioId) => {
  if (cursoId) {
    const curso = await prisma.curso.findUnique({ where: { id: Number(cursoId) } })
    if (!curso || !curso.activo) return { error: 'Curso no encontrado', status: 404 }
    if (!(curso.precio > 0)) return { error: 'Este curso todavía no está a la venta' }
    const yaComprado = await prisma.compra.findFirst({ where: { usuarioId, cursoId: curso.id, estado: 'APROBADO' } })
    if (yaComprado) return { error: 'Ya tenés este curso' }
    return { titulo: curso.nombre, precio: curso.precio, idItem: `curso-${curso.id}`, datosCompra: { cursoId: curso.id }, volver: `/formacion/${curso.slug}` }
  }

  const clase = await prisma.clase.findUnique({ where: { id: Number(claseId) } })
  if (!clase || !clase.activo) return { error: 'Clase no encontrada', status: 404 }
  if (clase.esGratis) return { error: 'Esta clase es gratis, no hace falta comprarla' }
  if (!(clase.precio > 0)) return { error: 'Esta clase todavía no tiene precio' }
  const yaComprada = await prisma.compra.findFirst({ where: { usuarioId, claseId: clase.id, estado: 'APROBADO' } })
  if (yaComprada) return { error: 'Ya tenés esta clase' }
  return { titulo: clase.nombre, precio: clase.precio, idItem: `clase-${clase.id}`, datosCompra: { claseId: clase.id }, volver: '/clases' }
}
