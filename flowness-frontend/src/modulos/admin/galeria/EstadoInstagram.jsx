import { CheckCircle2 } from 'lucide-react'
import IconoInstagram from '../../../compartido/componentes/IconoInstagram'

// Cartel que dice si la cuenta de Instagram está conectada
function EstadoInstagram({ estado }) {
  if (!estado) return null
  if (estado.conectado) {
    return (
      <p className="flex items-center gap-2 text-sm text-verde bg-verde/10 rounded-md px-3 py-2 mb-5">
        <CheckCircle2 size={16} className="shrink-0" />
        Instagram conectado{estado.usuario ? ` (@${estado.usuario})` : ''}: lo que agregues con link se trae como archivo y se ve en la página con todos los controles.
      </p>
    )
  }
  return (
    <p className="flex items-start gap-2 text-sm text-texto/80 bg-arena/50 rounded-md px-3 py-2 mb-5">
      <IconoInstagram size={16} className="shrink-0 mt-0.5 text-terracota" />
      Instagram todavía no está conectado: lo que agregues con link se muestra con el recuadro de Instagram, sin pantalla completa ni sonido.
    </p>
  )
}

export default EstadoInstagram
