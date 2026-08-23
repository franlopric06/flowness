import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import rutasAuth from './rutas/auth.rutas.js'
import rutasUsuario from './rutas/usuario.rutas.js'
import rutasFases from './rutas/fases.rutas.js'
import rutasClases from './rutas/clases.rutas.js'
import rutasPagos from './rutas/pagos.rutas.js'
import rutasAdmin from './rutas/admin.rutas.js'
import rutasMedia from './rutas/media.rutas.js'
import rutasConfiguracion from './rutas/configuracion.rutas.js'
import rutasPublicas from './rutas/publicas.rutas.js'

dotenv.config()

const app = express()
const PUERTO = process.env.PORT || 3000

app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(express.json())

// Rutas públicas (sin autenticación)
app.use('/api/auth', rutasAuth)
app.use('/api/publico', rutasPublicas)

// Rutas protegidas (requieren login)
app.use('/api/usuario', rutasUsuario)
app.use('/api/fases', rutasFases)
app.use('/api/clases', rutasClases)
app.use('/api/pagos', rutasPagos)
app.use('/api/media', rutasMedia)

// Rutas de administrador
app.use('/api/admin', rutasAdmin)
app.use('/api/configuracion', rutasConfiguracion)

app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en puerto ${PUERTO}`)
})
