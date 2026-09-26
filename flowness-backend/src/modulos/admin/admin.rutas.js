import { Router } from 'express'
import { obtenerUsuarios, obtenerCompras } from './admin.controlador.js'
import { verificarToken, soloAdmin } from '../../compartido/middlewares/autenticacion.js'
import rutasAvisos from '../avisos/avisos.rutas.js'
import rutasSobreMi from '../sobre-mi/sobre-mi.rutas.js'
import rutasResenasAdmin from '../resenas/resenas.admin.rutas.js'

const router = Router()

router.use(verificarToken, soloAdmin)

router.get('/usuarios', obtenerUsuarios)
router.get('/compras', obtenerCompras)

// Submódulos de administración (mantienen las mismas URLs: /api/admin/avisos y /api/admin/sobre-mi)
router.use('/avisos', rutasAvisos)
router.use('/sobre-mi', rutasSobreMi)
router.use('/resenas', rutasResenasAdmin)

export default router
