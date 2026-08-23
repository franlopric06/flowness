import prisma from '../config/prisma.js'

export const obtenerConfiguracion = async (req, res) => {
  try {
    const config = await prisma.configuracion.findMany()
    const resultado = {}
    config.forEach(({ clave, valor }) => { resultado[clave] = valor })
    res.json(resultado)
  } catch {
    res.status(500).json({ error: 'Error al obtener configuración' })
  }
}

export const actualizarConfiguracion = async (req, res) => {
  const cambios = req.body // { hero_titulo: "...", instagram_url: "..." }
  try {
    const actualizaciones = Object.entries(cambios).map(([clave, valor]) =>
      prisma.configuracion.upsert({
        where: { clave },
        update: { valor },
        create: { clave, valor },
      })
    )
    await Promise.all(actualizaciones)
    res.json({ mensaje: 'Configuración actualizada' })
  } catch {
    res.status(500).json({ error: 'Error al actualizar configuración' })
  }
}
