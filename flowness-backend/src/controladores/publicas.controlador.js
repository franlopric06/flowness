import prisma from '../config/prisma.js'

export const obtenerDatosPublicos = async (req, res) => {
  try {
    const [fases, sobreMi, fotos, avisos, config] = await Promise.all([
      prisma.fase.findMany({ where: { activo: true }, orderBy: { numero: 'asc' } }),
      prisma.sobreMi.findFirst(),
      prisma.foto.findMany({ where: { activo: true }, orderBy: { orden: 'asc' } }),
      prisma.aviso.findMany({ where: { activo: true }, orderBy: { creadoEn: 'desc' }, take: 5 }),
      prisma.configuracion.findMany(),
    ])

    const configuracion = {}
    config.forEach(({ clave, valor }) => { configuracion[clave] = valor })

    res.json({ fases, sobreMi, fotos, avisos, configuracion })
  } catch {
    res.status(500).json({ error: 'Error al obtener datos públicos' })
  }
}
