import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'

// Campo de búsqueda: avisa el texto un ratito después de que la persona deja de escribir
function Buscador({ alBuscar, placeholder = 'Buscar…', demora = 350 }) {
  const [texto, setTexto] = useState('')

  useEffect(() => {
    const espera = setTimeout(() => alBuscar(texto.trim()), demora)
    return () => clearTimeout(espera)
  }, [texto, demora, alBuscar])

  return (
    <div className="relative flex-1 min-w-52">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-piedra pointer-events-none" />
      <input type="text" inputMode="search" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={placeholder}
        aria-label={placeholder} className="input !pl-10 !pr-9" />
      {texto && (
        <button type="button" onClick={() => setTexto('')} aria-label="Borrar búsqueda"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 inline-flex items-center justify-center rounded-full text-piedra hover:bg-crema">
          <X size={14} />
        </button>
      )}
    </div>
  )
}

export default Buscador
