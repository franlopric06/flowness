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

const getClases = async (req, res) => {
  try {
    const clases = await prisma.clase.findMany({
      include: { horarios: true },
      orderBy: { fase: 'asc' }
    })
    res.json(clases)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clases' })
  }
}

const actualizarClase = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, descripcion, precio_vivo, precio_grabada, duracion, activo } = req.body
    const clase = await prisma.clase.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        descripcion,
        precio_vivo: parseFloat(precio_vivo),
        precio_grabada: parseFloat(precio_grabada),
        duracion,
        activo
      }
    })
    res.json(clase)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar clase' })
  }
}

module.exports = { getCursos, crearCurso, actualizarCurso, eliminarCurso, getClases, actualizarClase }