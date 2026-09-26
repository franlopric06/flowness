import prisma from '../../config/prisma.js'
import { leerProducto, resenaPublica } from './resenas.comun.js'

const conNombres = { usuario: { select: { nombre: true } } }

// GET /api/resenas?claseId=1  o  ?cursoId=2 — reseñas aprobadas y su promedio
export const obtenerResenas = async (req, res) => {
  const producto = leerProducto(req.query)
  if (!producto) return res.status(400).json({ error: 'Falta indicar la clase o el curso' })
  try {
    const where = { ...producto, estado: 'APROBADA' }
    const [lista, resumen] = await Promise.all([
      prisma.resena.findMany({ where, include: conNombres, orderBy: [{ destacada: 'desc' }, { creadoEn: 'desc' }], take: 50 }),
      prisma.resena.aggregate({ where, _avg: { estrellas: true }, _count: true }),
    ])
    res.json({
      promedio: resumen._avg.estrellas ? Math.round(resumen._avg.estrellas * 10) / 10 : null,
      cantidad: resumen._count,
      resenas: lista.map(resenaPublica),
    })
  } catch {
    res.status(500).json({ error: 'Error al obtener las reseñas' })
  }
}

// GET /api/resenas/resumen — promedio y cantidad de cada clase y curso (para las tarjetas)
export const obtenerResumen = async (req, res) => {
  try {
    const agrupar = (campo) => prisma.resena.groupBy({
      by: [campo], where: { estado: 'APROBADA', [campo]: { not: null } },
      _avg: { estrellas: true }, _count: { _all: true },
    })
    const [clases, cursos] = await Promise.all([agrupar('claseId'), agrupar('cursoId')])
    const armar = (filas, campo) => Object.fromEntries(filas.map((f) => [
      f[campo], { promedio: Math.round(f._avg.estrellas * 10) / 10, cantidad: f._count._all },
    ]))
    res.json({ clases: armar(clases, 'claseId'), cursos: armar(cursos, 'cursoId') })
  } catch {
    res.status(500).json({ error: 'Error al obtener el resumen de reseñas' })
  }
}

// GET /api/resenas/destacadas — las que Florencia eligió para el Inicio
export const obtenerDestacadas = async (req, res) => {
  try {
    const lista = await prisma.resena.findMany({
      where: { estado: 'APROBADA', destacada: true },
      include: { ...conNombres, clase: { select: { nombre: true } }, curso: { select: { nombre: true } } },
      orderBy: { creadoEn: 'desc' },
      take: 9,
    })
    res.json(lista.map(resenaPublica))
  } catch {
    res.status(500).json({ error: 'Error al obtener los testimonios' })
  }
}
