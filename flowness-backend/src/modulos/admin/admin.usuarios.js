import prisma from '../../config/prisma.js'

const contiene = (texto) => ({ contains: texto, mode: 'insensitive' })

// Suma lo que compró cada persona (solo lo aprobado cuenta como gastado)
const conTotales = ({ compras, ...usuario }) => {
  const aprobadas = compras.filter((c) => c.estado === 'APROBADO')
  return {
    ...usuario,
    comprasAprobadas: aprobadas.length,
    totalGastado: aprobadas.reduce((s, c) => s + c.monto, 0),
    ultimaCompra: aprobadas[0]?.creadoEn || null,
  }
}

// GET /api/admin/usuarios?buscar=ana&compradores=1
export const obtenerUsuarios = async (req, res) => {
  const texto = String(req.query.buscar || '').trim()
  try {
    const usuarios = await prisma.usuario.findMany({
      where: texto ? { OR: [{ nombre: contiene(texto) }, { email: contiene(texto) }] } : {},
      select: {
        id: true, nombre: true, email: true, rol: true, activo: true, creadoEn: true,
        compras: { select: { estado: true, monto: true, creadoEn: true }, orderBy: { creadoEn: 'desc' } },
      },
      orderBy: { creadoEn: 'desc' },
      take: 500,
    })
    let lista = usuarios.map(conTotales)
    if (req.query.compradores === '1') lista = lista.filter((u) => u.comprasAprobadas > 0)
    res.json(lista)
  } catch (err) {
    console.error('Error al obtener usuarios:', err?.message || err)
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
}

// GET /api/admin/usuarios/:id — una persona con todas sus compras y sus reseñas
export const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true, nombre: true, email: true, rol: true, activo: true, creadoEn: true,
        compras: {
          include: { clase: { select: { nombre: true } }, curso: { select: { nombre: true } } },
          orderBy: { creadoEn: 'desc' },
        },
        resenas: {
          select: { id: true, estrellas: true, estado: true, clase: { select: { nombre: true } }, curso: { select: { nombre: true } } },
          orderBy: { creadoEn: 'desc' },
        },
      },
    })
    if (!usuario) return res.status(404).json({ error: 'No se encontró la persona' })
    res.json({ ...conTotales({ ...usuario, compras: usuario.compras }), compras: usuario.compras })
  } catch (err) {
    console.error('Error al obtener usuario:', err?.message || err)
    res.status(500).json({ error: 'Error al obtener la persona' })
  }
}
