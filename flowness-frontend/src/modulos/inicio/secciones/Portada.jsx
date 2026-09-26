import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, PlayCircle } from 'lucide-react'
import VideoMuestra from '../../../compartido/componentes/VideoMuestra'
import TituloAnimado from './TituloAnimado'

const TEXTOS_POR_DEFECTO = {
  titulo: 'Flowness',
  subtitulo: 'Movilidad · Flexibilidad · Mindfulness',
  descripcion: 'Un método de movilidad, flexibilidad y mindfulness para moverte mejor y sentirte bien, cuerpo y mente en armonía.',
}

// Portada del Inicio: título, texto y botones. Si hay video de fondo cargado,
// se ve en movimiento con un velo verde encima y los textos pasan a blanco.
function Portada({ configuracion, hayClaseGratis }) {
  const titulo = configuracion.hero_titulo || TEXTOS_POR_DEFECTO.titulo
  const subtitulo = configuracion.hero_subtitulo || TEXTOS_POR_DEFECTO.subtitulo
  const descripcion = configuracion.hero_descripcion || TEXTOS_POR_DEFECTO.descripcion
  const video = configuracion.hero_video || ''

  return (
    <section className="relative isolate min-h-[88svh] flex flex-col items-center justify-center text-center px-5 py-16 overflow-hidden">
      {video && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <VideoMuestra src={video} ancho={1600} />
          <div className="absolute inset-0 bg-gradient-to-b from-verde-oscuro/70 via-verde/55 to-verde-oscuro/80" />
        </div>
      )}
      {/* Manchas de color que "respiran" (solo sin video) */}
      <div className={`absolute inset-0 -z-10 ${video ? 'hidden' : ''}`} aria-hidden="true">
        <span className="absolute -top-24 -left-24 w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full bg-verde/30 blur-3xl animate-respirar" />
        <span className="absolute top-1/3 -right-28 w-72 h-72 md:w-[26rem] md:h-[26rem] rounded-full bg-terracota/35 blur-3xl animate-respirar-lento" />
        <span className="absolute -bottom-24 left-1/4 w-72 h-72 md:w-[24rem] md:h-[24rem] rounded-full bg-arena/70 blur-3xl animate-respirar" />
      </div>

      <motion.p className={`etiqueta mb-5 ${video ? '!text-arena' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {subtitulo}
      </motion.p>
      <TituloAnimado texto={titulo} claro={!!video} />
      <motion.p className={`text-sm md:text-lg max-w-xl leading-relaxed mt-6 mb-10 whitespace-pre-line ${video ? 'text-blanco/90' : 'text-texto/75'}`}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5 }}>
        {descripcion}
      </motion.p>
      <motion.div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto max-w-xs sm:max-w-none"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.5 }}>
        <Link to="/clases" className="btn btn-primario btn-brillo">
          <PlayCircle size={16} /> {hayClaseGratis ? 'Probá una clase gratis' : 'Ver clases'}
        </Link>
        <Link to="/formacion" className={`btn ${video ? 'btn-contorno-claro' : 'btn-secundario'}`}>Formación profesional</Link>
      </motion.div>

      {/* Fundido suave hacia la sección siguiente */}
      {!video && <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-crema -z-10" aria-hidden="true" />}

      <a href="#metodo" aria-label="Bajar" className={`absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce-slow ${video ? 'text-blanco/80' : 'text-verde/70'}`}>
        <ChevronDown size={28} />
      </a>
    </section>
  )
}

export default Portada
