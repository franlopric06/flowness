// Promociones que se cargan en Configuración (clave "promociones", en JSON).
// Cada una: { id, texto, destino, enlace, hasta, activa }
//   destino: '' (sin botón) | 'clases' | 'formacion' | 'whatsapp' | 'link'
//   hasta:   'AAAA-MM-DD' (último día que se muestra) o '' (sin vencimiento)

export const DESTINOS = [
  ['', 'Sin botón'],
  ['clases', 'Ir a Clases'],
  ['formacion', 'Ir a Formación'],
  ['whatsapp', 'Escribir por WhatsApp'],
  ['link', 'Otro link'],
]

export const PROMO_NUEVA = () => ({ id: Date.now(), texto: '', destino: 'clases', enlace: '', hasta: '', activa: true })

export function leerPromos(config = {}) {
  if (!config.promociones) return []
  try {
    const lista = JSON.parse(config.promociones)
    return Array.isArray(lista) ? lista : []
  } catch {
    return []
  }
}

// Fecha de hoy en la hora de la persona, como 'AAAA-MM-DD'
const hoy = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const estaVencida = (promo) => Boolean(promo.hasta) && promo.hasta < hoy()

// Las que se muestran ahora: activas, con texto y sin vencer
export const promosVigentes = (lista) => lista.filter((p) => p.activa && p.texto?.trim() && !estaVencida(p))

// A dónde lleva el botón de la promo. Devuelve { interno } o { externo } o null
export function destinoDePromo(promo, whatsapp) {
  if (promo.destino === 'clases') return { interno: '/clases' }
  if (promo.destino === 'formacion') return { interno: '/formacion' }
  if (promo.destino === 'whatsapp' && whatsapp) {
    return { externo: `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hola! Quiero consultar por la promo: ${promo.texto}`)}` }
  }
  if (promo.destino === 'link' && promo.enlace?.trim()) {
    const enlace = promo.enlace.trim()
    if (enlace.startsWith('/')) return { interno: enlace }
    if (/^https?:\/\//i.test(enlace)) return { externo: enlace }
  }
  return null
}
