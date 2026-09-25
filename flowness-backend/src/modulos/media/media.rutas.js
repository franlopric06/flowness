import { Router } from 'express'
import { subirImagen, subirVideo, subirDocumento, firmarSubida, obtenerGaleria } from './media.controlador.js'
import { verificarToken, soloAdmin } from '../../compartido/middlewares/autenticacion.js'
import { subirArchivo } from '../../compartido/middlewares/subidaArchivos.js'

const router = Router()

router.get('/galeria', obtenerGaleria)

// Permiso para que el panel suba archivos directo a Cloudinary (recomendado)
router.post('/firma', verificarToken, soloAdmin, firmarSubida)

// Subida pasando por el servidor (se deja como alternativa)
router.post('/imagen', verificarToken, soloAdmin, subirArchivo.single('archivo'), subirImagen)
router.post('/video', verificarToken, soloAdmin, subirArchivo.single('archivo'), subirVideo)
router.post('/documento', verificarToken, soloAdmin, subirArchivo.single('archivo'), subirDocumento)

export default router
