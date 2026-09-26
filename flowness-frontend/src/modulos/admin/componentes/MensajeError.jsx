import { AlertCircle } from 'lucide-react'

// Mensaje de error debajo de un formulario del panel
function MensajeError({ texto, className = 'mt-4' }) {
  if (!texto) return null
  return (
    <p className={`flex items-center gap-2 text-error text-sm bg-error/5 rounded-md px-3 py-2 ${className}`}>
      <AlertCircle size={15} className="shrink-0" />{texto}
    </p>
  )
}

export default MensajeError
