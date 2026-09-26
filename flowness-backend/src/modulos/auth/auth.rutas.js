import { Router } from 'express'
import { registrar, iniciarSesion, estadoRecuperacion, pedirRecuperacion, restablecerClave } from './auth.controlador.js'

const router = Router()

router.post('/registrar', registrar)
router.post('/iniciar-sesion', iniciarSesion)

// Recuperar la contraseña por email
router.get('/recuperacion', estadoRecuperacion)
router.post('/olvide-clave', pedirRecuperacion)
router.post('/restablecer-clave', restablecerClave)

export default router
