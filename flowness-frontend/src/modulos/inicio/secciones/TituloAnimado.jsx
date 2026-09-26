import { motion } from 'framer-motion'

// Título de la portada que aparece letra por letra (o palabra por palabra)
function TituloAnimado({ texto, claro = false }) {
  const partes = texto.includes(' ') ? texto.split(' ') : [...texto]
  const separador = texto.includes(' ') ? ' ' : ''
  return (
    <h1 className={`titulo text-6xl sm:text-7xl md:text-8xl leading-none ${claro ? 'text-blanco drop-shadow-lg' : 'text-verde'}`} aria-label={texto}>
      {partes.map((parte, i) => (
        <motion.span key={i} aria-hidden="true" className="inline-block"
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.3 + i * 0.07, ease: 'easeOut' }}>
          {parte}{i < partes.length - 1 ? separador : ''}
        </motion.span>
      ))}
    </h1>
  )
}

export default TituloAnimado
