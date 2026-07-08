import { useState } from 'react'

function Vibra() {
  const [visible, setVisible] = useState(() => {
    return !localStorage.getItem('vibra_cerrado')
  })

  const cerrar = () => {
    localStorage.setItem('vibra_cerrado', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-4 z-50 bg-white rounded-2xl shadow-xl border border-[#D8A48F]/20 p-3 w-52 md:p-5 md:w-72">
      
      <button
        onClick={cerrar}
        className="absolute top-2 right-3 text-[#A9A9A2] text-xl hover:opacity-60 transition-opacity"
      >
        ×
      </button>

      <p className="text-[#D8A48F] text-[9px] tracking-widest uppercase mb-1">
        También encontranos en
      </p>

      <h3 className="text-[#7B9B77] font-semibold text-sm tracking-widest uppercase mb-1 md:text-lg md:mb-2">
        @vibraespacio
      </h3>

      <p className="text-[#A9A9A2] text-[10px] leading-relaxed mb-3 md:text-xs md:mb-4">
        Clases presenciales de movilidad y bienestar en Tinogasta, Catamarca.
      </p>

      
        <a href="https://instagram.com/vibraespacio"
        target="_blank"
        rel="noreferrer"
        className="block w-full bg-[#7B9B77] text-white text-[10px] tracking-widest uppercase text-center py-2 rounded-full hover:bg-[#5a7a56] transition-colors md:text-xs md:py-3"
      >
        Seguir en Instagram
      </a>

    </div>
  )
}

export default Vibra