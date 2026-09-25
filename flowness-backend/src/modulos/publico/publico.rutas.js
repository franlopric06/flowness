import { Router } from 'express'
import { obtenerDatosPublicos } from './publico.controlador.js'

const router = Router()

router.get('/', obtenerDatosPublicos)

export default router
