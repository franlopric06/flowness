const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth.routes')
const cursosRoutes = require('./routes/cursos.routes')
const clasesRoutes = require('./routes/clases.routes')

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/cursos', cursosRoutes)
app.use('/api/clases', clasesRoutes)

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Flowness funcionando ✓' })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})