import { Router } from 'express'
import { registrar, iniciarSesion } from '../controladores/auth.controlador.js'

const router = Router()

router.post('/registrar', registrar)
router.post('/iniciar-sesion', iniciarSesion)

export default router
