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

// Errores no controlados (por ejemplo, un archivo demasiado pesado o de un
// tipo no permitido al subirlo): responde en JSON y deja el motivo en los logs.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const esDelArchivo = err?.name === 'MulterError' || err?.message === 'Tipo de archivo no permitido'
  const mensaje = err?.code === 'LIMIT_FILE_SIZE' ? 'El archivo supera el tamaño máximo (100 MB)' : err?.message || 'Error inesperado'
  console.error(`Error en ${req.method} ${req.originalUrl}:`, mensaje)
  res.status(esDelArchivo ? 400 : 500).json({ error: mensaje })
})

export default app
