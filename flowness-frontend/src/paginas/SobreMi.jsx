import { useState, useEffect } from 'react'
import { obtenerDatosPublicos } from '../servicios/api'

function SobreMi() {
  const [sobreMi, setSobreMi] = useState(null)

  useEffect(() => {
    obtenerDatosPublicos().then(d => setSobreMi(d.sobreMi)).catch(() => {})
  }, [])

  if (!sobreMi) return (
    <main className="pt-32 min-h-screen flex items-center justify-center">
      <p className="text-[#A9A9A2]">Cargando...</p>
    </main>
  )

  return (
    <main className="pt-32 min-h-screen px-6 md:px-16 pb-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-2">Sobre mí</p>
        <h1 className="text-[#7B9B77] text-3xl font-bold tracking-widest mb-6">{sobreMi.nombre}</h1>
        {sobreMi.fotoUrl && <img src={sobreMi.fotoUrl} alt={sobreMi.nombre} className="w-48 h-48 rounded-full object-cover border-4 border-[#D8A48F]/30 mb-6" />}
        <p className="text-[#A9A9A2] text-sm mb-4">{sobreMi.titulo}</p>
        <p className="text-[#555] leading-relaxed mb-4">{sobreMi.descripcion1}</p>
        <p className="text-[#555] leading-relaxed">{sobreMi.descripcion2}</p>
      </div>
    </main>
  )
}

export default SobreMi
