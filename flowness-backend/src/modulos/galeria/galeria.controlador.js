import prisma from '../../config/prisma.js'
import { orden } from './galeria.comun.js'

// Galería: lo público y el listado del panel.
// Las acciones de fotos, reels e Instagram viven en su propio archivo.
export { crearFoto, actualizarFoto, eliminarFoto } from './galeria.fotos.js'
export { crearReel, actualizarReel, eliminarReel } from './galeria.reels.js'
export { obtenerEstadoInstagram, importarExistente } from './galeria.instagram.js'

// GET /api/galeria — fotos y reels visibles
export const obtenerGaleria = async (req, res) => {
  try {
    const [fotos, reels] = await Promise.all([
      prisma.foto.findMany({ where: { activo: true }, orderBy: orden }),
      prisma.reel.findMany({ where: { activo: true }, orderBy: orden }),
    ])
    res.json({ fotos, reels })
  } catch {
    res.status(500).json({ error: 'Error al obtener la galería' })
  }
}

// Panel: todo, incluso lo oculto
export const obtenerGaleriaAdmin = async (req, res) => {
  try {
    const [fotos, reels] = await Promise.all([
      prisma.foto.findMany({ orderBy: orden }),
      prisma.reel.findMany({ orderBy: orden }),
    ])
    res.json({ fotos, reels })
  } catch {
    res.status(500).json({ error: 'Error al obtener la galería' })
  }
}
