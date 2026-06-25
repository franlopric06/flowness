const prisma = require('../prisma')

const getCursos = async (req, res) => {
  try {
    const cursos = await prisma.curso.findMany({
      where: { activo: true },
      orderBy: { nivel: 'asc' }
    })
    res.json(cursos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cursos' })
  }
}

const getCursoById = async (req, res) => {
  try {
    const { id } = req.params
    const curso = await prisma.curso.findUnique({
      where: { id: parseInt(id) }
    })
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' })
    }
    res.json(curso)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener curso' })
  }
}

module.exports = { getCursos, getCursoById }