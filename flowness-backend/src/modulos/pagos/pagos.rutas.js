import { Router } from 'express'
import { crearPreferencia, webhookPago } from './pagos.controlador.js'
import { verificarToken } from '../../compartido/middlewares/autenticacion.js'

const router = Router()

router.post('/crear-preferencia', verificarToken, crearPreferencia)
router.post('/webhook', webhookPago)

export default router
