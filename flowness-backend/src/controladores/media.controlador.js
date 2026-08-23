import cloudinary from '../config/cloudinary.js'
import prisma from '../config/prisma.js'

export const subirImagen = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64')
    const dataUri = `data:${req.file.mimetype};base64,${b64}`
    const resultado = await cloudinary.uploader.upload(dataUri, { folder: 'flowness/imagenes' })
    res.json({ url: resultado.secure_url })
  } catch {
    res.status(500).json({ error: 'Error al subir imagen' })
  }
}

export const subirVideo = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64')
    const dataUri = `data:${req.file.mimetype};base64,${b64}`
    const resultado = await cloudinary.uploader.upload(dataUri, {
      folder: 'flowness/videos',
      resource_type: 'video',
    })
    res.json({ url: resultado.secure_url })
  } catch {
    res.status(500).json({ error: 'Error al subir video' })
  }
}

export const subirDocumento = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64')
    const dataUri = `data:${req.file.mimetype};base64,${b64}`
    const resultado = await cloudinary.uploader.upload(dataUri, {
      folder: 'flowness/documentos',
      resource_type: 'raw',
    })
    res.json({ url: resultado.secure_url })
  } catch {
    res.status(500).json({ error: 'Error al subir documento' })
  }
}

export const obtenerGaleria = async (req, res) => {
  try {
    const fotos = await prisma.foto.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
    })
    res.json(fotos)
  } catch {
    res.status(500).json({ error: 'Error al obtener galería' })
  }
}
