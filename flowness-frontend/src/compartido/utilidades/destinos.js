// A dónde puede llevar el botón de una promo o de un aviso.
// Se usa en la barra de promociones y en los avisos del Inicio.

export const DESTINOS = [
  ['', 'Sin botón'],
  ['clases', 'Ir a Clases'],
  ['formacion', 'Ir a Formación'],
  ['whatsapp', 'Escribir por WhatsApp'],
  ['link', 'Otro link'],
]

// Devuelve { interno } (página del sitio), { externo } (otro sitio) o null.
// mensaje: texto que ya aparece escrito si el botón abre WhatsApp.
export function resolverDestino({ destino, enlace }, whatsapp, mensaje = 'Hola! Quiero hacer una consulta') {
  if (destino === 'clases') return { interno: '/clases' }
  if (destino === 'formacion') return { interno: '/formacion' }
  if (destino === 'whatsapp' && whatsapp) {
    return { externo: `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}` }
  }
  if (destino === 'link' && enlace?.trim()) {
    const link = enlace.trim()
    if (link.startsWith('/')) return { interno: link }
    if (/^https?:\/\//i.test(link)) return { externo: link }
  }
  return null
}
