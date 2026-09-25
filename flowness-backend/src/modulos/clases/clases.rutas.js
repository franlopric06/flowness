import { Router } from 'express'
import {
  obtenerClases, obtenerClasePorId, obtenerClasesAdmin,
  crearClase, actualizarClase, eliminarClase,
} from './clases.controlador.js'
import { verificarToken, autenticacionOpcional, soloAdmin } from '../../compartido/middlewares/autenticacion.js'

const router = Router()

// Panel (va antes de '/:id' para que "admin" no se tome como un id)
router.get('/admin/todas', verificarToken, soloAdmin, obtenerClasesAdmin)

// Catálogo público: cualquiera lo ve; si hay sesión, se indica a qué tiene acceso
router.get('/', autenticacionOpcional, obtenerClases)
router.get('/:id', autenticacionOpcional, obtenerClasePorId)

router.post('/', verificarToken, soloAdmin, crearClase)
router.put('/:id', verificarToken, soloAdmin, actualizarClase)
router.delete('/:id', verificarToken, soloAdmin, eliminarClase)

export default router
