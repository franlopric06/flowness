import { motion } from 'framer-motion'
import { fadeUp } from '../utilidades/animaciones'

// Mensaje centrado con ícono para listas vacías o errores de carga
function EstadoVacio({ icono: Icono, titulo, texto, error = false, children }) {
  return (
    <motion.div {...fadeUp} className="max-w-md mx-auto text-center py-12">
      {Icono && (
        <span className={`icono-caja w-16 h-16 rounded-full mb-5 ${error ? 'bg-error/10 text-error' : 'bg-verde/15 text-verde'}`}>
          <Icono size={28} />
        </span>
      )}
      <p className="titulo text-verde text-2xl mb-2">{titulo}</p>
      {texto && <p className="text-texto/70 text-sm leading-relaxed">{texto}</p>}
      {children && <div className="mt-6">{children}</div>}
    </motion.div>
  )
}

export default EstadoVacio
