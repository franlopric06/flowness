import { Router } from 'express'
import { obtenerPreguntas } from './preguntas.controlador.js'

// /api/preguntas (público)
const router = Router()
router.get('/', obtenerPreguntas)

export default router
