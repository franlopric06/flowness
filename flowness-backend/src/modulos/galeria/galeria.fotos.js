import prisma from '../../config/prisma.js'
import { esLinkInstagram, esImagenCloudinary, datosEditables, borrarDeCloudinary, prepararDatos, responderError } from './galeria.comun.js'

// Panel: fotos de la galería (crear, editar y borrar)

// POST /api/galeria/fotos — imagen ya subida a Cloudinary o link de Instagram
export const crearFoto = async (req, res) => {
  const tipo = req.body.tipo === 'INSTAGRAM' ? 'INSTAGRAM' : 'ARCHIVO'
  const url = String(req.body.url || '').trim()
  if (tipo === 'ARCHIVO' && !esImagenCloudinary(url)) return res.status(400).json({ error: 'Falta subir la imagen' })
  if (tipo === 'INSTAGRAM' && !esLinkInstagram(url)) return res.status(400).json({ error: 'El link no es de una publicación de Instagram' })
  try {
    const datos = await prepararDatos(tipo, url, 'foto')
    const ultima = await prisma.foto.findFirst({ orderBy: { orden: 'desc' } })
    const foto = await prisma.foto.create({
      data: { ...datos, descripcion: req.body.descripcion?.trim() || null, orden: (ultima?.orden || 0) + 1 },
    })
    res.json(foto)
  } catch (err) {
    responderError(res, err, 'Error al guardar la foto')
  }
}

export const actualizarFoto = async (req, res) => {
  try {
    const actual = await prisma.foto.findUnique({ where: { id: Number(req.params.id) } })
    if (!actual) return res.status(404).json({ error: 'No se encontró la foto' })
    const { datos, error } = datosEditables(req.body, actual)
    if (error) return res.status(400).json({ error })
    res.json(await prisma.foto.update({ where: { id: actual.id }, data: datos }))
  } catch {
    res.status(500).json({ error: 'Error al guardar la foto' })
  }
}

export const eliminarFoto = async (req, res) => {
  try {
    const foto = await prisma.foto.delete({ where: { id: Number(req.params.id) } })
    if (foto.tipo !== 'INSTAGRAM') await borrarDeCloudinary(foto.url)
    res.json({ mensaje: 'Foto eliminada' })
  } catch {
    res.status(500).json({ error: 'Error al eliminar la foto' })
  }
}

