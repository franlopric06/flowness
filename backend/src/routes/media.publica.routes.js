const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

router.get('/fotos', async (req, res) => {
  try {
    const fotos = await prisma.foto.findMany({
      where: { activo: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(fotos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener fotos' })
  }
})

router.get('/videos', async (req, res) => {
  try {
    const videos = await prisma.videoMuestra.findMany({
      where: { activo: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(videos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener videos' })
  }
})

module.exports = router