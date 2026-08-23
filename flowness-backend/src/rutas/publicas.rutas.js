import { Router } from 'express'
import { obtenerDatosPublicos } from '../controladores/publicas.controlador.js'

const router = Router()

router.get('/', obtenerDatosPublicos)

export default router
