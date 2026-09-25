import { Router } from 'express'
import { obtenerFases, crearFase, actualizarFase, eliminarFase } from './fases.controlador.js'
import { verificarToken, soloAdmin } from '../../compartido/middlewares/autenticacion.js'

const router = Router()

router.get('/', obtenerFases)
router.post('/', verificarToken, soloAdmin, crearFase)
router.put('/:id', verificarToken, soloAdmin, actualizarFase)
router.delete('/:id', verificarToken, soloAdmin, eliminarFase)

export default router
