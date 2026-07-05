import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function Cursos() {
  const [niveles, setNiveles] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/niveles`)
      .then(res => res.json())
      .then(data => {
        setNiveles(Array.isArray(data) ? data : [])
        setCargando(false)
      })
      .catch(() => setCargando(false))
  }, [])

  if (cargando) {
    return (
      <main className="pt-14 bg-[#F5F0EB] min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#7B9B77] border-t-transparent rounded-full" />
      </main>
    )
  }

  return (
    <>
      <SEO
        titulo="Cursos"
        descripcion="Conocé los tres niveles de formación de Flowness: Esencial, Avanza y Pro. Formación progresiva en movilidad, flexibilidad y mindfulness."
        url="/cursos"
      />
      <main className="pt-14 bg-[#F5F0EB] min-h-screen md:pt-22">

        {/* HERO */}
        <section className="px-6 py-16 text-center md:px-16">
          <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-3">
            Formación Flowness
          </p>
          <h1 className="text-4xl font-light text-gray-800 mb-6 md:text-5xl">
            Tres niveles de{' '}
            <span className="text-[#7B9B77] font-semibold">formación</span>
          </h1>
          <p className="text-[#A9A9A2] text-sm leading-relaxed max-w-xl mx-auto md:text-base">
            Flowness ofrece una formación progresiva en tres niveles, desde los fundamentos hasta la certificación profesional. Cada nivel está diseñado para acompañar tu crecimiento de forma gradual y sostenible.
          </p>
        </section>

        {/* NIVELES */}
        <section className="px-6 pb-16 md:px-16">
          {niveles.length === 0 ? (
            <p className="text-center text-[#A9A9A2] text-sm py-12">
              Próximamente se cargarán los niveles de formación.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {niveles.map((nivel, index) => (
                <div
                  key={nivel.id}
                  className={`rounded-2xl p-8 border border-[#D8A48F]/15 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#E6D5B8]/30'
                  }`}
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-12">

                    {/* Numero */}
                    <div className="md:w-24 md:shrink-0">
                      <p className="text-6xl font-light text-[#7B9B77]/20">{nivel.numero}</p>
                      <span className="text-[#D8A48F] text-xs tracking-widest uppercase">{nivel.etiqueta}</span>
                    </div>

                    {/* Contenido */}
                    <div className="flex flex-col gap-4 flex-1">
                      <h2 className="text-xl font-semibold text-[#7B9B77]">{nivel.nombre}</h2>
                      <p className="text-[#888] text-sm leading-relaxed">{nivel.descripcion}</p>

                      {/* Para quien es */}
                      <p className="text-[#A9A9A2] text-xs italic">
                        👤 {nivel.para}
                      </p>

                      {/* Incluye */}
                      <div className="flex flex-col gap-2 md:flex-row md:gap-4 md:flex-wrap">
                        {nivel.incluye.split(',').map((item, i) => (
                          <span
                            key={i}
                            className="bg-[#7B9B77]/10 text-[#7B9B77] text-xs tracking-wide px-4 py-2 rounded-full"
                          >
                            ✓ {item.trim()}
                          </span>
                        ))}
                        <Link
                          to={`/comprar-cursos?nivel=${nivel.numero}`}
                          className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-6 py-3 rounded-full hover:bg-[#5a7a56] transition-colors w-fit"
                        >
                          Ver y Comprar →
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="px-6 py-16 text-center bg-[#7B9B77] md:px-16">
          <h2 className="text-3xl font-light text-white mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-white/70 text-sm mb-8 max-w-md mx-auto">
            Elegí el nivel que más se adapta a tu momento y comenzá tu camino con Flowness.
          </p>
          <Link
            to="/comprar-cursos"
            className="inline-block bg-white text-[#7B9B77] text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-[#F5F0EB] transition-colors"
          >
            Ver precios y comprar →
          </Link>
        </section>

      </main>
    </>
  )
}

export default Cursos