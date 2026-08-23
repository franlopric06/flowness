import { Router } from 'express'
import { obtenerConfiguracion, actualizarConfiguracion } from '../controladores/configuracion.controlador.js'
import { verificarToken, soloAdmin } from '../middlewares/autenticacion.js'

const router = Router()

router.get('/', obtenerConfiguracion)
router.put('/', verificarToken, soloAdmin, actualizarConfiguracion)

export default router
