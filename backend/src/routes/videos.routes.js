const express = require('express')
const router = express.Router()
const { verificarToken, verificarAdmin } = require('../middlewares/auth.middleware')
const { upload } = require('../config/cloudinary')
const { subirVideo, getVideosCurso, eliminarVideo, subirDocumento, getDocumentosCurso, eliminarDocumento } = require('../controllers/videos.controller')
const prisma = require('../prisma')

// Admin — subir y eliminar videos
router.post('/', verificarToken, verificarAdmin, upload.single('archivo'), subirVideo)
router.delete('/:id', verificarToken, verificarAdmin, eliminarVideo)

// Admin — ver videos de un curso sin verificar compra
router.get('/admin/curso/:cursoId', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { cursoId } = req.params
    const videos = await prisma.video.findMany({
      where: { cursoId: parseInt(cursoId), activo: true },
      orderBy: { orden: 'asc' }
    })
    res.json(videos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener videos' })
  }
})

// Admin — ver documentos de un curso sin verificar compra
router.get('/documentos/admin/curso/:cursoId', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { cursoId } = req.params
    const docs = await prisma.documento.findMany({
      where: { cursoId: parseInt(cursoId), activo: true },
      orderBy: { createdAt: 'asc' }
    })
    res.json(docs)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener documentos' })
  }
})

// Admin — subir y eliminar documentos
router.post('/documentos', verificarToken, verificarAdmin, upload.single('archivo'), subirDocumento)
router.delete('/documentos/:id', verificarToken, verificarAdmin, eliminarDocumento)

// Usuario — ver videos si tiene acceso
router.get('/curso/:cursoId', verificarToken, getVideosCurso)

// Usuario — ver documentos si tiene acceso
router.get('/documentos/curso/:cursoId', verificarToken, getDocumentosCurso)

module.exports = router