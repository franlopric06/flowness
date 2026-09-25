// Utilidades para mostrar fotos de Cloudinary y reels de Instagram

// Pide a Cloudinary una versión más liviana de la imagen (ancho máximo y
// formato/calidad automáticos). Si no es de Cloudinary, la deja igual.
export const imagenReducida = (url = '', ancho = 800) =>
  url.includes('res.cloudinary.com') && url.includes('/upload/')
    ? url.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${ancho}/`)
    : url

// Saca el tipo y el código de un link de Instagram:
// instagram.com/reel/CODIGO · /reels/CODIGO · /p/CODIGO · /tv/CODIGO
export const leerLinkInstagram = (url = '') => {
  const coincidencia = String(url).match(/instagram\.com\/(reel|reels|p|tv)\/([\w-]+)/i)
  if (!coincidencia) return null
  const tipo = coincidencia[1].toLowerCase() === 'reels' ? 'reel' : coincidencia[1].toLowerCase()
  return { tipo, codigo: coincidencia[2] }
}

export const esLinkInstagram = (url) => !!leerLinkInstagram(url)

// Dirección para mostrar el reel dentro de la página
export const urlEmbedInstagram = (url) => {
  const datos = leerLinkInstagram(url)
  return datos ? `https://www.instagram.com/${datos.tipo}/${datos.codigo}/embed/` : null
}

// Los PDF guardados en Cloudinary no se abren bien directo en el navegador:
// se muestran con el visor de Google Docs
export const urlVisorPdf = (url = '') => `https://docs.google.com/viewer?url=${encodeURIComponent(url)}`

// ── Videos cortos de muestra (tarjetas) ─────────
// Cloudinary achica el video, lo corta a los primeros 20 segundos, le saca
// el sonido y lo comprime; así carga rápido aunque el original sea pesado.
export const esVideoCloudinary = (url = '') => /res\.cloudinary\.com\/.+\/video\/upload\//.test(url)

export const videoMuestra = (url = '', ancho = 720) =>
  esVideoCloudinary(url)
    ? url.replace('/upload/', `/upload/eo_20,ac_none,q_auto,vc_auto,c_limit,w_${ancho}/`).replace(/\.[a-z0-9]+$/i, '.mp4')
    : url

// Imagen fija del primer segundo del video (se ve mientras carga)
export const portadaVideo = (url = '', ancho = 720) =>
  esVideoCloudinary(url)
    ? url.replace('/upload/', `/upload/so_1,q_auto,c_limit,w_${ancho}/`).replace(/\.[a-z0-9]+$/i, '.jpg')
    : ''
