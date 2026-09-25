import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import IconoInstagram from './IconoInstagram'
import { obtenerConfiguracion } from '../servicios/configuracion.servicio'

// Invitación a seguir a Flow en Instagram.
// Aparece a los pocos segundos y, si la persona la cierra, no vuelve
// a aparecer mientras siga navegando el sitio.
function PopupFlowness() {
  const [visible, setVisible] = useState(false)
  const [config, setConfig] = useState({})

  useEffect(() => {
    obtenerConfiguracion().then(setConfig).catch(() => {})
    let cerrado = false
    try { cerrado = sessionStorage.getItem('popupFlownessCerrado') === '1' } catch { /* sin almacenamiento */ }
    if (cerrado) return
    const temporizador = setTimeout(() => setVisible(true), 4000)
    return () => clearTimeout(temporizador)
  }, [])

  const cerrar = () => {
    setVisible(false)
    try { sessionStorage.setItem('popupFlownessCerrado', '1') } catch { /* sin almacenamiento */ }
  }

  const instagram = config.instagram_url || 'https://instagram.com/flownessargentina'
  const popupTexto = config.popup_texto || 'Movilidad y bienestar para tu cuerpo y mente.'
  const popupInstagram = config.popup_instagram || '@flownessargentina'

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="fixed bottom-20 right-4 z-40 w-60 card shadow-alta p-4 md:bottom-6 md:w-72 md:p-5"
        >
          <button onClick={cerrar} aria-label="Cerrar" className="absolute top-2 right-2 p-1 text-piedra hover:text-texto">
            <X size={18} />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <span className="icono-caja bg-terracota/15 text-terracota"><IconoInstagram size={20} /></span>
            <div className="min-w-0">
              <p className="etiqueta">Seguinos</p>
              <p className="text-verde font-semibold text-sm truncate">{popupInstagram}</p>
            </div>
          </div>
          <p className="text-piedra text-xs leading-relaxed mb-4">{popupTexto}</p>
          <a href={instagram} target="_blank" rel="noreferrer" onClick={cerrar} className="btn btn-primario btn-chico w-full">
            Seguir en Instagram
          </a>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default PopupFlowness
