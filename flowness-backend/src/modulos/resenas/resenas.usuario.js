import prisma from '../../config/prisma.js'
import { leerProducto, puedeOpinar } from './resenas.comun.js'

const LARGO_MAXIMO = 1000

// GET /api/resenas/mia?claseId=1 — la reseña propia (en cualquier estado) y si puede opinar
export const obtenerMia = async (req, res) => {
  const producto = leerProducto(req.query)
  if (!producto) return res.status(400).json({ error: 'Falta indicar la clase o el curso' })
  try {
    const [permiso, resena] = await Promise.all([
      puedeOpinar(req.usuario, producto),
      prisma.resena.findFirst({ where: { usuarioId: req.usuario.id, ...producto } }),
    ])
    res.json({
      puedeOpinar: !!permiso.ok,
      resena: resena && { id: resena.id, estrellas: resena.estrellas, texto: resena.texto, estado: resena.estado, respuesta: resena.respuesta },
    })
  } catch {
    res.status(500).json({ error: 'Error al obtener tu reseña' })
  }
}

// POST /api/resenas  body: { claseId | cursoId, estrellas, texto }
// Crea la reseña o, si ya tenía una, la reemplaza. Vuelve a quedar pendiente de aprobación
// (y sin la respuesta anterior, que era para el comentario viejo).
export const guardarMia = async (req, res) => {
  const producto = leerProducto(req.body)
  if (!producto) return res.status(400).json({ error: 'Falta indicar la clase o el curso' })

  const estrellas = parseInt(req.body.estrellas, 10)
  if (!(estrellas >= 1 && estrellas <= 5)) return res.status(400).json({ error: 'Elegí de 1 a 5 estrellas' })
  const texto = String(req.body.texto || '').trim()
  if (texto.length > LARGO_MAXIMO) return res.status(400).json({ error: `El comentario puede tener hasta ${LARGO_MAXIMO} letras` })

  try {
    const permiso = await puedeOpinar(req.usuario, producto)
    if (!permiso.ok) return res.status(permiso.status).json({ error: permiso.error })

    const datos = { estrellas, texto, estado: 'PENDIENTE', destacada: false, respuesta: null }
    const actual = await prisma.resena.findFirst({ where: { usuarioId: req.usuario.id, ...producto } })
    const resena = actual
      ? await prisma.resena.update({ where: { id: actual.id }, data: datos })
      : await prisma.resena.create({ data: { ...datos, usuarioId: req.usuario.id, ...producto } })

    res.json({ id: resena.id, estrellas: resena.estrellas, texto: resena.texto, estado: resena.estado, respuesta: resena.respuesta })
  } catch (err) {
    console.error('Error al guardar reseña:', err?.message || err)
    res.status(500).json({ error: 'No se pudo guardar tu reseña' })
  }
}
