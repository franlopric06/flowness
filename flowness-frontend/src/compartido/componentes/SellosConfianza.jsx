import { ShieldCheck, Lock, Zap, Infinity as Siempre, Smartphone } from 'lucide-react'

// Sellos de confianza que acompañan al botón de compra y a la página de pago
const SELLOS = [
  [ShieldCheck, 'Pago 100% seguro', 'Procesado por Mercado Pago'],
  [Lock, 'Datos protegidos', 'Conexión cifrada'],
  [Zap, 'Acceso inmediato', 'Apenas se acredita el pago'],
  [Siempre, 'Para siempre', 'Queda en tu cuenta'],
  [Smartphone, 'Donde quieras', 'Celular, tablet o compu'],
]

function SellosConfianza({ compacto = false, className = '' }) {
  if (compacto) {
    return (
      <ul className={`grid grid-cols-2 gap-x-3 gap-y-2 text-[0.7rem] text-texto/70 ${className}`}>
        {SELLOS.slice(0, 4).map(([Icono, titulo]) => (
          <li key={titulo} className="flex items-center gap-1.5"><Icono size={14} className="text-verde shrink-0" /> {titulo}</li>
        ))}
      </ul>
    )
  }
  return (
    <ul className={`grid grid-cols-2 md:grid-cols-5 gap-4 ${className}`}>
      {SELLOS.map(([Icono, titulo, texto]) => (
        <li key={titulo} className="flex flex-col items-center text-center gap-2">
          <span className="icono-caja w-11 h-11 rounded-full bg-verde/15 text-verde"><Icono size={20} /></span>
          <span className="text-xs font-semibold text-texto">{titulo}</span>
          <span className="text-[0.68rem] text-piedra -mt-1">{texto}</span>
        </li>
      ))}
    </ul>
  )
}

export default SellosConfianza
