import { Router } from 'express'
import { obtenerUsuarios, obtenerCompras, obtenerAvisos, crearAviso, eliminarAviso, obtenerSobreMi, actualizarSobreMi } from '../controladores/admin.controlador.js'
import { verificarToken, soloAdmin } from '../middlewares/autenticacion.js'

const router = Router()

router.use(verificarToken, soloAdmin)

router.get('/usuarios', obtenerUsuarios)
router.get('/compras', obtenerCompras)

router.get('/avisos', obtenerAvisos)
router.post('/avisos', crearAviso)
router.delete('/avisos/:id', eliminarAviso)

router.get('/sobre-mi', obtenerSobreMi)
router.put('/sobre-mi', actualizarSobreMi)

export default router
