import { Router } from 'express'
import { obtenerResenas, obtenerResumen, obtenerDestacadas, obtenerMia, guardarMia } from './resenas.controlador.js'
import { verificarToken } from '../../compartido/middlewares/autenticacion.js'

// /api/resenas
const router = Router()

router.get('/', obtenerResenas)
router.get('/resumen', obtenerResumen)
router.get('/destacadas', obtenerDestacadas)
router.get('/mia', verificarToken, obtenerMia)
router.post('/', verificarToken, guardarMia)

export default router
