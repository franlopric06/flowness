const prisma = require('../prisma')

const getCursos = async (req, res) => {
  try {
    const cursos = await prisma.curso.findMany({
      orderBy: { nivel: 'asc' }
    })
    res.json(cursos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cursos' })
  }
}

const crearCurso = async (req, res) => {
  try {
    const { nivel, nombre, descripcion, precio, duracion, videos } = req.body
    const curso = await prisma.curso.create({
      data: { nivel, nombre, descripcion, precio: parseFloat(precio), duracion, videos: parseInt(videos) }
    })
    res.status(201).json(curso)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear curso' })
  }
}

const actualizarCurso = async (req, res) => {
  try {
    const { id } = req.params
    const { nivel, nombre, descripcion, precio, duracion, videos, activo } = req.body
    const curso = await prisma.curso.update({
      where: { id: parseInt(id) },
      data: { nivel, nombre, descripcion, precio: parseFloat(precio), duracion, videos: parseInt(videos), activo }
    })
    res.json(curso)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar curso' })
  }
}

const eliminarCurso = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.curso.update({
      where: { id: parseInt(id) },
      data: { activo: false }
    })
    res.json({ mensaje: 'Curso desactivado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar curso' })
  }
}

const getClases = async (req, res) => {
  try {
    const clases = await prisma.clase.findMany({
      include: { horarios: true },
      orderBy: { fase: 'asc' }
    })
    res.json(clases)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clases' })
  }
}

const actualizarClase = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, descripcion, precio_vivo, precio_grabada, duracion, activo, videoUrl, zoomLink } = req.body
    const clase = await prisma.clase.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        descripcion,
        precio_vivo: parseFloat(precio_vivo),
        precio_grabada: parseFloat(precio_grabada),
        duracion,
        activo,
        videoUrl,
        zoomLink
      }
    })
    res.json(clase)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar clase' })
  }
}

const getAvisos = async (req, res) => {
  try {
    const avisos = await prisma.aviso.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(avisos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener avisos' })
  }
}

const crearAviso = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body
    const aviso = await prisma.aviso.create({
      data: { titulo, descripcion }
    })
    res.status(201).json(aviso)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear aviso' })
  }
}

const eliminarAviso = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.aviso.delete({
      where: { id: parseInt(id) }
    })
    res.json({ mensaje: 'Aviso eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar aviso' })
  }
}

const activarCurso = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.curso.update({
      where: { id: parseInt(id) },
      data: { activo: true }
    })
    res.json({ mensaje: 'Curso activado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al activar curso' })
  }
}

const crearClase = async (req, res) => {
  try {
    const { fase, nombre, descripcion, duracion, precio_vivo, precio_grabada } = req.body
    const clase = await prisma.clase.create({
      data: {
        fase,
        nombre,
        descripcion,
        duracion,
        precio_vivo: parseFloat(precio_vivo),
        precio_grabada: parseFloat(precio_grabada)
      }
    })
    res.status(201).json(clase)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear clase' })
  }
}

const activarClase = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.clase.update({
      where: { id: parseInt(id) },
      data: { activo: true }
    })
    res.json({ mensaje: 'Clase activada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al activar clase' })
  }
}

const desactivarClase = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.clase.update({
      where: { id: parseInt(id) },
      data: { activo: false }
    })
    res.json({ mensaje: 'Clase desactivada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al desactivar clase' })
  }
}

const getFases = async (req, res) => {
  try {
    const fases = await prisma.fase.findMany({
      where: { activo: true },
      orderBy: { numero: 'asc' }
    })
    res.json(fases)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener fases' })
  }
}

const crearFase = async (req, res) => {
  try {
    const { numero, nombre, descripcion } = req.body
    const fase = await prisma.fase.create({
      data: { numero, nombre, descripcion }
    })
    res.status(201).json(fase)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear fase' })
  }
}

const actualizarFase = async (req, res) => {
  try {
    const { id } = req.params
    const { numero, nombre, descripcion } = req.body
    const fase = await prisma.fase.update({
      where: { id: parseInt(id) },
      data: { numero, nombre, descripcion }
    })
    res.json(fase)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar fase' })
  }
}

