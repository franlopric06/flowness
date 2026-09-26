import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

// Enlace "← Formación" arriba de la página de un curso
function Volver() {
  return (
    <Link to="/formacion" className="inline-flex items-center gap-1.5 text-piedra text-[0.7rem] tracking-[0.18em] uppercase hover:text-verde transition-colors group">
      <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Formación
    </Link>
  )
}

export default Volver
