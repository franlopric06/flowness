const { cloudinary } = require('../config/cloudinary')
const prisma = require('../prisma')

const subirFoto = async (req, res) => {
  try {
    const { descripcion, fase, nivel } = req.body
    const archivo = req.file

    if (!archivo) return res.status(400).json({ error: 'No se subió ningún archivo' })

    const resultado = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'flowness/fotos', resource_type: 'image' },
        (error, result) => error ? reject(error) : resolve(result)
      ).end(archivo.buffer)
    })

    const foto = await prisma.foto.create({
      data: {
        url: resultado.secure_url,
        descripcion,
        fase,
        nivel
      }
    })

    res.status(201).json(foto)
  } catch (error) {
    res.status(500).json({ error: 'Error al subir foto' })
  }
}

const getFotos = async (req, res) => {
  try {
    const fotos = await prisma.foto.findMany({
      where: { activo: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(fotos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener fotos' })
  }
}

const eliminarFoto = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.foto.update({
      where: { id: parseInt(id) },
      data: { activo: false }
    })
    res.json({ mensaje: 'Foto eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar foto' })
  }
}

const subirVideo = async (req, res) => {
  try {
    const { titulo, descripcion, fase, nivel, duracion } = req.body
    const archivo = req.file

    if (!archivo) return res.status(400).json({ error: 'No se subió ningún archivo' })

    const resultado = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'flowness/videos', resource_type: 'video' },
        (error, result) => error ? reject(error) : resolve(result)
      ).end(archivo.buffer)
    })

    const video = await prisma.videoMuestra.create({
      data: {
        url: resultado.secure_url,
        titulo,
        descripcion,
        fase,
        nivel,
        duracion
      }
    })

    res.status(201).json(video)
  } catch (error) {
    res.status(500).json({ error: 'Error al subir video' })
  }
}

const getVideos = async (req, res) => {
  try {
    const videos = await prisma.videoMuestra.findMany({
      where: { activo: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(videos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener videos' })
  }
}

const eliminarVideo = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.videoMuestra.update({
      where: { id: parseInt(id) },
      data: { activo: false }
    })
    res.json({ mensaje: 'Video eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar video' })
  }
}

module.exports = { subirFoto, getFotos, eliminarFoto, subirVideo, getVideos, eliminarVideo }