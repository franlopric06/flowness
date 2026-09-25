import prisma from '../../config/prisma.js'

// ─────────────────────────────────────────────
// Reglas de acceso a un curso:
// - Admin: ve todo.
// - Quien tiene una compra APROBADA del curso: ve todas las lecciones
//   publicadas, incluidas las que se suban después.
// - El resto ve la info del curso y el temario (títulos), sin videos ni PDFs.
// ─────────────────────────────────────────────

const ordenLecciones = [{ orden: 'asc' }, { creadoEn: 'asc' }]

const obtenerIdsCursosComprados = async (usuarioId) => {
  if (!usuarioId) return new Set()
  const compras = await prisma.compra.findMany({
    where: { usuarioId, estado: 'APROBADO', cursoId: { not: null } },
    select: { cursoId: true },
  })
  return new Set(compras.map((c) => c.cursoId))
}

const prepararCurso = (curso, usuario, idsComprados, { conLecciones = false } = {}) => {
  const comprado = idsComprados.has(curso.id)
  const tieneAcceso = usuario?.rol === 'ADMIN' || comprado
  const lecciones = curso.lecciones || []
  const { lecciones: _omitidas, ...datos } = curso

  const resultado = {
    ...datos,
    comprado,
    tieneAcceso,
    leccionesPublicadas: lecciones.length,
    disponibleParaComprar: curso.precio > 0,
  }

  if (conLecciones) {
    resultado.lecciones = lecciones.map(({ videoUrl, pdfUrl, ...leccion }) => ({
      ...leccion,
      tienePdf: !!pdfUrl,
      ...(tieneAcceso ? { videoUrl, pdfUrl } : {}),
    }))
  }
  return resultado
}

const limpiarCurso = (body) => {
  const datos = {}
  const texto = (v) => (v === undefined ? undefined : v ? String(v).trim() : null)
  for (const campo of ['subtitulo', 'dirigidoA', 'duracion', 'portadaUrl']) {
    if (body[campo] !== undefined) datos[campo] = texto(body[campo])
  }
  if (body.nombre !== undefined) datos.nombre = String(body.nombre).trim()
  if (body.descripcion !== undefined) datos.descripcion = String(body.descripcion || '').trim()
  if (body.totalVideos !== undefined) datos.totalVideos = body.totalVideos === '' || body.totalVideos === null ? null : parseInt(body.totalVideos, 10) || null
  if (body.precio !== undefined) datos.precio = Number(body.precio) || 0
  if (body.orden !== undefined) datos.orden = parseInt(body.orden, 10) || 0
  if (body.activo !== undefined) datos.activo = Boolean(body.activo)
  return datos
}

const limpiarLeccion = (body) => {
  const datos = {}
  const texto = (v) => (v === undefined ? undefined : v ? String(v).trim() : null)
  for (const campo of ['descripcion', 'videoUrl', 'pdfUrl']) {
    if (body[campo] !== undefined) datos[campo] = texto(body[campo])
  }
  if (body.titulo !== undefined) datos.titulo = String(body.titulo).trim()
  if (body.orden !== undefined) datos.orden = parseInt(body.orden, 10) || 0
  if (body.activo !== undefined) datos.activo = Boolean(body.activo)
  return datos
}

// ── Público ─────────────────────────────────

// GET /api/cursos — los niveles publicados
export const obtenerCursos = async (req, res) => {
  try {
    const cursos = await prisma.curso.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
      include: { lecciones: { where: { activo: true }, select: { id: true } } },
    })
    const ids = await obtenerIdsCursosComprados(req.usuario?.id)
    res.json(cursos.map((c) => prepararCurso(c, req.usuario, ids)))
  } catch {
    res.status(500).json({ error: 'Error al obtener la formación' })
  }
}

// GET /api/cursos/:slug — detalle + temario (y videos/PDF si tiene acceso)
export const obtenerCurso = async (req, res) => {
  try {
    const curso = await prisma.curso.findUnique({
      where: { slug: req.params.slug },
      include: { lecciones: { where: { activo: true }, orderBy: ordenLecciones } },
    })
    if (!curso || (!curso.activo && req.usuario?.rol !== 'ADMIN')) {
      return res.status(404).json({ error: 'Curso no encontrado' })
    }
    const ids = await obtenerIdsCursosComprados(req.usuario?.id)
    res.json(prepararCurso(curso, req.usuario, ids, { conLecciones: true }))
  } catch {
    res.status(500).json({ error: 'Error al obtener el curso' })
  }
}

// ── Panel ───────────────────────────────────

// GET /api/cursos/admin/todos — todos los cursos con todas sus lecciones
export const obtenerCursosAdmin = async (req, res) => {
  try {
    const cursos = await prisma.curso.findMany({
      orderBy: { orden: 'asc' },
      include: {
        lecciones: { orderBy: ordenLecciones },
        _count: { select: { compras: { where: { estado: 'APROBADO' } } } },
      },
    })
    res.json(cursos.map(({ _count, ...c }) => ({ ...c, ventas: _count.compras })))
  } catch {
    res.status(500).json({ error: 'Error al obtener la formación' })
  }
}

export const actualizarCurso = async (req, res) => {
  const datos = limpiarCurso(req.body)
  if (datos.nombre === '') return res.status(400).json({ error: 'El curso necesita un nombre' })
  try {
    const curso = await prisma.curso.update({ where: { id: Number(req.params.id) }, data: datos })
    res.json(curso)
  } catch {
    res.status(500).json({ error: 'Error al guardar el curso' })
  }
}

export const crearLeccion = async (req, res) => {
  const datos = limpiarLeccion(req.body)
  if (!datos.titulo) return res.status(400).json({ error: 'La lección necesita un título' })
  try {
    const cursoId = Number(req.params.id)
    if (datos.orden === undefined) {
      datos.orden = (await prisma.leccion.count({ where: { cursoId } })) + 1
    }
    const leccion = await prisma.leccion.create({ data: { ...datos, cursoId } })
    res.json(leccion)
  } catch {
    res.status(500).json({ error: 'Error al crear la lección' })
  }
}

export const actualizarLeccion = async (req, res) => {
  const datos = limpiarLeccion(req.body)
  if (datos.titulo === '') return res.status(400).json({ error: 'La lección necesita un título' })
  try {
    const leccion = await prisma.leccion.update({ where: { id: Number(req.params.leccionId) }, data: datos })
    res.json(leccion)
  } catch {
    res.status(500).json({ error: 'Error al guardar la lección' })
  }
}
