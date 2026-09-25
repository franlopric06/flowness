import prisma from '../../config/prisma.js'
import cloudinary from '../../config/cloudinary.js'

const orden = [{ orden: 'asc' }, { creadoEn: 'asc' }]

// Acepta links de reels o publicaciones de Instagram:
// instagram.com/reel/CODIGO · /reels/CODIGO · /p/CODIGO · /tv/CODIGO
const esLinkInstagram = (url = '') =>
  /^https?:\/\/(www\.)?instagram\.com\/(reel|reels|p|tv)\/[\w-]+/i.test(String(url).trim())

const esVideoCloudinary = (url = '') => /^https:\/\/res\.cloudinary\.com\/.+\/video\/upload\//i.test(String(url).trim())

// Borra el archivo de Cloudinary para no ocupar espacio (si falla, no bloquea)
const borrarDeCloudinary = async (url, tipoRecurso = 'image') => {
  const coincidencia = String(url).match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i)
  if (!coincidencia) return
  try {
    await cloudinary.uploader.destroy(coincidencia[1], { resource_type: tipoRecurso })
  } catch (err) {
    console.error('No se pudo borrar de Cloudinary:', err?.message || err)
  }
}

// ── Público ─────────────────────────────────

// GET /api/galeria — fotos y reels visibles
export const obtenerGaleria = async (req, res) => {
  try {
    const [fotos, reels] = await Promise.all([
      prisma.foto.findMany({ where: { activo: true }, orderBy: orden }),
      prisma.reel.findMany({ where: { activo: true }, orderBy: orden }),
    ])
    res.json({ fotos, reels })
  } catch {
    res.status(500).json({ error: 'Error al obtener la galería' })
  }
}

// ── Panel: fotos ────────────────────────────

// POST /api/galeria/fotos — la imagen ya se subió con /api/media/imagen
export const crearFoto = async (req, res) => {
  const url = String(req.body.url || '').trim()
  if (!url) return res.status(400).json({ error: 'Falta la imagen' })
  try {
    const ultima = await prisma.foto.findFirst({ orderBy: { orden: 'desc' } })
    const foto = await prisma.foto.create({
      data: { url, descripcion: req.body.descripcion?.trim() || null, orden: (ultima?.orden || 0) + 1 },
    })
    res.json(foto)
  } catch {
    res.status(500).json({ error: 'Error al guardar la foto' })
  }
}

export const actualizarFoto = async (req, res) => {
  const datos = {}
  if (req.body.descripcion !== undefined) datos.descripcion = req.body.descripcion?.trim() || null
  if (req.body.orden !== undefined) datos.orden = parseInt(req.body.orden, 10) || 0
  if (req.body.activo !== undefined) datos.activo = Boolean(req.body.activo)
  try {
    res.json(await prisma.foto.update({ where: { id: Number(req.params.id) }, data: datos }))
  } catch {
    res.status(500).json({ error: 'Error al guardar la foto' })
  }
}

export const eliminarFoto = async (req, res) => {
  try {
    const foto = await prisma.foto.delete({ where: { id: Number(req.params.id) } })
    await borrarDeCloudinary(foto.url)
    res.json({ mensaje: 'Foto eliminada' })
  } catch {
    res.status(500).json({ error: 'Error al eliminar la foto' })
  }
}

// ── Panel: reels ────────────────────────────

// Valida el reel según de dónde viene
const validarReel = (tipo, url) => {
  if (tipo === 'ARCHIVO') return esVideoCloudinary(url) ? null : 'Falta subir el video'
  return esLinkInstagram(url) ? null : 'El link no es de un reel de Instagram'
}

export const crearReel = async (req, res) => {
  const tipo = req.body.tipo === 'ARCHIVO' ? 'ARCHIVO' : 'INSTAGRAM'
  const url = String(req.body.url || '').trim()
  const error = validarReel(tipo, url)
  if (error) return res.status(400).json({ error })
  try {
    const ultimo = await prisma.reel.findFirst({ orderBy: { orden: 'desc' } })
    const reel = await prisma.reel.create({
      data: { tipo, url, descripcion: req.body.descripcion?.trim() || null, orden: (ultimo?.orden || 0) + 1 },
    })
    res.json(reel)
  } catch {
    res.status(500).json({ error: 'Error al guardar el reel' })
  }
}

export const actualizarReel = async (req, res) => {
  const datos = {}
  if (req.body.descripcion !== undefined) datos.descripcion = req.body.descripcion?.trim() || null
  if (req.body.orden !== undefined) datos.orden = parseInt(req.body.orden, 10) || 0
  if (req.body.activo !== undefined) datos.activo = Boolean(req.body.activo)
  try {
    res.json(await prisma.reel.update({ where: { id: Number(req.params.id) }, data: datos }))
  } catch {
    res.status(500).json({ error: 'Error al guardar el reel' })
  }
}

export const eliminarReel = async (req, res) => {
  try {
    const reel = await prisma.reel.delete({ where: { id: Number(req.params.id) } })
    if (reel.tipo === 'ARCHIVO') await borrarDeCloudinary(reel.url, 'video')
    res.json({ mensaje: 'Reel eliminado' })
  } catch {
    res.status(500).json({ error: 'Error al eliminar el reel' })
  }
}

// ── Panel: todo, incluso lo oculto ──────────

export const obtenerGaleriaAdmin = async (req, res) => {
  try {
    const [fotos, reels] = await Promise.all([
      prisma.foto.findMany({ orderBy: orden }),
      prisma.reel.findMany({ orderBy: orden }),
    ])
    res.json({ fotos, reels })
  } catch {
    res.status(500).json({ error: 'Error al obtener la galería' })
  }
}
