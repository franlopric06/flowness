import prisma from '../../config/prisma.js'

const POR_PAGINA = 25
const MAXIMO_DESCARGA = 5000
const ESTADOS = ['PENDIENTE', 'APROBADO', 'RECHAZADO']

const contiene = (texto) => ({ contains: texto, mode: 'insensitive' })

// Arma el filtro a partir de la búsqueda: persona (nombre o email), clase o curso, estado y tipo
function filtroDeCompras({ buscar, estado, tipo, usuarioId }) {
  const where = {}
  const texto = String(buscar || '').trim()
  if (texto) {
    where.OR = [
      { usuario: { nombre: contiene(texto) } },
      { usuario: { email: contiene(texto) } },
      { clase: { nombre: contiene(texto) } },
      { curso: { nombre: contiene(texto) } },
      // Un número puede ser el N° de compra o el N° de pago de Mercado Pago
      ...(/^\d+$/.test(texto) ? [{ mpPagoId: texto }, ...(Number(texto) < 2147483647 ? [{ id: Number(texto) }] : [])] : []),
    ]
  }
  if (ESTADOS.includes(estado)) where.estado = estado
  if (tipo === 'clase') where.claseId = { not: null }
  if (tipo === 'curso') where.cursoId = { not: null }
  if (Number(usuarioId)) where.usuarioId = Number(usuarioId)
  return where
}

// GET /api/admin/compras?buscar=&estado=&tipo=&pagina=1   (todas=1 para descargar)
export const obtenerCompras = async (req, res) => {
  const where = filtroDeCompras(req.query)
  const todas = req.query.todas === '1'
  const pagina = Math.max(1, parseInt(req.query.pagina, 10) || 1)
  try {
    const [compras, total] = await Promise.all([
      prisma.compra.findMany({
        where,
        include: {
          usuario: { select: { id: true, nombre: true, email: true } },
          clase: { select: { nombre: true } },
          curso: { select: { nombre: true } },
        },
        orderBy: { creadoEn: 'desc' },
        ...(todas ? { take: MAXIMO_DESCARGA } : { skip: (pagina - 1) * POR_PAGINA, take: POR_PAGINA }),
      }),
      prisma.compra.count({ where }),
    ])
    res.json({ compras, total, pagina, paginas: Math.max(1, Math.ceil(total / POR_PAGINA)) })
  } catch (err) {
    console.error('Error al obtener compras:', err?.message || err)
    res.status(500).json({ error: 'Error al obtener compras' })
  }
}
