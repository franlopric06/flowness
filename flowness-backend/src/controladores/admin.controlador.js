import prisma from '../config/prisma.js'

// Usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: { id: true, nombre: true, email: true, rol: true, activo: true, creadoEn: true },
      orderBy: { creadoEn: 'desc' },
    })
    res.json(usuarios)
  } catch {
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
}

export const obtenerCompras = async (req, res) => {
  try {
    const compras = await prisma.compra.findMany({
      include: {
        usuario: { select: { nombre: true, email: true } },
        clase: { select: { nombre: true } },
      },
      orderBy: { creadoEn: 'desc' },
    })
    res.json(compras)
  } catch {
    res.status(500).json({ error: 'Error al obtener compras' })
  }
}

// Avisos
export const obtenerAvisos = async (req, res) => {
  try {
    const avisos = await prisma.aviso.findMany({ orderBy: { creadoEn: 'desc' } })
    res.json(avisos)
  } catch {
    res.status(500).json({ error: 'Error al obtener avisos' })
  }
}

export const crearAviso = async (req, res) => {
  const { titulo, descripcion } = req.body
  try {
    const aviso = await prisma.aviso.create({ data: { titulo, descripcion } })
    res.json(aviso)
  } catch {
    res.status(500).json({ error: 'Error al crear aviso' })
  }
}

export const eliminarAviso = async (req, res) => {
  const { id } = req.params
  try {
    await prisma.aviso.update({ where: { id: Number(id) }, data: { activo: false } })
    res.json({ mensaje: 'Aviso eliminado' })
  } catch {
    res.status(500).json({ error: 'Error al eliminar aviso' })
  }
}

// Sobre mí
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
