import IconoInstagram from '../IconoInstagram'
import { usePerfilInstagram } from '../../hooks/usePerfilInstagram'

// Etiqueta "Ver perfil": lo único que lleva a Instagram
function VerPerfil() {
  const perfil = usePerfilInstagram()
  return (
    <a href={perfil} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
      className="absolute top-2 left-2 z-10 inline-flex items-center gap-1.5 rounded-full bg-blanco/90 backdrop-blur text-texto text-[0.62rem] font-semibold tracking-[0.1em] uppercase pl-1.5 pr-2.5 py-1 shadow-suave hover:bg-blanco">
      <span className="w-5 h-5 rounded-full bg-terracota text-blanco flex items-center justify-center"><IconoInstagram size={11} /></span>
      Ver perfil
    </a>
  )
}

export default VerPerfil
