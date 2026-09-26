import { GraduationCap, Clapperboard } from 'lucide-react'
import { fechaHora, formatearPrecio, productoDeCompra, ESTADO_PAGO } from './formato'

// Una compra: quién, qué, cuándo, cuánto y cómo quedó el pago
function FilaCompra({ compra, alVerPersona }) {
  const estado = ESTADO_PAGO[compra.estado] || ESTADO_PAGO.PENDIENTE
  const Icono = compra.curso ? GraduationCap : Clapperboard

  return (
    <li className="px-4 py-3 grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-1 items-center">
      <span className="w-9 h-9 row-span-2 rounded-full bg-crema text-verde flex items-center justify-center"><Icono size={16} /></span>
      <p className="text-sm text-texto truncate">{productoDeCompra(compra)}</p>
      <p className="text-sm font-semibold text-texto text-right">{formatearPrecio(compra.monto)}</p>
      <p className="text-xs text-piedra truncate">
        <button type="button" onClick={() => alVerPersona(compra.usuario.id)} className="text-verde hover:underline">{compra.usuario?.nombre}</button>
        {' '}· {fechaHora(compra.creadoEn)} · N° {compra.id}
      </p>
      <span className={`chip justify-self-end ${estado.clase}`}>{estado.texto}</span>
    </li>
  )
}

export default FilaCompra
