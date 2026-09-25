import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { escucharAvisos } from '../utilidades/avisos'

const ESTILOS = {
  exito: { icono: CheckCircle2, color: 'text-exito', borde: 'border-l-exito' },
  error: { icono: AlertCircle, color: 'text-error', borde: 'border-l-error' },
  alerta: { icono: AlertTriangle, color: 'text-alerta', borde: 'border-l-alerta' },
  info: { icono: Info, color: 'text-verde', borde: 'border-l-verde' },
}

let contador = 0

// Muestra los avisos de éxito / error arriba de la pantalla.
// Entran deslizando y se van solos a los 4 segundos (los de error, a los 6).
function Avisos() {
  const [avisos, setAvisos] = useState([])

  useEffect(() => escucharAvisos(({ texto, tipo }) => {
    const id = ++contador
    setAvisos((lista) => [...lista.slice(-2), { id, texto, tipo }])
    setTimeout(() => setAvisos((lista) => lista.filter((a) => a.id !== id)), tipo === 'error' ? 6000 : 4000)
  }), [])

  const cerrar = (id) => setAvisos((lista) => lista.filter((a) => a.id !== id))

  return (
    <div className="fixed top-3 inset-x-3 z-[100] flex flex-col items-center gap-2 pointer-events-none md:top-24 md:right-6 md:left-auto md:items-end" aria-live="polite">
      <AnimatePresence initial={false}>
        {avisos.map(({ id, texto, tipo }) => {
          const { icono: Icono, color, borde } = ESTILOS[tipo] || ESTILOS.info
          return (
            <motion.div
              key={id}
              layout
              initial={{ opacity: 0, y: -24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              role={tipo === 'error' ? 'alert' : 'status'}
              className={`pointer-events-auto w-full max-w-sm flex items-start gap-3 bg-blanco rounded-lg shadow-alta border border-l-4 border-arena ${borde} px-4 py-3`}
            >
              <Icono size={20} className={`${color} shrink-0 mt-0.5`} />
              <p className="flex-1 text-sm text-texto leading-snug">{texto}</p>
              <button onClick={() => cerrar(id)} aria-label="Cerrar aviso" className="text-piedra hover:text-texto">
                <X size={16} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default Avisos
