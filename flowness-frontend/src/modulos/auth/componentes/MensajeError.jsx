import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

// Error debajo de un formulario de cuenta (aparece y desaparece suave)
function MensajeError({ texto }) {
  return (
    <AnimatePresence>
      {texto && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="flex items-center gap-2 text-error text-xs bg-error/5 rounded-md px-3 py-2">
          <AlertCircle size={14} className="shrink-0" /> {texto}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

export default MensajeError
