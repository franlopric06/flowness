import { Router } from 'express'
import { obtenerClases, obtenerClasePorId, crearClase, actualizarClase, eliminarClase } from '../controladores/clases.controlador.js'
import { verificarToken, soloAdmin } from '../middlewares/autenticacion.js'

const router = Router()

router.get('/', verificarToken, obtenerClases)
router.get('/:id', verificarToken, obtenerClasePorId)
router.post('/', verificarToken, soloAdmin, crearClase)
router.put('/:id', verificarToken, soloAdmin, actualizarClase)
router.delete('/:id', verificarToken, soloAdmin, eliminarClase)

export default router
