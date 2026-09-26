import { Star } from 'lucide-react'

// Muestra de 0 a 5 estrellas (acepta medias, por ejemplo 4.5)
function Estrellas({ valor = 0, tamano = 16, className = '' }) {
  const texto = `${String(valor).replace('.', ',')} de 5 estrellas`
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} role="img" aria-label={texto} title={texto}>
      {[1, 2, 3, 4, 5].map((n) => {
        const relleno = Math.max(0, Math.min(1, valor - (n - 1))) * 100
        return (
          <span key={n} className="relative inline-block" style={{ width: tamano, height: tamano }} aria-hidden="true">
            <Star size={tamano} className="absolute inset-0 text-arena" fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${relleno}%` }}>
              <Star size={tamano} className="text-terracota" fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        )
      })}
    </span>
  )
}

export default Estrellas
