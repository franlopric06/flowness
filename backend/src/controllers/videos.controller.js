const { cloudinary } = require('../config/cloudinary')
const prisma = require('../prisma')

const subirVideo = async (req, res) => {
  try {
    const { cursoId, titulo, descripcion, orden } = req.body
    const archivo = req.file

    if (!archivo) return res.status(400).json({ error: 'No se subió ningún archivo' })

    const curso = await prisma.curso.findUnique({
      where: { id: parseInt(cursoId) }
    })

    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })

    const resultado = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `flowness/cursos/${cursoId}`,
          resource_type: 'video',
          type: 'upload'
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

    const videos = await prisma.video.findMany({
      where: { cursoId: parseInt(cursoId), activo: true },
      orderBy: { orden: 'asc' }
    })

    res.json(videos)
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

const subirDocumento = async (req, res) => {
  try {
    const { cursoId, titulo, descripcion } = req.body
    const archivo = req.file

    if (!archivo) return res.status(400).json({ error: 'No se subió ningún archivo' })

    const curso = await prisma.curso.findUnique({
      where: { id: parseInt(cursoId) }
    })

    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })

    const resultado = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `flowness/cursos/${cursoId}/documentos`,
          resource_type: 'raw',
          type: 'upload',
          access_mode: 'public'
        },
        (error, result) => error ? reject(error) : resolve(result)
      ).end(archivo.buffer)
    })

    const documento = await prisma.documento.create({
      data: {
        cursoId: parseInt(cursoId),
        titulo,
        descripcion,
        url: resultado.secure_url
      }
    })

    res.status(201).json(documento)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al subir documento' })
  }
}

const getDocumentosCurso = async (req, res) => {
  try {
    const { cursoId } = req.params
    const usuarioId = req.usuario.id

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

    const documentos = await prisma.documento.findMany({
      where: { cursoId: parseInt(cursoId), activo: true },
      orderBy: { createdAt: 'asc' }
    })

    res.json(documentos)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener documentos' })
  }
}

const eliminarDocumento = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.documento.update({
      where: { id: parseInt(id) },
      data: { activo: false }
    })
    res.json({ mensaje: 'Documento eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar documento' })
  }
}

module.exports = { subirVideo, getVideosCurso, eliminarVideo, subirDocumento, getDocumentosCurso, eliminarDocumento }