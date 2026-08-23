import prisma from '../config/prisma.js'

export const obtenerFases = async (req, res) => {
  try {
    const fases = await prisma.fase.findMany({
      where: { activo: true },
      orderBy: { numero: 'asc' },
      include: { clases: { where: { activo: true }, orderBy: { orden: 'asc' } } },
    })
    res.json(fases)
  } catch {
    res.status(500).json({ error: 'Error al obtener fases' })
  }
}

export const crearFase = async (req, res) => {
  const { numero, nombre, descripcion, videoUrl } = req.body
  try {
    const fase = await prisma.fase.create({ data: { numero, nombre, descripcion, videoUrl } })
    res.json(fase)
  } catch {
    res.status(500).json({ error: 'Error al crear fase' })
  }
}

export const actualizarFase = async (req, res) => {
  const { id } = req.params
  const { numero, nombre, descripcion, videoUrl, activo } = req.body
  try {
    const fase = await prisma.fase.update({
      where: { id: Number(id) },
      data: { numero, nombre, descripcion, videoUrl, activo },
    })
    res.json(fase)
  } catch {
    res.status(500).json({ error: 'Error al actualizar fase' })
  }
}

export const eliminarFase = async (req, res) => {
  const { id } = req.params
  try {
    await prisma.fase.update({ where: { id: Number(id) }, data: { activo: false } })
    res.json({ mensaje: 'Fase desactivada' })
  } catch {
    res.status(500).json({ error: 'Error al eliminar fase' })
  }
}
