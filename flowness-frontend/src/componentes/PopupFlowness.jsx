import { useState, useEffect } from 'react'
import { useVibrar } from '../hooks/useVibrar'
import { obtenerConfiguracion } from '../servicios/api'

function PopupFlowness() {
  const [visible, setVisible] = useState(true)
  const [config, setConfig] = useState({})
  const vibrar = useVibrar()

  useEffect(() => {
    obtenerConfiguracion()
      .then(setConfig)
      .catch(() => {})
  }, [])

  if (!visible) return null

  const instagram = config.instagram_url || 'https://instagram.com/flowness'
  const popupTexto = config.popup_texto || 'Movilidad y bienestar para tu cuerpo y mente.'
  const popupInstagram = config.popup_instagram || '@flowness'

  return (
    <div className="fixed bottom-6 right-4 z-50 bg-white rounded-2xl shadow-xl border border-[#D8A48F]/20 p-3 w-52 md:p-5 md:w-72">
      <button
        onClick={() => { vibrar(); setVisible(false) }}
        className="absolute top-2 right-3 text-[#A9A9A2] text-xl hover:opacity-60 transition-opacity"
      >
        ×
      </button>
      <p className="text-[#D8A48F] text-[9px] tracking-widest uppercase mb-1">
        Seguinos en Instagram
      </p>
      <h3 className="text-[#7B9B77] font-semibold text-sm tracking-widest uppercase mb-1 md:text-lg md:mb-2">
        {popupInstagram}
      </h3>
      <p className="text-[#A9A9A2] text-[10px] leading-relaxed mb-3 md:text-xs md:mb-4">
        {popupTexto}
      </p>
      <a
        href={instagram}
        target="_blank"
        rel="noreferrer"
        onClick={vibrar}
        className="block w-full bg-[#7B9B77] text-white text-[10px] tracking-widest uppercase text-center py-2 rounded-full hover:bg-[#5a7a56] transition-colors md:text-xs md:py-3"
      >
        Seguir en Instagram
      </a>
    </div>
  )
}

export default PopupFlowness
