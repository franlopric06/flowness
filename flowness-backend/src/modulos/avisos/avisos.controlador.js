import prisma from '../../config/prisma.js'
import { datosDeAviso } from './avisos.validar.js'

// Panel: todos los avisos, también los ocultos y vencidos
export const obtenerAvisos = async (req, res) => {
  try {
    res.json(await prisma.aviso.findMany({ orderBy: { creadoEn: 'desc' } }))
  } catch {
    res.status(500).json({ error: 'Error al obtener avisos' })
  }
}

export const crearAviso = async (req, res) => {
  const { datos, error } = datosDeAviso(req.body)
  if (error) return res.status(400).json({ error })
  try {
    res.json(await prisma.aviso.create({ data: datos }))
  } catch (err) {
    console.error('Error al crear aviso:', err?.message || err)
    res.status(500).json({ error: 'Error al crear aviso' })
  }
}

export const actualizarAviso = async (req, res) => {
  const id = Number(req.params.id)
  try {
    const actual = await prisma.aviso.findUnique({ where: { id } })
    if (!actual) return res.status(404).json({ error: 'No se encontró el aviso' })
    // Se parte de lo que ya tenía, así se puede mandar solo un cambio (por ejemplo "activo")
    const { datos, error } = datosDeAviso({ ...actual, ...req.body })
    if (error) return res.status(400).json({ error })
    res.json(await prisma.aviso.update({ where: { id }, data: datos }))
  } catch (err) {
    console.error('Error al actualizar aviso:', err?.message || err)
    res.status(500).json({ error: 'Error al guardar el aviso' })
  }
}

export const eliminarAviso = async (req, res) => {
  try {
    await prisma.aviso.delete({ where: { id: Number(req.params.id) } })
    res.json({ mensaje: 'Aviso eliminado' })
  } catch {
    res.status(500).json({ error: 'Error al eliminar aviso' })
  }
}
