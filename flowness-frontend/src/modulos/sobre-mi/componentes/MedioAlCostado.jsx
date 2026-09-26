import { motion } from 'framer-motion'
import ReproductorVideo from '../../../compartido/componentes/ReproductorVideo'
import { imagenReducida } from '../../../compartido/utilidades/medios'

// Columna izquierda de "Sobre mí": la foto, o el video si es vertical (tipo reel),
// con el marco terracota de la marca
function MedioAlCostado({ sobreMi, conVideo }) {
  return (
    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
      className="relative mx-auto md:mx-0 w-64 md:w-full md:sticky md:top-28">
      <span className="absolute inset-0 translate-x-4 translate-y-4 rounded-xl border-2 border-terracota" aria-hidden="true" />
      {conVideo ? (
        <div className="relative rounded-xl overflow-hidden shadow-alta">
          <ReproductorVideo url={sobreMi.videoUrl} titulo="La historia de Flowness" vertical />
        </div>
      ) : (
        <img src={imagenReducida(sobreMi.fotoUrl, 800)} alt={sobreMi.nombre}
          className="relative w-full aspect-[4/5] rounded-xl object-cover shadow-alta" />
      )}
    </motion.div>
  )
}

export default MedioAlCostado
