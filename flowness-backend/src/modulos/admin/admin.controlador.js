import prisma from '../../config/prisma.js'

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: { id: true, nombre: true, email: true, rol: true, activo: true, creadoEn: true },
      orderBy: { creadoEn: 'desc' },
    })
    res.json(usuarios)
  } catch {
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
}

export const obtenerCompras = async (req, res) => {
  try {
    const compras = await prisma.compra.findMany({
      include: {
        usuario: { select: { nombre: true, email: true } },
        clase: { select: { nombre: true } },
        curso: { select: { nombre: true } },
      },
      orderBy: { creadoEn: 'desc' },
    })
    res.json(compras)
  } catch {
    res.status(500).json({ error: 'Error al obtener compras' })
  }
}
