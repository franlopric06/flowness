import prisma from '../../config/prisma.js'

// Textos obligatorios en la base: si todavía no se cargaron, quedan vacíos
// (así se puede guardar primero solo la foto o el video, y después los textos)
const TEXTOS = ['nombre', 'titulo', 'descripcion1', 'descripcion2']

const limpiar = (valor) => (valor ? String(valor).trim() : '')

// Arma los datos a guardar a partir de lo que manda el panel
const armarDatos = (cuerpo) => {
  const datos = {}
  for (const campo of TEXTOS) datos[campo] = limpiar(cuerpo[campo])
  datos.fotoUrl = limpiar(cuerpo.fotoUrl) || null
  datos.videoUrl = limpiar(cuerpo.videoUrl) || null
  return datos
}

export const obtenerSobreMi = async (req, res) => {
  try {
    const info = await prisma.sobreMi.findFirst()
    res.json(info)
  } catch {
    res.status(500).json({ error: 'Error al obtener información' })
  }
}

export const actualizarSobreMi = async (req, res) => {
  const datos = armarDatos(req.body || {})
  try {
    const existe = await prisma.sobreMi.findFirst()
    const info = existe
      ? await prisma.sobreMi.update({ where: { id: existe.id }, data: datos })
      : await prisma.sobreMi.create({ data: datos })
    res.json(info)
  } catch (err) {
    console.error('Error al guardar Sobre mí:', err?.message || err)
    res.status(500).json({ error: 'Error al guardar Sobre mí' })
  }
}
