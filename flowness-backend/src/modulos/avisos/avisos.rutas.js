import { Router } from 'express'
import { obtenerAvisos, crearAviso, eliminarAviso } from './avisos.controlador.js'

// Se monta dentro de /api/admin, que ya aplica verificarToken y soloAdmin
const router = Router()

router.get('/', obtenerAvisos)
router.post('/', crearAviso)
router.delete('/:id', eliminarAviso)

export default router
