import prisma from '../config/prisma.js'

export const obtenerClases = async (req, res) => {
  const usuarioId = req.usuario?.id

  try {
    const clases = await prisma.clase.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
      include: {
        fase: true,
        documentos: { where: { activo: true } },
      },
    })

    // Para cada clase verificar si el usuario tiene acceso
    const clasesConAcceso = await Promise.all(
      clases.map(async (clase) => {
        let tieneAcceso = clase.esGratis

        if (!tieneAcceso && usuarioId) {
          const compra = await prisma.compra.findFirst({
            where: { usuarioId, claseId: clase.id, estado: 'APROBADO' },
          })
          tieneAcceso = !!compra
        }

        return { ...clase, tieneAcceso }
      })
    )

    res.json(clasesConAcceso)
  } catch {
    res.status(500).json({ error: 'Error al obtener clases' })
  }
}

export const obtenerClasePorId = async (req, res) => {
  const { id } = req.params
  const usuarioId = req.usuario?.id

  try {
    const clase = await prisma.clase.findUnique({
      where: { id: Number(id) },
      include: { fase: true, documentos: { where: { activo: true } } },
    })

    if (!clase) return res.status(404).json({ error: 'Clase no encontrada' })

    let tieneAcceso = clase.esGratis
    if (!tieneAcceso && usuarioId) {
      const compra = await prisma.compra.findFirst({
        where: { usuarioId, claseId: clase.id, estado: 'APROBADO' },
      })
      tieneAcceso = !!compra
    }

    if (!tieneAcceso) {
      const { videoUrl, ...sinVideo } = clase
      return res.json({ ...sinVideo, tieneAcceso: false })
    }

    res.json({ ...clase, tieneAcceso: true })
  } catch {
    res.status(500).json({ error: 'Error al obtener clase' })
  }
}

export const crearClase = async (req, res) => {
  const { faseId, nombre, descripcion, videoUrl, precio, esGratis, orden } = req.body
  try {
    const clase = await prisma.clase.create({
      data: { faseId: Number(faseId), nombre, descripcion, videoUrl, precio: Number(precio), esGratis, orden: Number(orden) },
    })
    res.json(clase)
  } catch {
    res.status(500).json({ error: 'Error al crear clase' })
  }
}

export const actualizarClase = async (req, res) => {
  const { id } = req.params
  const { faseId, nombre, descripcion, videoUrl, precio, esGratis, orden, activo } = req.body
  try {
    const clase = await prisma.clase.update({
      where: { id: Number(id) },
      data: { faseId: Number(faseId), nombre, descripcion, videoUrl, precio: Number(precio), esGratis, orden: Number(orden), activo },
    })
    res.json(clase)
  } catch {
    res.status(500).json({ error: 'Error al actualizar clase' })
  }
}

export const eliminarClase = async (req, res) => {
  const { id } = req.params
  try {
    await prisma.clase.update({ where: { id: Number(id) }, data: { activo: false } })
    res.json({ mensaje: 'Clase desactivada' })
  } catch {
    res.status(500).json({ error: 'Error al eliminar clase' })
  }
}
