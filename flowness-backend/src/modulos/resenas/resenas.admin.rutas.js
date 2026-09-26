import { Router } from 'express'
import { obtenerResenasAdmin, moderarResena, eliminarResena } from './resenas.controlador.js'

// Se monta dentro de /api/admin, que ya aplica verificarToken y soloAdmin
const router = Router()

router.get('/', obtenerResenasAdmin)
router.put('/:id', moderarResena)
router.delete('/:id', eliminarResena)

export default router
