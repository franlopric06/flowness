import prisma from '../../config/prisma.js'
import { ESTADOS } from './resenas.comun.js'

// GET /api/admin/resenas?estado=PENDIENTE — lista para moderar + cantidad por estado
export const obtenerResenasAdmin = async (req, res) => {
  const estado = ESTADOS.includes(req.query.estado) ? req.query.estado : undefined
  try {
    const [lista, conteo] = await Promise.all([
      prisma.resena.findMany({
        where: estado ? { estado } : {},
        include: {
          usuario: { select: { nombre: true, email: true } },
          clase: { select: { nombre: true } },
          curso: { select: { nombre: true } },
        },
        orderBy: { creadoEn: 'desc' },
        take: 200,
      }),
      prisma.resena.groupBy({ by: ['estado'], _count: { _all: true } }),
    ])
    const cantidades = Object.fromEntries(ESTADOS.map((e) => [e, 0]))
    conteo.forEach((c) => { cantidades[c.estado] = c._count._all })
    res.json({ resenas: lista, cantidades })
  } catch {
    res.status(500).json({ error: 'Error al obtener las reseñas' })
  }
}

// PUT /api/admin/resenas/:id  body: { estado?, destacada?, respuesta? }
export const moderarResena = async (req, res) => {
  const datos = {}
  if (req.body.estado !== undefined) {
    if (!ESTADOS.includes(req.body.estado)) return res.status(400).json({ error: 'Estado no válido' })
    datos.estado = req.body.estado
    if (datos.estado !== 'APROBADA') datos.destacada = false // solo se destaca lo aprobado
  }
  if (req.body.destacada !== undefined) datos.destacada = Boolean(req.body.destacada)
  if (req.body.respuesta !== undefined) {
    const respuesta = String(req.body.respuesta || '').trim()
    if (respuesta.length > 1000) return res.status(400).json({ error: 'La respuesta es muy larga' })
    datos.respuesta = respuesta || null
  }

  try {
    const actual = await prisma.resena.findUnique({ where: { id: Number(req.params.id) } })
    if (!actual) return res.status(404).json({ error: 'No se encontró la reseña' })
    if (datos.destacada && (datos.estado || actual.estado) !== 'APROBADA') {
      return res.status(400).json({ error: 'Primero aprobá la reseña para destacarla' })
    }
    res.json(await prisma.resena.update({ where: { id: actual.id }, data: datos }))
  } catch (err) {
    console.error('Error al moderar reseña:', err?.message || err)
    res.status(500).json({ error: 'No se pudo guardar el cambio' })
  }
}

// DELETE /api/admin/resenas/:id
export const eliminarResena = async (req, res) => {
  try {
    await prisma.resena.delete({ where: { id: Number(req.params.id) } })
    res.json({ mensaje: 'Reseña eliminada' })
  } catch {
    res.status(500).json({ error: 'No se pudo eliminar la reseña' })
  }
}
