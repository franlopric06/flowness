import prisma from '../../config/prisma.js'

export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      select: { id: true, nombre: true, email: true, rol: true, creadoEn: true },
    })
    res.json(usuario)
  } catch {
    res.status(500).json({ error: 'Error al obtener perfil' })
  }
}

export const obtenerMisClases = async (req, res) => {
  try {
    const compras = await prisma.compra.findMany({
      where: { usuarioId: req.usuario.id, estado: 'APROBADO' },
      include: { clase: true },
    })
    // Sin duplicados (si compró dos veces la misma) y solo las visibles
    const vistas = new Map()
    compras.forEach(({ clase }) => { if (clase?.activo) vistas.set(clase.id, clase) })
    res.json([...vistas.values()])
  } catch {
    res.status(500).json({ error: 'Error al obtener clases' })
  }
}
