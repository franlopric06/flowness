// Saca el ID de un link de YouTube en cualquiera de sus formatos:
// youtube.com/watch?v=ID · youtu.be/ID · youtube.com/shorts/ID · /embed/ID · /live/ID
export const obtenerIdYoutube = (url = '') => {
  const coincidencia = String(url).match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([\w-]{11})/
  )
  return coincidencia ? coincidencia[1] : null
}

export const esLinkValido = (url = '') => !!obtenerIdYoutube(url) || /^https?:\/\/.+\.(mp4|webm|mov)(\?.*)?$/i.test(url)

export const formatearPrecio = (valor) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(valor || 0)
