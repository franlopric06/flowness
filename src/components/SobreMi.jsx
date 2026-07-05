import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function SobreMi() {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/sobre-mi`)
      .then(res => res.json())
      .then(data => {
        setDatos(data)
        setCargando(false)
      })
      .catch(() => setCargando(false))
  }, [])

  if (cargando) return null

  if (!datos) return (
    <section className="bg-white px-6 pt-8 pb-4 md:px-16 md:py-10">
      <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-2 text-center">
        Sobre mí
      </p>
      <h2 className="text-3xl font-light text-gray-700 mb-6 text-center md:text-4xl">
        Quién está detrás de{' '}
        <span className="text-[#7B9B77] font-semibold">Flowness</span>
      </h2>
      <p className="text-center text-[#A9A9A2] text-sm py-8">
        Próximamente conocerás a la creadora del método.
      
      </p>
    </section>
  )

  return (
    <section className="bg-white px-6 pt-8 pb-4 md:px-16 md:py-10">
      <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-2 text-center">
        Sobre mí
      </p>
      <h2 className="text-3xl font-light text-gray-700 mb-10 text-center md:text-4xl">
        Quién está detrás de{' '}
        <span className="text-[#7B9B77] font-semibold">Flowness</span>
      </h2>

      <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-16">

        {/* Foto */}
        <div className="rounded-2xl overflow-hidden md:w-1/3 md:h-96 border border-[#D8A48F]/20">
          {datos.fotoUrl ? (
            <img src={datos.fotoUrl} alt={datos.nombre} className="w-full h-full object-cover" />
          ) : (
            <div className="bg-[#E6D5B8] h-64 md:h-80 flex items-center justify-center">
              <p className="text-[#A9A9A2] text-xs text-center px-4">
                [ Foto de {datos.nombre} ]
              </p>
            </div>
          )}
        </div>

        {/* Texto */}
        <div className="md:w-2/3">
          <h3 className="text-[#7B9B77] font-semibold text-xl mb-1">
            {datos.nombre}
          </h3>
          <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-6">
            {datos.titulo}
          </p>
          <p className="text-[#888] text-sm leading-relaxed mb-4">
            {datos.descripcion1}
          </p>
          <p className="text-[#888] text-sm leading-relaxed">
            {datos.descripcion2}
          </p>
        </div>

      </div>
    </section>
  )
}

export default SobreMi