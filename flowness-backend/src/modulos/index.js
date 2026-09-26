import { Router } from 'express'

import rutasAuth from './auth/auth.rutas.js'
import rutasPublico from './publico/publico.rutas.js'
import rutasUsuarios from './usuarios/usuarios.rutas.js'
import rutasFases from './fases/fases.rutas.js'
import rutasClases from './clases/clases.rutas.js'
import rutasCursos from './cursos/cursos.rutas.js'
import rutasGaleria from './galeria/galeria.rutas.js'
import rutasPagos from './pagos/pagos.rutas.js'
import rutasMedia from './media/media.rutas.js'
import rutasAdmin from './admin/admin.rutas.js'
import rutasConfiguracion from './configuracion/configuracion.rutas.js'
import rutasResenas from './resenas/resenas.rutas.js'

// Punto único donde se registran todos los módulos de la API.
// Las URLs son las mismas que antes de la reorganización.
const router = Router()

router.use('/auth', rutasAuth)
router.use('/publico', rutasPublico)
router.use('/usuario', rutasUsuarios)
router.use('/fases', rutasFases)
router.use('/clases', rutasClases)
router.use('/cursos', rutasCursos)
router.use('/galeria', rutasGaleria)
router.use('/pagos', rutasPagos)
router.use('/media', rutasMedia)
router.use('/admin', rutasAdmin)
router.use('/configuracion', rutasConfiguracion)
router.use('/resenas', rutasResenas)

export default router
