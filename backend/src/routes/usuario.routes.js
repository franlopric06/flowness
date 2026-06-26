const express = require('express')
const router = express.Router()
const { verificarToken } = require('../middlewares/auth.middleware')
const prisma = require('../prisma')

// Mis cursos comprados
router.get('/mis-cursos', verificarToken, async (req, res) => {
  try {
    const compras = await prisma.compra.findMany({
      where: {
        usuarioId: req.usuario.id,
        estado: 'aprobado'
      },
      include: {
        curso: true
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(compras)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cursos comprados' })
  }
})

// Mis clases compradas
router.get('/mis-clases', verificarToken, async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      where: {
        usuarioId: req.usuario.id,
        estado: 'aprobado'
      },
      include: {
        clase: true
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(reservas)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clases compradas' })
  }
})

module.exports = router