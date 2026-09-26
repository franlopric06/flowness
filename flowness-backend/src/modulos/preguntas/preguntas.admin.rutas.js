import { Router } from 'express'
import { obtenerPreguntasAdmin, crearPregunta, actualizarPregunta, eliminarPregunta } from './preguntas.controlador.js'

// Se monta dentro de /api/admin, que ya aplica verificarToken y soloAdmin
const router = Router()

router.get('/', obtenerPreguntasAdmin)
router.post('/', crearPregunta)
router.put('/:id', actualizarPregunta)
router.delete('/:id', eliminarPregunta)

export default router
