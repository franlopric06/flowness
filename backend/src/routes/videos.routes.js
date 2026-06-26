const express = require('express')
const router = express.Router()
const { verificarToken, verificarAdmin } = require('../middlewares/auth.middleware')
const { upload } = require('../config/cloudinary')
const { subirVideo, getVideosCurso, eliminarVideo } = require('../controllers/videos.controller')

// Admin — subir y eliminar videos
router.post('/', verificarToken, verificarAdmin, upload.single('archivo'), subirVideo)
router.delete('/:id', verificarToken, verificarAdmin, eliminarVideo)

// Usuario — ver videos si tiene acceso
router.get('/curso/:cursoId', verificarToken, getVideosCurso)

module.exports = router