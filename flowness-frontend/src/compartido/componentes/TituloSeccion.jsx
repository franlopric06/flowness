import { motion } from 'framer-motion'
import { fadeUpScroll } from '../utilidades/animaciones'

// Encabezado de cada sección: etiqueta chiquita + título con la fuente del manual
// + una línea terracota que se dibuja al aparecer + texto opcional.
function TituloSeccion({ etiqueta, titulo, texto, claro = false, como: Etiqueta = 'h2', className = '' }) {
  return (
    <motion.div {...fadeUpScroll} className={`text-center max-w-2xl mx-auto mb-10 md:mb-14 ${className}`}>
      {etiqueta && <p className={`etiqueta mb-3 ${claro ? '!text-arena' : ''}`}>{etiqueta}</p>}
      <Etiqueta className={`titulo text-3xl md:text-5xl leading-tight ${claro ? 'text-blanco' : 'text-verde'}`}>{titulo}</Etiqueta>
      <motion.span
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className="block h-px w-16 mx-auto my-5 bg-terracota origin-center" aria-hidden="true"
      />
      {texto && <p className={`text-sm md:text-base leading-relaxed ${claro ? 'text-blanco/85' : 'text-texto/75'}`}>{texto}</p>}
    </motion.div>
  )
}

export default TituloSeccion
