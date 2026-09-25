import { motion } from 'framer-motion'
import { fadeUpDelay } from '../utilidades/animaciones'

// Cabecera de las páginas internas (Clases, Formación, Galería…):
// fondo crema con manchas de color suaves, etiqueta, título y texto.
function CabeceraPagina({ etiqueta, titulo, texto, children }) {
  return (
    <header className="relative isolate overflow-hidden pt-28 pb-12 md:pt-36 md:pb-16 text-center">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <span className="absolute -top-20 -left-16 w-64 h-64 md:w-96 md:h-96 rounded-full bg-verde/20 blur-3xl animate-respirar" />
        <span className="absolute -top-10 -right-20 w-64 h-64 md:w-96 md:h-96 rounded-full bg-terracota/25 blur-3xl animate-respirar-lento" />
      </div>
      <div className="contenedor max-w-3xl">
        {etiqueta && <motion.p {...fadeUpDelay(0)} className="etiqueta mb-3">{etiqueta}</motion.p>}
        <motion.h1 {...fadeUpDelay(0.08)} className="titulo text-verde text-4xl md:text-6xl leading-tight">{titulo}</motion.h1>
        <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.25 }}
          className="block h-px w-16 mx-auto my-5 bg-terracota" aria-hidden="true" />
        {texto && <motion.p {...fadeUpDelay(0.16)} className="text-texto/75 text-sm md:text-base leading-relaxed">{texto}</motion.p>}
        {children}
      </div>
    </header>
  )
}

export default CabeceraPagina
