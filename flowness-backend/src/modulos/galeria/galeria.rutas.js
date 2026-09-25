import { Router } from 'express'
import {
  obtenerGaleria, obtenerGaleriaAdmin,
  crearFoto, actualizarFoto, eliminarFoto,
  crearReel, actualizarReel, eliminarReel,
  obtenerEstadoInstagram, importarExistente,
} from './galeria.controlador.js'
import { verificarToken, soloAdmin } from '../../compartido/middlewares/autenticacion.js'

const router = Router()
const admin = [verificarToken, soloAdmin]

router.get('/', obtenerGaleria)
router.get('/admin', ...admin, obtenerGaleriaAdmin)
router.get('/instagram', ...admin, obtenerEstadoInstagram)
router.post('/:clase(fotos|reels)/:id/importar', ...admin, importarExistente)

router.post('/fotos', ...admin, crearFoto)
router.put('/fotos/:id', ...admin, actualizarFoto)
router.delete('/fotos/:id', ...admin, eliminarFoto)

router.post('/reels', ...admin, crearReel)
router.put('/reels/:id', ...admin, actualizarReel)
router.delete('/reels/:id', ...admin, eliminarReel)

export default router
