import { Router } from 'express'
import { obtenerSobreMi, actualizarSobreMi } from './sobre-mi.controlador.js'

// Se monta dentro de /api/admin, que ya aplica verificarToken y soloAdmin
const router = Router()

router.get('/', obtenerSobreMi)
router.put('/', actualizarSobreMi)

export default router
