import { Router } from 'express'

import rutasAuth from './auth/auth.rutas.js'
import rutasPublico from './publico/publico.rutas.js'
import rutasUsuarios from './usuarios/usuarios.rutas.js'
import rutasFases from './fases/fases.rutas.js'
import rutasClases from './clases/clases.rutas.js'
import rutasPagos from './pagos/pagos.rutas.js'
import rutasMedia from './media/media.rutas.js'
import rutasAdmin from './admin/admin.rutas.js'
import rutasConfiguracion from './configuracion/configuracion.rutas.js'

// Punto único donde se registran todos los módulos de la API.
// Las URLs son las mismas que antes de la reorganización.
const router = Router()

router.use('/auth', rutasAuth)
router.use('/publico', rutasPublico)
router.use('/usuario', rutasUsuarios)
router.use('/fases', rutasFases)
router.use('/clases', rutasClases)
router.use('/pagos', rutasPagos)
router.use('/media', rutasMedia)
router.use('/admin', rutasAdmin)
router.use('/configuracion', rutasConfiguracion)

export default router
