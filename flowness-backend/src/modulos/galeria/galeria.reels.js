import prisma from '../../config/prisma.js'
import { esLinkInstagram, esVideoCloudinary, datosEditables, borrarDeCloudinary, prepararDatos, responderError } from './galeria.comun.js'

// Panel: reels / videos de la galería (crear, editar y borrar)

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
    const datos = await prepararDatos(tipo, url, 'video')
    const ultimo = await prisma.reel.findFirst({ orderBy: { orden: 'desc' } })
    const reel = await prisma.reel.create({
      data: { ...datos, descripcion: req.body.descripcion?.trim() || null, orden: (ultimo?.orden || 0) + 1 },
    })
    res.json(reel)
  } catch (err) {
    responderError(res, err, 'Error al guardar el video')
  }
}

export const actualizarReel = async (req, res) => {
  try {
    const actual = await prisma.reel.findUnique({ where: { id: Number(req.params.id) } })
    if (!actual) return res.status(404).json({ error: 'No se encontró el video' })
    const { datos, error } = datosEditables(req.body, actual)
    if (error) return res.status(400).json({ error })
    res.json(await prisma.reel.update({ where: { id: actual.id }, data: datos }))
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
