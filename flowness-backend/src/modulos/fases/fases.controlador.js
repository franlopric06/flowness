import prisma from '../../config/prisma.js'

// Las 6 fases del método: texto explicativo que se muestra en el Inicio.
// Cada clase de Flowness recorre estas fases.

const limpiar = (body) => {
  const datos = {}
  if (body.numero !== undefined) datos.numero = parseInt(body.numero, 10)
  if (body.nombre !== undefined) datos.nombre = String(body.nombre).trim()
  if (body.descripcion !== undefined) datos.descripcion = String(body.descripcion || '').trim()
  if (body.videoUrl !== undefined) datos.videoUrl = body.videoUrl ? String(body.videoUrl).trim() : null
  if (body.activo !== undefined) datos.activo = Boolean(body.activo)
  return datos
}

export const obtenerFases = async (req, res) => {
  try {
    const fases = await prisma.fase.findMany({
      where: { activo: true },
      orderBy: { numero: 'asc' },
    })
    res.json(fases)
  } catch {
    res.status(500).json({ error: 'Error al obtener fases' })
  }
}

// Si ya existía una fase con ese número (por ejemplo, una eliminada), la reemplaza
export const crearFase = async (req, res) => {
  const datos = limpiar(req.body)
  if (!(datos.numero >= 1)) return res.status(400).json({ error: 'Poné el número de la fase (1 a 6)' })
  if (!datos.nombre) return res.status(400).json({ error: 'Poné el nombre de la fase' })
  try {
    const fase = await prisma.fase.upsert({
      where: { numero: datos.numero },
      update: { ...datos, activo: true },
      create: { descripcion: '', ...datos },
    })
    res.json(fase)
  } catch {
    res.status(500).json({ error: 'Error al crear fase' })
  }
}

export const actualizarFase = async (req, res) => {
  const datos = limpiar(req.body)
  if (datos.numero !== undefined && !(datos.numero >= 1)) return res.status(400).json({ error: 'Número de fase inválido' })
  if (datos.nombre === '') return res.status(400).json({ error: 'Poné el nombre de la fase' })
  try {
    const fase = await prisma.fase.update({ where: { id: Number(req.params.id) }, data: datos })
    res.json(fase)
  } catch (err) {
    const repetido = err?.code === 'P2002'
    res.status(repetido ? 400 : 500).json({ error: repetido ? 'Ya hay otra fase con ese número' : 'Error al actualizar fase' })
  }
}

export const eliminarFase = async (req, res) => {
  try {
    await prisma.fase.update({ where: { id: Number(req.params.id) }, data: { activo: false } })
    res.json({ mensaje: 'Fase eliminada' })
  } catch {
    res.status(500).json({ error: 'Error al eliminar fase' })
  }
}
