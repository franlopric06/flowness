import cloudinary from '../../config/cloudinary.js'
import { estaConfigurado, importarDeInstagram, ErrorInstagram } from '../instagram/instagram.servicio.js'

// Herramientas que comparten las fotos, los reels y la importación de Instagram

export const orden = [{ orden: 'asc' }, { creadoEn: 'asc' }]

// Acepta links de reels o publicaciones de Instagram:
// instagram.com/reel/CODIGO · /reels/CODIGO · /p/CODIGO · /tv/CODIGO
export const esLinkInstagram = (url = '') =>
  /^https?:\/\/(www\.)?instagram\.com\/(reel|reels|p|tv)\/[\w-]+/i.test(String(url).trim())

export const esVideoCloudinary = (url = '') => /^https:\/\/res\.cloudinary\.com\/.+\/video\/upload\//i.test(String(url).trim())
export const esImagenCloudinary = (url = '') => /^https:\/\/res\.cloudinary\.com\/.+\/image\/upload\//i.test(String(url).trim())

// Campos que se pueden editar de una foto o un reel (descripción, orden,
// visible y, si viene de Instagram, el link)
export const datosEditables = (cuerpo, actual) => {
  const datos = {}
  if (cuerpo.descripcion !== undefined) datos.descripcion = cuerpo.descripcion?.trim() || null
  if (cuerpo.orden !== undefined) datos.orden = parseInt(cuerpo.orden, 10) || 0
  if (cuerpo.activo !== undefined) datos.activo = Boolean(cuerpo.activo)
  if (cuerpo.url !== undefined) {
    if (actual.tipo !== 'INSTAGRAM') return { error: 'Solo se puede cambiar el link de lo que viene de Instagram' }
    if (!esLinkInstagram(cuerpo.url)) return { error: 'El link no es de Instagram' }
    datos.url = String(cuerpo.url).trim()
    datos.enlace = datos.url
  }
  return { datos }
}

// Borra el archivo de Cloudinary para no ocupar espacio (si falla, no bloquea)
export const borrarDeCloudinary = async (url, tipoRecurso = 'image') => {
  const coincidencia = String(url).match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i)
  if (!coincidencia) return
  try {
    await cloudinary.uploader.destroy(coincidencia[1], { resource_type: tipoRecurso })
  } catch (err) {
    console.error('No se pudo borrar de Cloudinary:', err?.message || err)
  }
}

// Si llega un link de Instagram y la cuenta está conectada, se trae el archivo
// real a Cloudinary (queda como ARCHIVO, guardando el link en "enlace").
// Si no está conectada, se guarda el link y se muestra el recuadro de Instagram.
export const prepararDatos = async (tipo, url, clase) => {
  if (tipo === 'INSTAGRAM' && (await estaConfigurado())) {
    const importado = await importarDeInstagram(url, clase)
    return { tipo: 'ARCHIVO', url: importado.url, enlace: importado.enlace }
  }
  return { tipo, url, enlace: tipo === 'INSTAGRAM' ? url : null }
}

export const responderError = (res, err, mensaje) => {
  if (err instanceof ErrorInstagram) return res.status(400).json({ error: err.message })
  console.error(mensaje, err?.message || err)
  res.status(500).json({ error: mensaje })
}
