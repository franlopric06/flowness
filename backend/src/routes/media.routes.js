const express = require('express')
const router = express.Router()
const { verificarToken, verificarAdmin } = require('../middlewares/auth.middleware')
const { upload } = require('../config/cloudinary')
const { subirFoto, getFotos, eliminarFoto, subirVideo, getVideos, eliminarVideo } = require('../controllers/media.controller')

router.use(verificarToken)
router.use(verificarAdmin)

// Fotos
router.get('/fotos', getFotos)
router.post('/fotos', upload.single('archivo'), subirFoto)
router.delete('/fotos/:id', eliminarFoto)

// Videos
router.get('/videos', getVideos)
router.post('/videos', upload.single('archivo'), subirVideo)
router.delete('/videos/:id', eliminarVideo)

module.exports = router