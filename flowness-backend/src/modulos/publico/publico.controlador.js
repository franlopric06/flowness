import prisma from '../../config/prisma.js'
import { configuracionPublica } from '../configuracion/configuracion.privada.js'

export const obtenerDatosPublicos = async (req, res) => {
  try {
    const [fases, sobreMi, fotos, avisos, config] = await Promise.all([
      prisma.fase.findMany({ where: { activo: true }, orderBy: { numero: 'asc' } }),
      prisma.sobreMi.findFirst(),
      prisma.foto.findMany({ where: { activo: true }, orderBy: { orden: 'asc' } }),
      prisma.aviso.findMany({ where: { activo: true }, orderBy: { creadoEn: 'desc' }, take: 5 }),
      prisma.configuracion.findMany(),
    ])

    // Sin las claves privadas (por ejemplo el token de Instagram)
    const configuracion = configuracionPublica(config)

    res.json({ fases, sobreMi, fotos, avisos, configuracion })
  } catch {
    res.status(500).json({ error: 'Error al obtener datos públicos' })
  }
}
