import express from 'express'
import cors from 'cors'
import entorno from './config/entorno.js'
import rutasApi from './modulos/index.js'

const app = express()

// CORS: solo acepta peticiones del frontend configurado en FRONTEND_URL.
// Las peticiones sin origen (webhook de Mercado Pago, Postman) se permiten.
app.use(cors({
  origin: (origen, callback) => {
    const permitido = !origen || entorno.origenesPermitidos.includes(origen)
    callback(null, permitido)
  },
  credentials: true,
}))
app.use(express.json())

app.use('/api', rutasApi)

export default app
