import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import CabeceraPagina from '../../compartido/componentes/CabeceraPagina'
import IconoInstagram from '../../compartido/componentes/IconoInstagram'
import IconoWhatsapp from '../../compartido/componentes/IconoWhatsapp'
import { fadeUpDelay } from '../../compartido/utilidades/animaciones'
import { obtenerConfiguracion } from '../../compartido/servicios/configuracion.servicio'

function Contacto() {
  const [config, setConfig] = useState({})

  useEffect(() => {
    obtenerConfiguracion().then(setConfig).catch(() => {})
  }, [])

  const canales = [
    config.whatsapp_numero && {
      href: `https://wa.me/${config.whatsapp_numero}`, icono: IconoWhatsapp, titulo: 'WhatsApp',
      texto: 'Escribime para consultas sobre clases o la formación.', color: 'bg-verde text-blanco',
    },
    {
      href: config.instagram_url || 'https://instagram.com/flownessargentina', icono: IconoInstagram, titulo: 'Instagram',
      texto: config.popup_instagram || '@flownessargentina', color: 'bg-terracota text-blanco',
    },
  ].filter(Boolean)

  return (
    <main className="min-h-screen pb-20">
      <CabeceraPagina etiqueta="Contacto" titulo="Hablemos" texto="¿Tenés dudas sobre las clases o la formación? Escribime por donde te quede más cómodo." />

      <div className="contenedor max-w-2xl grid gap-4">
        {canales.map((canal, i) => (
          <motion.a key={canal.titulo} {...fadeUpDelay(0.2 + i * 0.1)} href={canal.href} target="_blank" rel="noreferrer"
            className="card card-elevable group flex items-center gap-4 p-5 md:p-6">
            <span className={`icono-caja w-14 h-14 rounded-2xl ${canal.color}`}><canal.icono size={26} /></span>
            <div className="flex-1 min-w-0">
              <p className="titulo text-verde text-2xl">{canal.titulo}</p>
              <p className="text-texto/70 text-sm truncate">{canal.texto}</p>
            </div>
            <ArrowUpRight size={22} className="text-verde shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </motion.a>
        ))}
        <motion.p {...fadeUpDelay(0.45)} className="flex items-center justify-center gap-2 text-piedra text-sm mt-6">
          <MapPin size={16} /> Tinogasta, Catamarca · Argentina
        </motion.p>
      </div>
    </main>
  )
}

export default Contacto
