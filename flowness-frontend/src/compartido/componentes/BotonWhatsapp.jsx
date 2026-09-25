import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import IconoWhatsapp from './IconoWhatsapp'
import { obtenerConfiguracion } from '../servicios/configuracion.servicio'

// Botón flotante de WhatsApp (abajo a la izquierda), con un anillo que late suave
function BotonWhatsapp() {
  const [numero, setNumero] = useState(null)

  useEffect(() => {
    obtenerConfiguracion()
      .then((config) => { if (config.whatsapp_numero) setNumero(config.whatsapp_numero) })
      .catch(() => {})
  }, [])

  if (!numero) return null

  return (
    <motion.a
      href={`https://wa.me/${numero}`}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-5 left-4 z-40 w-13 h-13 md:w-14 md:h-14"
      aria-label="Escribir por WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-verde/40 animate-ping-slow" aria-hidden="true" />
      <span className="relative flex items-center justify-center w-full h-full rounded-full bg-verde text-blanco ring-2 ring-blanco shadow-alta">
        <IconoWhatsapp size={26} />
      </span>
    </motion.a>
  )
}

export default BotonWhatsapp
