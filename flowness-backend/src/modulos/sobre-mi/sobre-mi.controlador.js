import prisma from '../../config/prisma.js'

export const obtenerSobreMi = async (req, res) => {
  try {
    const info = await prisma.sobreMi.findFirst()
    res.json(info)
  } catch {
    res.status(500).json({ error: 'Error al obtener información' })
  }
}

export const actualizarSobreMi = async (req, res) => {
  const { nombre, titulo, descripcion1, descripcion2, fotoUrl } = req.body
  try {
    const existe = await prisma.sobreMi.findFirst()
    const info = existe
      ? await prisma.sobreMi.update({ where: { id: existe.id }, data: { nombre, titulo, descripcion1, descripcion2, fotoUrl } })
      : await prisma.sobreMi.create({ data: { nombre, titulo, descripcion1, descripcion2, fotoUrl } })
    res.json(info)
  } catch {
    res.status(500).json({ error: 'Error al actualizar información' })
  }
}
