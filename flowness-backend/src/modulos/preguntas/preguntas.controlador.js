import prisma from '../../config/prisma.js'
import { datosDePregunta } from './preguntas.validar.js'

const orden = [{ orden: 'asc' }, { creadoEn: 'asc' }]

// GET /api/preguntas — las visibles, para el asistente y la página de Contacto
export const obtenerPreguntas = async (req, res) => {
  try {
    res.json(await prisma.preguntaFrecuente.findMany({
      where: { activo: true }, orderBy: orden,
      select: { id: true, pregunta: true, respuesta: true, palabrasClave: true },
    }))
  } catch {
    res.status(500).json({ error: 'Error al obtener las preguntas' })
  }
}

// Panel: todas, también las ocultas
export const obtenerPreguntasAdmin = async (req, res) => {
  try {
    res.json(await prisma.preguntaFrecuente.findMany({ orderBy: orden }))
  } catch {
    res.status(500).json({ error: 'Error al obtener las preguntas' })
  }
}

export const crearPregunta = async (req, res) => {
  const { datos, error } = datosDePregunta(req.body)
  if (error) return res.status(400).json({ error })
  try {
    const ultima = await prisma.preguntaFrecuente.findFirst({ orderBy: { orden: 'desc' } })
    res.json(await prisma.preguntaFrecuente.create({ data: { orden: (ultima?.orden || 0) + 1, ...datos } }))
  } catch {
    res.status(500).json({ error: 'Error al guardar la pregunta' })
  }
}

export const actualizarPregunta = async (req, res) => {
  const id = Number(req.params.id)
  try {
    const actual = await prisma.preguntaFrecuente.findUnique({ where: { id } })
    if (!actual) return res.status(404).json({ error: 'No se encontró la pregunta' })
    // Se parte de lo que tenía, así se puede mandar un solo cambio (por ejemplo "activo" u "orden")
    const { datos, error } = datosDePregunta({ ...actual, ...req.body })
    if (error) return res.status(400).json({ error })
    res.json(await prisma.preguntaFrecuente.update({ where: { id }, data: datos }))
  } catch {
    res.status(500).json({ error: 'Error al guardar la pregunta' })
  }
}

export const eliminarPregunta = async (req, res) => {
  try {
    await prisma.preguntaFrecuente.delete({ where: { id: Number(req.params.id) } })
    res.json({ mensaje: 'Pregunta eliminada' })
  } catch {
    res.status(500).json({ error: 'Error al eliminar la pregunta' })
  }
}
