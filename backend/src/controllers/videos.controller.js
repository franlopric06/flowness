const { cloudinary } = require('../config/cloudinary')
const prisma = require('../prisma')

const subirVideo = async (req, res) => {
  try {
    const { cursoId, titulo, descripcion, orden } = req.body
    const archivo = req.file

    if (!archivo) return res.status(400).json({ error: 'No se subió ningún archivo' })

    // Verificar que el curso existe
    const curso = await prisma.curso.findUnique({
      where: { id: parseInt(cursoId) }
    })

    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })

    // Subir a Cloudinary como video privado
    const resultado = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `flowness/cursos/${cursoId}`,
          resource_type: 'video',
          type: 'authenticated'
        },
        (error, result) => error ? reject(error) : resolve(result)
      ).end(archivo.buffer)
    })

    const video = await prisma.video.create({
      data: {
        cursoId: parseInt(cursoId),
        titulo,
        descripcion,
        url: resultado.secure_url,
        orden: parseInt(orden) || 0
      }
    })

    res.status(201).json(video)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al subir video' })
  }
}

const getVideosCurso = async (req, res) => {
  try {
    const { cursoId } = req.params
    const usuarioId = req.usuario.id

    // Verificar si el usuario compró el curso
    const compra = await prisma.compra.findFirst({
      where: {
        usuarioId,
        cursoId: parseInt(cursoId),
        estado: 'aprobado'
      }
    })

    if (!compra) {
      return res.status(403).json({ error: 'No tenés acceso a este curso' })
    }

    // Obtener videos del curso
    const videos = await prisma.video.findMany({
      where: {
        cursoId: parseInt(cursoId),
        activo: true
      },
      orderBy: { orden: 'asc' }
    })

    // Generar URLs firmadas para cada video
    const videosConAcceso = videos.map(video => {
      const urlFirmada = cloudinary.url(
        video.url.split('/upload/')[1],
        {
          resource_type: 'video',
          type: 'authenticated',
          sign_url: true,
          expires_at: Math.floor(Date.now() / 1000) + 3600
        }
      )
      return { ...video, url: urlFirmada }
    })

    res.json(videosConAcceso)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener videos' })
  }
}

const eliminarVideo = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.video.update({
      where: { id: parseInt(id) },
      data: { activo: false }
    })
    res.json({ mensaje: 'Video eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar video' })
  }
}

module.exports = { subirVideo, getVideosCurso, eliminarVideo }