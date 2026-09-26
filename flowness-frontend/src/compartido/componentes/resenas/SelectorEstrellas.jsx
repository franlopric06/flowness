import { useState } from 'react'
import { Star } from 'lucide-react'

const TEXTOS = ['', 'No me gustó', 'Regular', 'Buena', 'Muy buena', '¡Excelente!']

// Para elegir de 1 a 5 estrellas (con el mouse o el dedo)
function SelectorEstrellas({ valor, alCambiar }) {
  const [encima, setEncima] = useState(0)
  const mostrado = encima || valor

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1" role="radiogroup" aria-label="Tu puntaje" onMouseLeave={() => setEncima(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={valor === n} aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
            onClick={() => alCambiar(n)} onMouseEnter={() => setEncima(n)}
            className="p-0.5 transition-transform hover:scale-110 active:scale-95">
            <Star size={30} strokeWidth={1.5} fill={n <= mostrado ? 'currentColor' : 'none'}
              className={n <= mostrado ? 'text-terracota' : 'text-piedra/60'} />
          </button>
        ))}
      </div>
      <span className="text-sm text-texto/70 min-w-24">{TEXTOS[mostrado]}</span>
    </div>
  )
}

export default SelectorEstrellas
