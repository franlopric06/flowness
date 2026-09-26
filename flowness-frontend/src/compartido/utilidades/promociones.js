// Promociones que se cargan en Configuración (clave "promociones", en JSON).
// Cada una: { id, texto, destino, enlace, hasta, activa }
//   destino: '' (sin botón) | 'clases' | 'formacion' | 'whatsapp' | 'link'
//   hasta:   'AAAA-MM-DD' (último día que se muestra) o '' (sin vencimiento)

import { resolverDestino } from './destinos'
import { estaVencida } from './fechas'

export { DESTINOS } from './destinos'
export { estaVencida } from './fechas'

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

// Las que se muestran ahora: activas, con texto y sin vencer
export const promosVigentes = (lista) => lista.filter((p) => p.activa && p.texto?.trim() && !estaVencida(p))

// A dónde lleva el botón de la promo. Devuelve { interno } o { externo } o null
export const destinoDePromo = (promo, whatsapp) =>
  resolverDestino(promo, whatsapp, `Hola! Quiero consultar por la promo: ${promo.texto}`)
