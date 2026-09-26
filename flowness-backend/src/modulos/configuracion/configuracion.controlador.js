import prisma from '../../config/prisma.js'
import { esPrivada, configuracionPublica } from './configuracion.privada.js'

const LARGO_MAXIMO = 20000 // caracteres por valor (las promos se guardan como texto JSON)

export const obtenerConfiguracion = async (req, res) => {
  try {
    res.json(configuracionPublica(await prisma.configuracion.findMany()))
  } catch {
    res.status(500).json({ error: 'Error al obtener configuración' })
  }
}

// PUT /api/configuracion  body: { hero_titulo: "...", promociones: "[...]" }
export const actualizarConfiguracion = async (req, res) => {
  const cambios = Object.entries(req.body || {})
    .filter(([clave]) => !esPrivada(clave))
    .map(([clave, valor]) => [clave, valor == null ? '' : String(valor)])

  if (cambios.some(([, valor]) => valor.length > LARGO_MAXIMO)) {
    return res.status(400).json({ error: 'Uno de los textos es demasiado largo' })
  }

  try {
    await Promise.all(cambios.map(([clave, valor]) =>
      prisma.configuracion.upsert({ where: { clave }, update: { valor }, create: { clave, valor } })
    ))
    res.json({ mensaje: 'Configuración actualizada' })
  } catch (err) {
    console.error('Error al guardar la configuración:', err?.message || err)
    res.status(500).json({ error: 'Error al actualizar configuración' })
  }
}
