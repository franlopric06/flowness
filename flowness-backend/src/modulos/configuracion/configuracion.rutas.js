import { Router } from 'express'
import { obtenerConfiguracion, actualizarConfiguracion } from './configuracion.controlador.js'
import { verificarToken, soloAdmin } from '../../compartido/middlewares/autenticacion.js'

const router = Router()

router.get('/', obtenerConfiguracion)
router.put('/', verificarToken, soloAdmin, actualizarConfiguracion)

export default router
