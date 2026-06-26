const express = require('express')
const router = express.Router()
const { verificarToken, verificarAdmin } = require('../middlewares/auth.middleware')
const { upload } = require('../config/cloudinary')
const { subirVideo, getVideosCurso, eliminarVideo } = require('../controllers/videos.controller')
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

// Usuario — ver videos si tiene acceso
router.get('/curso/:cursoId', verificarToken, getVideosCurso)

module.exports = router