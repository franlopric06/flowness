import { Router } from 'express'
import {
  obtenerCursos, obtenerCurso, obtenerCursosAdmin,
  actualizarCurso, crearLeccion, actualizarLeccion,
} from './cursos.controlador.js'
import { verificarToken, autenticacionOpcional, soloAdmin } from '../../compartido/middlewares/autenticacion.js'

const router = Router()

// Panel (antes de '/:slug' para que "admin" no se tome como un curso)
router.get('/admin/todos', verificarToken, soloAdmin, obtenerCursosAdmin)
router.put('/:id', verificarToken, soloAdmin, actualizarCurso)
router.post('/:id/lecciones', verificarToken, soloAdmin, crearLeccion)
router.put('/lecciones/:leccionId', verificarToken, soloAdmin, actualizarLeccion)

// Público: cualquiera ve la info; con sesión se indica si lo compró
router.get('/', autenticacionOpcional, obtenerCursos)
router.get('/:slug', autenticacionOpcional, obtenerCurso)

export default router
