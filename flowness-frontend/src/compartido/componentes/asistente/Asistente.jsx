import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircleQuestion } from 'lucide-react'
import { usePreguntas } from '../../hooks/usePreguntas'
import { useConfiguracion } from '../../hooks/useConfiguracion'
import PanelAsistente from './PanelAsistente'

// Botón flotante "¿Dudas?" (abajo a la derecha) que abre el asistente de preguntas frecuentes.
// Las preguntas se piden recién la primera vez que se abre.
function Asistente() {
  const [abierto, setAbierto] = useState(false)
  const [usado, setUsado] = useState(false)
  const preguntas = usePreguntas(usado)
  const { whatsapp_numero: whatsapp } = useConfiguracion()

  const abrir = () => { setUsado(true); setAbierto(true) }

  return (
    <>
      <AnimatePresence>
        {!abierto && (
          <motion.button type="button" onClick={abrir} aria-label="Abrir asistente de preguntas frecuentes"
            initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
            transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}
            className="fixed bottom-5 right-4 z-40 h-13 md:h-14 rounded-full bg-verde text-blanco shadow-alta flex items-center gap-2 pl-3.5 pr-4 md:pl-4 md:pr-5">
            <MessageCircleQuestion size={22} />
            <span className="text-sm font-semibold">¿Dudas?</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {abierto && <PanelAsistente preguntas={preguntas} whatsapp={whatsapp} alCerrar={() => setAbierto(false)} />}
      </AnimatePresence>
    </>
  )
}

export default Asistente
