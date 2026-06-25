const prisma = require('../prisma')

const getCursos = async (req, res) => {
  try {
    const cursos = await prisma.curso.findMany({
      orderBy: { nivel: 'asc' }
    })
    res.json(cursos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cursos' })
  }
}

const crearCurso = async (req, res) => {
  try {
    const { nivel, nombre, descripcion, precio, duracion, videos } = req.body
    const curso = await prisma.curso.create({
      data: { nivel, nombre, descripcion, precio: parseFloat(precio), duracion, videos: parseInt(videos) }
    })
    res.status(201).json(curso)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear curso' })
  }
}

const actualizarCurso = async (req, res) => {
  try {
    const { id } = req.params
    const { nivel, nombre, descripcion, precio, duracion, videos, activo } = req.body
    const curso = await prisma.curso.update({
      where: { id: parseInt(id) },
      data: { nivel, nombre, descripcion, precio: parseFloat(precio), duracion, videos: parseInt(videos), activo }
    })
    res.json(curso)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar curso' })
  }
}

const eliminarCurso = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.curso.update({
      where: { id: parseInt(id) },
      data: { activo: false }
    })
    res.json({ mensaje: 'Curso desactivado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar curso' })
  }
}

module.exports = { getCursos, crearCurso, actualizarCurso, eliminarCurso }