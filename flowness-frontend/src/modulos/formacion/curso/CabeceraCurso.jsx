import { motion } from 'framer-motion'
import { Clock, PlayCircle, FileText } from 'lucide-react'
import { fadeUpDelay } from '../../../compartido/utilidades/animaciones'
import Volver from './Volver'

// Cabecera de la página de venta: nivel, nombre y datos rápidos
function CabeceraCurso({ curso, cantidadVideos }) {
  return (
    <header className="relative isolate overflow-hidden pt-24 md:pt-32 pb-10">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <span className="absolute -top-20 -right-16 w-72 h-72 md:w-96 md:h-96 rounded-full bg-terracota/25 blur-3xl animate-respirar" />
        <span className="absolute top-10 -left-24 w-72 h-72 rounded-full bg-verde/20 blur-3xl animate-respirar-lento" />
      </div>
      <div className="contenedor">
        <Volver />
        {curso.subtitulo && <motion.p {...fadeUpDelay(0)} className="etiqueta mt-6 mb-2">{curso.subtitulo}</motion.p>}
        <motion.h1 {...fadeUpDelay(0.08)} className="titulo text-verde text-5xl md:text-7xl leading-none mt-2">{curso.nombre}</motion.h1>
        <motion.div {...fadeUpDelay(0.16)} className="flex flex-wrap gap-2 mt-6">
          {curso.duracion && <span className="chip bg-blanco text-texto shadow-suave"><Clock size={12} className="text-terracota" /> {curso.duracion}</span>}
          {cantidadVideos > 0 && <span className="chip bg-blanco text-texto shadow-suave"><PlayCircle size={12} className="text-terracota" /> {cantidadVideos} videos</span>}
          <span className="chip bg-blanco text-texto shadow-suave"><FileText size={12} className="text-terracota" /> PDF por lección</span>
        </motion.div>
      </div>
    </header>
  )
}

export default CabeceraCurso
