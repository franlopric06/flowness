import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function Clases() {
  const [fases, setFases] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/fases`)
      .then(res => res.json())
      .then(data => setFases(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  if (fases.length === 0) {
    return (
      <section id="fases" className="bg-white px-6 py-16 md:px-16">
        <p className="text-[10px] tracking-widest uppercase text-[#D8A48F] mb-3 text-center">El método</p>
        <h2 className="text-3xl font-light text-gray-800 text-center mb-12 md:text-4xl">
          Seis fases hacia el <span className="text-[#7B9B77] font-semibold">bienestar</span>
        </h2>
        <p className="text-center text-[#A9A9A2] text-sm">Próximamente se cargarán las fases del método.</p>
      </section>
    )
  }

  return (
    <section id="fases" className="bg-white px-6 py-16 md:px-16">
      <p className="text-[10px] tracking-widest uppercase text-[#D8A48F] mb-3 text-center">El método</p>
      <h2 className="text-3xl font-light text-gray-800 text-center mb-12 md:text-4xl">
        Seis fases hacia el <span className="text-[#7B9B77] font-semibold">bienestar</span>
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {fases.map((fase) => (
          <Link
            key={fase.id}
            to={`/clases?fase=${fase.numero}`}
            className="bg-[#F5F0EB] rounded-2xl p-8 border border-[#D8A48F]/15 hover:shadow-lg hover:border-[#7B9B77]/30 transition-all cursor-pointer"
          >
            <p className="text-5xl font-light text-[#7B9B77]/20 mb-4">{fase.numero}</p>
            <p className="text-[#7B9B77] font-semibold mb-2">{fase.nombre}</p>
            <p className="text-[#A9A9A2] text-sm leading-relaxed">{fase.descripcion}</p>
            <p className="text-[#D8A48F] text-xs tracking-widest uppercase mt-4 hover:opacity-70">
              Ver clase →
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Clases