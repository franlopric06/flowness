const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth.routes')
const cursosRoutes = require('./routes/cursos.routes')
const clasesRoutes = require('./routes/clases.routes')
const adminRoutes = require('./routes/admin.routes')
const mediaRoutes = require('./routes/media.routes')
const galeriaRoutes = require('./routes/media.publica.routes')
const pagosRoutes = require('./routes/pagos.routes')
const usuarioRoutes = require('./routes/usuario.routes')
const videosRoutes = require('./routes/videos.routes')
const prisma = require('./prisma')

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors({
  origin: ['https://flowness.vercel.app', 'http://localhost:5173'],
  credentials: true
}))
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/cursos', cursosRoutes)
app.use('/api/clases', clasesRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/media', mediaRoutes)
app.use('/api/galeria', galeriaRoutes)
app.use('/api/pagos', pagosRoutes)
app.use('/api/usuario', usuarioRoutes)
app.use('/api/videos', videosRoutes)

// Ruta publica de avisos
app.get('/api/avisos', async (req, res) => {
  try {
    const avisos = await prisma.aviso.findMany({
      where: { activo: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
    res.json(avisos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener avisos' })
  }
})

// Ruta publica de fases
app.get('/api/fases', async (req, res) => {
  try {
    const fases = await prisma.fase.findMany({
      where: { activo: true },
      orderBy: { numero: 'asc' }
    })
    res.json(fases)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener fases' })
  }
})

// Ruta publica de niveles
app.get('/api/niveles', async (req, res) => {
  try {
    const niveles = await prisma.nivel.findMany({
      where: { activo: true },
      orderBy: { numero: 'asc' }
    })
    res.json(niveles)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener niveles' })
  }
})

// Ruta publica de sobre mi
app.get('/api/sobre-mi', async (req, res) => {
  try {
    const sobreMi = await prisma.sobreMi.findFirst()
    res.json(sobreMi)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener sobre mi' })
  }
})

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Flowness funcionando ✓' })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})