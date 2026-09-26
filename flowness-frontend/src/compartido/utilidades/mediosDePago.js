import { CreditCard, Wallet, Banknote, ShieldCheck, Landmark, CalendarClock, BadgePercent } from 'lucide-react'

// Todos los medios que se pueden mostrar en la franja de pagos.
// En Configuración se elige cuáles se ven (se guarda la lista de "id").
export const CATALOGO_MEDIOS = [
  { id: 'visa', Icono: CreditCard, texto: 'Visa' },
  { id: 'mastercard', Icono: CreditCard, texto: 'Mastercard' },
  { id: 'amex', Icono: CreditCard, texto: 'American Express' },
  { id: 'naranja', Icono: CreditCard, texto: 'Naranja X' },
  { id: 'cabal', Icono: CreditCard, texto: 'Cabal' },
  { id: 'debito', Icono: Landmark, texto: 'Tarjetas de débito' },
  { id: 'cuotas', Icono: CalendarClock, texto: 'Pagá en cuotas' },
  { id: 'dinero_mp', Icono: Wallet, texto: 'Dinero en cuenta de Mercado Pago' },
  { id: 'efectivo', Icono: Banknote, texto: 'Efectivo en Rapipago y Pago Fácil' },
  { id: 'seguro', Icono: ShieldCheck, texto: 'Pago 100% seguro' },
]

// Lo que se ve si todavía no se configuró nada (igual que antes)
const POR_DEFECTO = { activos: ['visa', 'mastercard', 'amex', 'naranja', 'cabal', 'debito', 'dinero_mp', 'efectivo', 'seguro'], extras: [] }

export const ICONO_EXTRA = BadgePercent

// Lee lo guardado en Configuración (clave "medios_pago", en formato JSON)
export function leerMedios(config = {}) {
  if (!config.medios_pago) return POR_DEFECTO
  try {
    const guardado = JSON.parse(config.medios_pago)
    return {
      activos: Array.isArray(guardado.activos) ? guardado.activos : POR_DEFECTO.activos,
      extras: Array.isArray(guardado.extras) ? guardado.extras.filter((t) => typeof t === 'string' && t.trim()) : [],
    }
  } catch {
    return POR_DEFECTO
  }
}

// Arma la lista para dibujar: los del catálogo en su orden + los textos propios
export function itemsDeLaFranja({ activos, extras }) {
  const delCatalogo = CATALOGO_MEDIOS.filter((m) => activos.includes(m.id))
  const propios = extras.map((texto) => ({ id: `extra-${texto}`, Icono: ICONO_EXTRA, texto }))
  return [...delCatalogo, ...propios]
}
