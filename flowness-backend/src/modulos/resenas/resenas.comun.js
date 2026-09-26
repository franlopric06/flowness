import prisma from '../../config/prisma.js'

export const ESTADOS = ['PENDIENTE', 'APROBADA', 'RECHAZADA']

// Lee de qué se habla: { claseId } o { cursoId } (uno solo)
export function leerProducto(fuente = {}) {
  const claseId = Number(fuente.claseId) || null
  const cursoId = Number(fuente.cursoId) || null
  if (!claseId === !cursoId) return null // tiene que venir exactamente uno
  return claseId ? { claseId } : { cursoId }
}

// Nombre que se muestra en público: "Ana P." (nunca el apellido completo ni el email)
export function nombrePublico(nombre = '') {
  const partes = String(nombre).trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return 'Alumna/o'
  const primero = partes[0][0].toUpperCase() + partes[0].slice(1).toLowerCase()
  const inicial = partes[1] ? ` ${partes[1][0].toUpperCase()}.` : ''
  return `${primero}${inicial}`
}

// Reseña tal como se muestra en el sitio
export const resenaPublica = (r) => ({
  id: r.id,
  estrellas: r.estrellas,
  texto: r.texto,
  respuesta: r.respuesta,
  autor: nombrePublico(r.usuario?.nombre),
  fecha: r.creadoEn,
  ...(r.clase ? { producto: r.clase.nombre } : {}),
  ...(r.curso ? { producto: `Formación · ${r.curso.nombre}` } : {}),
})

// ¿Puede opinar? Tiene que tener acceso: compra aprobada, o clase gratis.
// Devuelve { ok: true } o { error, status }
export async function puedeOpinar(usuario, producto) {
  if (!usuario) return { error: 'Tenés que iniciar sesión', status: 401 }
  if (usuario.rol === 'ADMIN') return { error: 'La administración no deja reseñas', status: 403 }

  if (producto.claseId) {
    const clase = await prisma.clase.findUnique({ where: { id: producto.claseId } })
    if (!clase || !clase.activo) return { error: 'Clase no encontrada', status: 404 }
    if (clase.esGratis) return { ok: true }
  } else {
    const curso = await prisma.curso.findUnique({ where: { id: producto.cursoId } })
    if (!curso || !curso.activo) return { error: 'Curso no encontrado', status: 404 }
  }

  const compra = await prisma.compra.findFirst({ where: { usuarioId: usuario.id, estado: 'APROBADO', ...producto } })
  return compra ? { ok: true } : { error: 'Solo pueden opinar quienes la compraron', status: 403 }
}
