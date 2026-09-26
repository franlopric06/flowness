import prisma from '../../config/prisma.js'
import { estaConfigurado, importarDeInstagram, estadoConexion } from '../instagram/instagram.servicio.js'
import { responderError } from './galeria.comun.js'

// Panel: conexión con Instagram y paso de recuadros a archivos reales

// GET /api/galeria/instagram — si la cuenta de Instagram está conectada
export const obtenerEstadoInstagram = async (req, res) => {
  try {
    res.json(await estadoConexion())
  } catch {
    res.json({ conectado: false })
  }
}

// POST /api/galeria/:clase/:id/importar — pasa algo agregado como recuadro
// de Instagram a archivo real (cuando la cuenta ya está conectada)
export const importarExistente = async (req, res) => {
  const clase = req.params.clase === 'reels' ? 'video' : 'foto'
  const modelo = clase === 'video' ? prisma.reel : prisma.foto
  try {
    const actual = await modelo.findUnique({ where: { id: Number(req.params.id) } })
    if (!actual) return res.status(404).json({ error: 'No se encontró' })
    if (actual.tipo !== 'INSTAGRAM') return res.status(400).json({ error: 'Ya es un archivo' })
    if (!(await estaConfigurado())) return res.status(400).json({ error: 'Instagram no está conectado' })
    const importado = await importarDeInstagram(actual.url, clase)
    res.json(await modelo.update({ where: { id: actual.id }, data: { tipo: 'ARCHIVO', url: importado.url, enlace: importado.enlace } }))
  } catch (err) {
    responderError(res, err, 'No se pudo traer de Instagram')
  }
}
