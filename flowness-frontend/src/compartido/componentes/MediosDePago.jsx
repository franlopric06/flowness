import { CreditCard, Wallet, Banknote, ShieldCheck, Landmark } from 'lucide-react'

// Franja que se desliza sola con los medios de pago que acepta Mercado Pago
const MEDIOS = [
  [CreditCard, 'Visa'],
  [CreditCard, 'Mastercard'],
  [CreditCard, 'American Express'],
  [CreditCard, 'Naranja X'],
  [CreditCard, 'Cabal'],
  [Landmark, 'Tarjetas de débito'],
  [Wallet, 'Dinero en cuenta de Mercado Pago'],
  [Banknote, 'Efectivo en Rapipago y Pago Fácil'],
  [ShieldCheck, 'Pago 100% seguro'],
]

function MediosDePago({ className = '' }) {
  const lista = MEDIOS.map(([Icono, texto]) => (
    <span key={texto} className="inline-flex items-center gap-2 px-5 text-texto/75 text-xs font-medium tracking-wide whitespace-nowrap">
      <Icono size={16} className="text-verde" /> {texto}
      <span className="ml-5 w-1 h-1 rounded-full bg-terracota" aria-hidden="true" />
    </span>
  ))
  return (
    <section className={`relative overflow-hidden bg-blanco border-y border-terracota/15 py-4 ${className}`} aria-label="Medios de pago">
      <p className="sr-only">Aceptamos Visa, Mastercard, American Express, Naranja X, Cabal, débito, dinero en cuenta de Mercado Pago y efectivo.</p>
      {/* El contenido se repite dos veces para que el movimiento no tenga cortes */}
      <div className="flex w-max animate-desplazar hover:[animation-play-state:paused]" aria-hidden="true">
        <div className="flex">{lista}</div>
        <div className="flex">{lista}</div>
      </div>
      <span className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-blanco to-transparent" />
      <span className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-blanco to-transparent" />
    </section>
  )
}

export default MediosDePago
