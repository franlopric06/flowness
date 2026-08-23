import { Router } from 'express'
import { verificarToken } from '../middlewares/autenticacion.js'
import prisma from '../config/prisma.js'

const router = Router()

router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      select: { id: true, nombre: true, email: true, rol: true, creadoEn: true },
    })
    res.json(usuario)
  } catch {
    res.status(500).json({ error: 'Error al obtener perfil' })
  }
})

router.get('/mis-clases', verificarToken, async (req, res) => {
  try {
    const compras = await prisma.compra.findMany({
      where: { usuarioId: req.usuario.id, estado: 'APROBADO' },
      include: { clase: { include: { fase: true } } },
    })
    res.json(compras.map(c => c.clase))
  } catch {
    res.status(500).json({ error: 'Error al obtener clases' })
  }
})

export default router