const eliminarFase = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.fase.update({
      where: { id: parseInt(id) },
      data: { activo: false }
    })
    res.json({ mensaje: 'Fase eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar fase' })
  }
}

const getNiveles = async (req, res) => {
  try {
    const niveles = await prisma.nivel.findMany({
      where: { activo: true },
      orderBy: { numero: 'asc' }
    })
    res.json(niveles)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener niveles' })
  }
}

const crearNivel = async (req, res) => {
  try {
    const { numero, nombre, etiqueta, descripcion, para, incluye } = req.body
    const nivel = await prisma.nivel.create({
      data: { numero, nombre, etiqueta, descripcion, para, incluye }
    })
    res.status(201).json(nivel)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear nivel' })
  }
}

const actualizarNivel = async (req, res) => {
  try {
    const { id } = req.params
    const { numero, nombre, etiqueta, descripcion, para, incluye } = req.body
    const nivel = await prisma.nivel.update({
      where: { id: parseInt(id) },
      data: { numero, nombre, etiqueta, descripcion, para, incluye }
    })
    res.json(nivel)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar nivel' })
  }
}

const eliminarNivel = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.nivel.update({
      where: { id: parseInt(id) },
      data: { activo: false }
    })
    res.json({ mensaje: 'Nivel eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar nivel' })
  }
}

const getSobreMi = async (req, res) => {
  try {
    const sobreMi = await prisma.sobreMi.findFirst()
    res.json(sobreMi)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener sobre mi' })
  }
}

const actualizarSobreMi = async (req, res) => {
  try {
    const { nombre, titulo, descripcion1, descripcion2 } = req.body
    const archivo = req.file

    let fotoUrl = undefined

    if (archivo) {
      const { cloudinary } = require('../config/cloudinary')
      const resultado = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'flowness/sobre-mi', resource_type: 'image' },
          (error, result) => error ? reject(error) : resolve(result)
        ).end(archivo.buffer)
      })
      fotoUrl = resultado.secure_url
    }

    const existente = await prisma.sobreMi.findFirst()
    const data = { nombre, titulo, descripcion1, descripcion2 }
    if (fotoUrl) data.fotoUrl = fotoUrl

    let sobreMi
    if (existente) {
      sobreMi = await prisma.sobreMi.update({
        where: { id: existente.id },
        data
      })
    } else {
      sobreMi = await prisma.sobreMi.create({ data })
    }
    res.json(sobreMi)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar sobre mi' })
  }
}

const eliminarSobreMi = async (req, res) => {
  try {
    const existente = await prisma.sobreMi.findFirst()
    if (existente) {
      await prisma.sobreMi.delete({ where: { id: existente.id } })
    }
    res.json({ mensaje: 'Sobre mí eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar sobre mi' })
  }
}

const getHorarios = async (req, res) => {
  try {
    const { claseId } = req.params
    const horarios = await prisma.horario.findMany({
      where: { claseId: parseInt(claseId) },
      orderBy: { dia: 'asc' }
    })
    res.json(horarios)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener horarios' })
  }
}

const crearHorario = async (req, res) => {
  try {
    const { claseId, dia, hora } = req.body
    const horario = await prisma.horario.create({
      data: {
        claseId: parseInt(claseId),
        dia,
        hora
      }
    })
    res.status(201).json(horario)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear horario' })
  }
}

const eliminarHorario = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.horario.delete({
      where: { id: parseInt(id) }
    })
    res.json({ mensaje: 'Horario eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar horario' })
  }
}

module.exports = { 
  getCursos,
   crearCurso, 
   actualizarCurso,
  eliminarCurso, 
  activarCurso, 
  getClases, 
  crearClase,
  actualizarClase, 
  activarClase, 
  desactivarClase, 
  getAvisos, 
  crearAviso, 
  eliminarAviso, 
  getFases, 
  crearFase, 
  actualizarFase, 
  eliminarFase,
  getNiveles, 
  crearNivel, 
  actualizarNivel, 
  eliminarNivel,
   getSobreMi, 
  actualizarSobreMi,
  eliminarSobreMi,
  getHorarios, 
  crearHorario, 
  eliminarHorario
 }