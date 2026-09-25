import { Router } from 'express'
import { crearPreferencia, procesarPago, webhookPago } from './pagos.controlador.js'
import { verificarToken } from '../../compartido/middlewares/autenticacion.js'

const router = Router()

router.post('/crear-preferencia', verificarToken, crearPreferencia)
router.post('/procesar', verificarToken, procesarPago)
router.post('/webhook', webhookPago)

export default router
