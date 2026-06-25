const prisma = require('../prisma')

const getClases = async (req, res) => {
  try {
    const clases = await prisma.clase.findMany({
      where: { activo: true },
      include: { horarios: true },
      orderBy: { fase: 'asc' }
    })
    res.json(clases)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clases' })
  }
}

const getClaseById = async (req, res) => {
  try {
    const { id } = req.params
    const clase = await prisma.clase.findUnique({
      where: { id: parseInt(id) },
      include: { horarios: true }
    })
    if (!clase) {
      return res.status(404).json({ error: 'Clase no encontrada' })
    }
    res.json(clase)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clase' })
  }
}

module.exports = { getClases, getClaseById }