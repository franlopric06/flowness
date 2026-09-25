import prisma from '../../config/prisma.js'

// ─────────────────────────────────────────────
// Reglas de acceso a una clase:
// - Admin: ve todo.
// - Clase gratis: la ve cualquier usuario registrado.
// - Clase paga: solo quien tiene una compra APROBADA.
// El link del video (videoUrl) SOLO se envía a quien tiene acceso.
// ─────────────────────────────────────────────

const obtenerIdsComprados = async (usuarioId) => {
  if (!usuarioId) return new Set()
  const compras = await prisma.compra.findMany({
    where: { usuarioId, estado: 'APROBADO' },
    select: { claseId: true },
  })
  return new Set(compras.map((c) => c.claseId))
}

const prepararParaUsuario = (clase, usuario, idsComprados) => {
  const esAdmin = usuario?.rol === 'ADMIN'
  const comprada = idsComprados.has(clase.id)
  const tieneAcceso = esAdmin || comprada || (clase.esGratis && !!usuario)

  const { videoUrl, faseId, documentos, ...publica } = clase
  return {
    ...publica,
    comprada,
    tieneAcceso,
    ...(tieneAcceso ? { videoUrl } : {}),
  }
}

// Convierte lo que llega del formulario del panel en datos válidos para la base
const limpiarDatos = (body) => {
  const datos = {}
  if (body.nombre !== undefined) datos.nombre = String(body.nombre).trim()
  if (body.descripcion !== undefined) datos.descripcion = String(body.descripcion).trim()
  if (body.videoUrl !== undefined) datos.videoUrl = body.videoUrl ? String(body.videoUrl).trim() : null
  if (body.miniaturaUrl !== undefined) datos.miniaturaUrl = body.miniaturaUrl ? String(body.miniaturaUrl).trim() : null
  if (body.muestraUrl !== undefined) datos.muestraUrl = body.muestraUrl ? String(body.muestraUrl).trim() : null
  if (body.duracion !== undefined) datos.duracion = body.duracion ? String(body.duracion).trim() : null
  if (body.esGratis !== undefined) datos.esGratis = Boolean(body.esGratis)
  if (body.precio !== undefined) datos.precio = Number(body.precio) || 0
  if (body.orden !== undefined) datos.orden = parseInt(body.orden, 10) || 0
  if (body.activo !== undefined) datos.activo = Boolean(body.activo)
  if (datos.esGratis) datos.precio = 0
  return datos
}

// GET /api/clases — catálogo público (con o sin sesión)
export const obtenerClases = async (req, res) => {
  try {
    const clases = await prisma.clase.findMany({
      where: { activo: true },
      orderBy: [{ orden: 'asc' }, { creadoEn: 'asc' }],
    })
    const idsComprados = await obtenerIdsComprados(req.usuario?.id)
    res.json(clases.map((c) => prepararParaUsuario(c, req.usuario, idsComprados)))
  } catch {
    res.status(500).json({ error: 'Error al obtener clases' })
  }
}

// GET /api/clases/:id — una clase (con o sin sesión)
export const obtenerClasePorId = async (req, res) => {
  try {
    const clase = await prisma.clase.findUnique({ where: { id: Number(req.params.id) } })
    if (!clase || (!clase.activo && req.usuario?.rol !== 'ADMIN')) {
      return res.status(404).json({ error: 'Clase no encontrada' })
    }
    const idsComprados = await obtenerIdsComprados(req.usuario?.id)
    res.json(prepararParaUsuario(clase, req.usuario, idsComprados))
  } catch {
    res.status(500).json({ error: 'Error al obtener clase' })
  }
}

// GET /api/clases/admin/todas — panel: todas las clases, incluso ocultas, con su video
export const obtenerClasesAdmin = async (req, res) => {
  try {
    const clases = await prisma.clase.findMany({
      orderBy: [{ orden: 'asc' }, { creadoEn: 'asc' }],
      include: { _count: { select: { compras: { where: { estado: 'APROBADO' } } } } },
    })
    res.json(clases.map(({ _count, ...c }) => ({ ...c, ventas: _count.compras })))
  } catch {
    res.status(500).json({ error: 'Error al obtener clases' })
  }
}

export const crearClase = async (req, res) => {
  const datos = limpiarDatos(req.body)
  if (!datos.nombre) return res.status(400).json({ error: 'La clase necesita un nombre' })
  if (!datos.esGratis && !(datos.precio > 0)) {
    return res.status(400).json({ error: 'Poné un precio o marcala como gratis' })
  }
  try {
    const clase = await prisma.clase.create({ data: { descripcion: '', ...datos } })
    res.json(clase)
  } catch {
    res.status(500).json({ error: 'Error al crear clase' })
  }
}

export const actualizarClase = async (req, res) => {
  const datos = limpiarDatos(req.body)
  if (datos.nombre === '') return res.status(400).json({ error: 'La clase necesita un nombre' })
  try {
    const clase = await prisma.clase.update({ where: { id: Number(req.params.id) }, data: datos })
    res.json(clase)
  } catch {
    res.status(500).json({ error: 'Error al actualizar clase' })
  }
}

// No se borra de verdad: se oculta, para no perder las compras asociadas
export const eliminarClase = async (req, res) => {
  try {
    await prisma.clase.update({ where: { id: Number(req.params.id) }, data: { activo: false } })
    res.json({ mensaje: 'Clase ocultada' })
  } catch {
    res.status(500).json({ error: 'Error al eliminar clase' })
  }
}
