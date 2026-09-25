import prisma from '../../config/prisma.js'

export const obtenerAvisos = async (req, res) => {
  try {
    const avisos = await prisma.aviso.findMany({ orderBy: { creadoEn: 'desc' } })
    res.json(avisos)
  } catch {
    res.status(500).json({ error: 'Error al obtener avisos' })
  }
}

export const crearAviso = async (req, res) => {
  const { titulo, descripcion } = req.body
  try {
    const aviso = await prisma.aviso.create({ data: { titulo, descripcion } })
    res.json(aviso)
  } catch {
    res.status(500).json({ error: 'Error al crear aviso' })
  }
}

export const eliminarAviso = async (req, res) => {
  const { id } = req.params
  try {
    await prisma.aviso.update({ where: { id: Number(id) }, data: { activo: false } })
    res.json({ mensaje: 'Aviso eliminado' })
  } catch {
    res.status(500).json({ error: 'Error al eliminar aviso' })
  }
}
