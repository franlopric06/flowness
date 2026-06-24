import { useState } from 'react'

function Vibra() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-xl border border-[#D8A48F]/20 p-5 w-72">
      
      {/* Boton cerrar */}
      <button
        onClick={() => setVisible(false)}
        className="absolute top-3 right-4 text-[#A9A9A2] text-xl hover:opacity-60 transition-opacity"
      >
        ×
      </button>

      {/* Badge */}
      <p className="text-[#D8A48F] text-[10px] tracking-widest uppercase mb-1">
        También encontranos en
      </p>

      {/* Nombre */}
      <h3 className="text-[#7B9B77] font-semibold text-lg tracking-widest uppercase mb-2">
        @vibraespacio
      </h3>

      {/* Descripcion */}
      <p className="text-[#A9A9A2] text-xs leading-relaxed mb-4">
        Clases presenciales de movilidad y bienestar en Tinogasta, Catamarca.
      </p>

      {/* Boton Instagram */}
      
        <a href="https://instagram.com/vibraespacio"
        target="_blank"
        rel="noreferrer"
        className="block w-full bg-[#7B9B77] text-white text-xs tracking-widest uppercase text-center py-3 rounded-full hover:bg-[#5a7a56] transition-colors"
      >
        Seguir en Instagram
      </a>

    </div>
  )
}

export default Vibra