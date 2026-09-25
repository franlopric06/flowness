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
