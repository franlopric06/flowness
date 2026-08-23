import { useState, useEffect } from 'react'
import { useVibrar } from '../hooks/useVibrar'
import { obtenerConfiguracion } from '../servicios/api'

function Contacto() {
  const [config, setConfig] = useState({})
  const vibrar = useVibrar()

  useEffect(() => {
    obtenerConfiguracion().then(setConfig).catch(() => {})
  }, [])

  const whatsapp = config.whatsapp_numero ? `https://wa.me/${config.whatsapp_numero}` : '#'
  const instagram = config.instagram_url || '#'

  return (
    <main className="pt-32 min-h-screen px-6 md:px-16 pb-16">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-2">Contacto</p>
        <h1 className="text-[#7B9B77] text-3xl font-bold tracking-widest mb-10">Hablemos</h1>
        <div className="flex flex-col gap-4">
          <a href={whatsapp} target="_blank" rel="noreferrer" onClick={vibrar}
            className="bg-[#25D366] text-white text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:opacity-90 transition-colors">
            Escribir por WhatsApp
          </a>
          <a href={instagram} target="_blank" rel="noreferrer" onClick={vibrar}
            className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-[#5a7a56] transition-colors">
            Ver Instagram
          </a>
        </div>
      </div>
    </main>
  )
}

export default Contacto
