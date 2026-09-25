import { Router } from 'express'
import { obtenerPerfil, obtenerMisClases } from './usuarios.controlador.js'
import { verificarToken } from '../../compartido/middlewares/autenticacion.js'

const router = Router()

router.get('/perfil', verificarToken, obtenerPerfil)
router.get('/mis-clases', verificarToken, obtenerMisClases)

export default router
