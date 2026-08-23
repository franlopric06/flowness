import { Router } from 'express'
import { subirImagen, subirVideo, subirDocumento, obtenerGaleria } from '../controladores/media.controlador.js'
import { verificarToken, soloAdmin } from '../middlewares/autenticacion.js'
import { subirArchivo } from '../middlewares/subidaArchivos.js'

const router = Router()

router.get('/galeria', obtenerGaleria)
router.post('/imagen', verificarToken, soloAdmin, subirArchivo.single('archivo'), subirImagen)
router.post('/video', verificarToken, soloAdmin, subirArchivo.single('archivo'), subirVideo)
router.post('/documento', verificarToken, soloAdmin, subirArchivo.single('archivo'), subirDocumento)

export default router
