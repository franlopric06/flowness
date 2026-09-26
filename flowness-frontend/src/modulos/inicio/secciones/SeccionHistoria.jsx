import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import ReproductorVideo from '../../../compartido/componentes/ReproductorVideo'
import TituloSeccion from '../../../compartido/componentes/TituloSeccion'
import { fadeUpScroll, fadeUpScrollDelay } from '../../../compartido/utilidades/animaciones'
import { imagenReducida } from '../../../compartido/utilidades/medios'
import { useOrientacionVideo } from '../../../compartido/hooks/useOrientacionVideo'

// Con video: "Cómo nació Flowness" con el video grande
function ConVideo({ sobreMi }) {
  return (
    <section className="bg-arena/50 py-20 md:py-28">
      <div className="contenedor max-w-5xl">
        <TituloSeccion etiqueta="La historia" titulo="Cómo nació Flowness" />
        <motion.div {...fadeUpScroll} className="rounded-xl overflow-hidden shadow-alta bg-black">
          <ReproductorVideo url={sobreMi.videoUrl} titulo="La historia de Flowness" />
        </motion.div>
        <motion.div {...fadeUpScrollDelay(0.1)} className="text-center max-w-2xl mx-auto mt-10">
          {sobreMi.nombre && <h3 className="titulo text-verde text-3xl md:text-4xl mb-1">{sobreMi.nombre}</h3>}
          {sobreMi.titulo && <p className="text-piedra text-sm tracking-wide mb-5">{sobreMi.titulo}</p>}
          {sobreMi.descripcion1 && <p className="text-texto/80 text-sm md:text-base leading-relaxed mb-7 line-clamp-4 whitespace-pre-line">{sobreMi.descripcion1}</p>}
          <Link to="/sobre-mi" className="btn btn-secundario">Conocé más sobre mí <ArrowRight size={16} /></Link>
        </motion.div>
      </div>
    </section>
  )
}

// Foto (o video vertical tipo reel) con un marco terracota y el texto al lado
function ConFoto({ sobreMi, videoVertical = false }) {
  return (
    <section className="bg-arena/50 py-20 md:py-28">
      <div className="contenedor max-w-5xl flex flex-col md:flex-row gap-12 md:gap-16 items-center">
        {videoVertical && (
          <motion.div {...fadeUpScroll} className="relative shrink-0 w-60 md:w-72">
            <span className="absolute inset-0 translate-x-3 translate-y-3 rounded-xl border-2 border-terracota" aria-hidden="true" />
            <div className="relative rounded-xl overflow-hidden shadow-alta">
              <ReproductorVideo url={sobreMi.videoUrl} titulo="La historia de Flowness" vertical />
            </div>
          </motion.div>
        )}
        {!videoVertical && sobreMi.fotoUrl && (
          <motion.div {...fadeUpScroll} className="relative shrink-0">
            <span className="absolute inset-0 translate-x-3 translate-y-3 rounded-xl border-2 border-terracota" aria-hidden="true" />
            <img src={imagenReducida(sobreMi.fotoUrl, 600)} alt={sobreMi.nombre} className="relative w-60 h-72 md:w-72 md:h-88 rounded-xl object-cover shadow-alta" />
          </motion.div>
        )}
        <motion.div {...fadeUpScrollDelay(0.15)} className="text-center md:text-left">
          <p className="etiqueta mb-3">Sobre mí</p>
          <h2 className="titulo text-verde text-4xl md:text-5xl mb-2">{sobreMi.nombre}</h2>
          <p className="text-piedra text-sm tracking-wide mb-5">{sobreMi.titulo}</p>
          <p className="text-texto/80 text-sm md:text-base leading-relaxed mb-7 line-clamp-6 whitespace-pre-line">{sobreMi.descripcion1}</p>
          <Link to="/sobre-mi" className="btn btn-secundario">Conocé mi historia <ArrowRight size={16} /></Link>
        </motion.div>
      </div>
    </section>
  )
}

// Sobre Florencia: con el video de la historia si está cargado, si no con la foto.
// Video horizontal: grande y centrado. Vertical (tipo reel): al costado del texto.
function SeccionHistoria({ sobreMi }) {
  const orientacion = useOrientacionVideo(sobreMi?.videoUrl)
  if (!sobreMi) return null
  if (!sobreMi.videoUrl) return <ConFoto sobreMi={sobreMi} />
  if (!orientacion) return null // un instante, mientras se averigua el formato
  return orientacion === 'vertical' ? <ConFoto sobreMi={sobreMi} videoVertical /> : <ConVideo sobreMi={sobreMi} />
}

export default SeccionHistoria
