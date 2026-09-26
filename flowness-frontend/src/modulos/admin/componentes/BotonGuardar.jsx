import { Loader2, Save } from 'lucide-react'
import { botonVerde } from './estilos'

// Botón verde de "Guardar" que muestra "Guardando…" mientras trabaja
function BotonGuardar({ guardando, texto = 'Guardar', onClick, disabled = false, className = '' }) {
  return (
    <button onClick={onClick} disabled={guardando || disabled} className={`${botonVerde} ${className}`}>
      {guardando ? <><Loader2 size={14} className="animate-spin" /> Guardando…</> : <><Save size={14} /> {texto}</>}
    </button>
  )
}

export default BotonGuardar
