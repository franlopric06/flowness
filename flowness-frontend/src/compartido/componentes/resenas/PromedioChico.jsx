import { Star } from 'lucide-react'

// Promedio compacto para las tarjetas: ★ 4,8 (12 opiniones)
function PromedioChico({ resumen, className = '' }) {
  if (!resumen?.cantidad) return null
  const promedio = String(resumen.promedio).replace('.', ',')
  return (
    <p className={`inline-flex items-center gap-1.5 text-xs text-texto/75 ${className}`}
      aria-label={`${promedio} de 5 estrellas, ${resumen.cantidad} opiniones`}>
      <Star size={14} className="text-terracota" fill="currentColor" strokeWidth={0} />
      <span className="font-semibold text-texto">{promedio}</span>
      <span>({resumen.cantidad} {resumen.cantidad === 1 ? 'opinión' : 'opiniones'})</span>
    </p>
  )
}

export default PromedioChico
