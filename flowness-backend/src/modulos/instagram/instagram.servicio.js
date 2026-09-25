import prisma from '../../config/prisma.js'
import cloudinary from '../../config/cloudinary.js'
import entorno from '../../config/entorno.js'

// ─────────────────────────────────────────────
// Conexión con la API oficial de Instagram (Instagram API with Instagram Login).
// Sirve para traer como archivo real las fotos y videos de la cuenta de
// Flowness a partir de su link, así se ven en la página con controles propios.
//
// El token dura 60 días. Se renueva solo cada semana y el token renovado se
// guarda en la base (tabla Configuracion, clave "privado_instagram_token").
// ─────────────────────────────────────────────

const API = 'https://graph.instagram.com'
const CLAVE_TOKEN = 'privado_instagram_token'
const CLAVE_FECHA = 'privado_instagram_renovado'
const UNA_SEMANA = 7 * 24 * 60 * 60 * 1000

export class ErrorInstagram extends Error {}

const leerClave = async (clave) => (await prisma.configuracion.findUnique({ where: { clave } }))?.valor || null
const guardarClave = (clave, valor) =>
  prisma.configuracion.upsert({ where: { clave }, update: { valor }, create: { clave, valor } })

const pedir = async (ruta, token) => {
  const separador = ruta.includes('?') ? '&' : '?'
  const respuesta = await fetch(`${API}${ruta}${separador}access_token=${encodeURIComponent(token)}`)
  const datos = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok || datos.error) {
    throw new ErrorInstagram(datos.error?.message || `Instagram respondió ${respuesta.status}`)
  }
  return datos
}

// Devuelve el token vigente (o null si no se configuró), renovándolo si hace falta
const CLAVE_ORIGEN = 'privado_instagram_origen'

const obtenerToken = async () => {
  // Si en Railway se cargó un token nuevo, se empieza a usar ese
  if (entorno.instagramToken && (await leerClave(CLAVE_ORIGEN)) !== entorno.instagramToken) {
    await guardarClave(CLAVE_ORIGEN, entorno.instagramToken)
    await guardarClave(CLAVE_TOKEN, entorno.instagramToken)
    await guardarClave(CLAVE_FECHA, '0')
  }
  const token = (await leerClave(CLAVE_TOKEN)) || entorno.instagramToken
  if (!token) return null

  const renovado = Number(await leerClave(CLAVE_FECHA)) || 0
  if (Date.now() - renovado > UNA_SEMANA) {
    try {
      const nuevo = await pedir('/refresh_access_token?grant_type=ig_refresh_token', token)
      if (nuevo.access_token) {
        await guardarClave(CLAVE_TOKEN, nuevo.access_token)
        await guardarClave(CLAVE_FECHA, String(Date.now()))
        return nuevo.access_token
      }
    } catch (err) {
      // Si no se pudo renovar, se sigue usando el actual (vale 60 días)
      console.error('No se pudo renovar el token de Instagram:', err.message)
    }
  }
  return token
}

export const estaConfigurado = async () => !!(await obtenerToken())

// Estado de la conexión (para mostrar en el panel)
export const estadoConexion = async () => {
  const token = await obtenerToken()
  if (!token) return { conectado: false }
  try {
    const cuenta = await pedir('/me?fields=username', token)
    return { conectado: true, usuario: cuenta.username }
  } catch (err) {
    return { conectado: false, error: err.message }
  }
}

const codigoDeLink = (url = '') => String(url).match(/instagram\.com\/(?:reel|reels|p|tv)\/([\w-]+)/i)?.[1] || null

// Busca la publicación entre las de la cuenta conectada
const buscarPublicacion = async (link, token) => {
  const codigo = codigoDeLink(link)
  if (!codigo) throw new ErrorInstagram('El link no es de una publicación de Instagram')
  const campos = 'id,media_type,media_url,thumbnail_url,permalink,children{media_type,media_url,thumbnail_url}'
  let ruta = `/me/media?fields=${campos}&limit=50`
  for (let pagina = 0; pagina < 20 && ruta; pagina++) {
    const datos = await pedir(ruta, token)
    const encontrada = (datos.data || []).find((m) => String(m.permalink || '').includes(`/${codigo}/`))
    if (encontrada) return encontrada
    const siguiente = datos.paging?.next
    ruta = siguiente ? siguiente.replace(API, '').replace(/[?&]access_token=[^&]+/, '') : null
  }
  throw new ErrorInstagram('No encontramos esa publicación en la cuenta de Instagram conectada. Revisá que sea de Flowness.')
}

// Trae la publicación y la guarda en Cloudinary.
// clase: 'foto' | 'video'. Devuelve { url, enlace }.
export const importarDeInstagram = async (link, clase) => {
  const token = await obtenerToken()
  if (!token) throw new ErrorInstagram('Instagram no está conectado')
  const publicacion = await buscarPublicacion(link, token)

  // En los carruseles se usa el primer elemento del tipo buscado
  let medio = publicacion
  if (publicacion.media_type === 'CAROUSEL_ALBUM') {
    const hijos = publicacion.children?.data || []
    medio = hijos.find((h) => (clase === 'video' ? h.media_type === 'VIDEO' : h.media_type === 'IMAGE')) || hijos[0]
  }
  if (!medio?.media_url) throw new ErrorInstagram('Instagram no permite descargar esta publicación')

  const esVideo = medio.media_type === 'VIDEO'
  if (clase === 'foto' && esVideo) throw new ErrorInstagram('Esa publicación es un video: agregala en la pestaña Videos')
  if (clase === 'video' && !esVideo) throw new ErrorInstagram('Esa publicación es una foto: agregala en la pestaña Fotos')

  // Cloudinary descarga el archivo directo desde Instagram
  const subida = await cloudinary.uploader.upload(medio.media_url, {
    folder: esVideo ? 'flowness/videos' : 'flowness/imagenes',
    resource_type: esVideo ? 'video' : 'image',
  })
  return { url: subida.secure_url, enlace: publicacion.permalink || link }
}
