import { motion } from 'framer-motion'
import { Clock, Lock, PlayCircle, Sparkles, CheckCircle2 } from 'lucide-react'
import MediaTarjeta from '../../../compartido/componentes/MediaTarjeta'
import { fadeUpScrollDelay } from '../../../compartido/utilidades/animaciones'
import AccionClase from './AccionClase'

// Tarjeta de una clase en el catálogo: adelanto, etiquetas, texto y botón
function TarjetaClase({ clase, indice, alVer }) {
  return (
    <motion.article {...fadeUpScrollDelay((indice % 3) * 0.08)} className="card card-elevable group flex flex-col">
      <div className="relative aspect-video bg-gradient-to-br from-verde/25 to-terracota/25 overflow-hidden">
        <MediaTarjeta muestraUrl={clase.muestraUrl} imagenUrl={clase.miniaturaUrl} alt={clase.nombre} />

        <div className="absolute top-3 left-3 flex gap-2">
          {clase.esGratis && <span className="chip chip-terracota"><Sparkles size={12} /> Gratis</span>}
          {clase.comprada && <span className="chip chip-verde"><CheckCircle2 size={12} /> Comprada</span>}
        </div>
        {!clase.tieneAcceso && (
          <span className="absolute top-3 right-3 bg-blanco/90 text-verde rounded-full h-8 w-8 flex items-center justify-center shadow-suave" title="Bloqueada">
            <Lock size={15} />
          </span>
        )}
        {clase.duracion && (
          <span className="absolute bottom-3 right-3 bg-black/55 backdrop-blur text-blanco text-[0.65rem] tracking-wider px-2 py-1 rounded-md flex items-center gap-1">
            <Clock size={11} /> {clase.duracion}
          </span>
        )}
        {clase.tieneAcceso && (
          <button onClick={alVer} aria-label={`Ver ${clase.nombre}`}
            className="absolute inset-0 flex items-center justify-center bg-verde/0 hover:bg-verde/25 transition-colors">
            <PlayCircle size={52} className="text-blanco drop-shadow opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
          </button>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="titulo text-verde text-2xl mb-2">{clase.nombre}</h3>
        <p className="text-texto/70 text-sm leading-relaxed mb-6 flex-1 whitespace-pre-line line-clamp-4">{clase.descripcion}</p>
        <AccionClase clase={clase} alVer={alVer} />
      </div>
    </motion.article>
  )
}

export default TarjetaClase
