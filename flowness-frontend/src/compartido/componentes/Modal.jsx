import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { modalSlideUp } from '../utilidades/animaciones'

// Ventana modal genérica: fondo oscuro, sube desde abajo, se cierra con Escape o tocando afuera
function Modal({ abierto, alCerrar, titulo, children, ancho = 'max-w-3xl' }) {
  useEffect(() => {
    if (!abierto) return
    const alApretar = (e) => { if (e.key === 'Escape') alCerrar() }
    window.addEventListener('keydown', alApretar)
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', alApretar)
      document.body.style.overflow = overflowAnterior
    }
  }, [abierto, alCerrar])

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={alCerrar}>
          <motion.div {...modalSlideUp} exit={{ opacity: 0, y: 40 }} role="dialog" aria-modal="true" aria-label={titulo}
            className={`bg-blanco w-full ${ancho} rounded-xl p-4 md:p-7 max-h-[90svh] overflow-y-auto shadow-alta`}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start gap-4 mb-4">
              <h2 className="titulo text-verde text-2xl md:text-3xl">{titulo}</h2>
              <button onClick={alCerrar} aria-label="Cerrar"
                className="shrink-0 w-9 h-9 rounded-full bg-crema text-texto/70 hover:bg-arena flex items-center justify-center transition-colors">
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
