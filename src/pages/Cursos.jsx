import { useState, useEffect } from 'react'
import { getCursos } from '../services/api'
import { crearPreferenciaPago } from '../services/api'
import SEO from '../components/SEO'
import useVibrar from '../hooks/useVibrar'

function Cursos() {
  const [cursos, setCursos] = useState([])
  const [cargando, setCargando] = useState(true)
  const vibrar = useVibrar()

  useEffect(() => {
    getCursos()
      .then(data => {
        setCursos(data)
        setCargando(false)
      })
      .catch(() => setCargando(false))
  }, [])

  const handleComprar = async (cursoId) => {
    vibrar()
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/ingresar'
      return
    }
    try {
      const res = await crearPreferenciaPago(cursoId)
      if (res.init_point) {
        window.location.href = res.init_point
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (cargando) {
    return (
      <main className="pt-20 bg-[#F5F0EB] min-h-screen flex items-center justify-center md:pt-24">
        <div className="animate-spin w-10 h-10 border-4 border-[#7B9B77] border-t-transparent rounded-full" />
      </main>
    )
  }

  return (
    <>
      <SEO
        titulo="Cursos"
        descripcion="Explorá los tres niveles de formación del método Flowness y comenzá tu camino hacia el bienestar"
        url="/cursos"
      />
      <main className="pt-10 bg-[#F5F0EB] min-h-screen md:pt-24">

        {/* HERO */}
        <section className="px-6 py-16 text-center md:px-16">
          <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-3">
            Formación
          </p>
          <h1 className="text-4xl font-light text-gray-800 mb-6 md:text-5xl">
            Tres niveles hacia el{' '}
            <span className="text-[#7B9B77] font-semibold">bienestar</span>
          </h1>
          <p className="text-[#A9A9A2] text-sm leading-relaxed max-w-xl mx-auto md:text-base">
            Cada nivel está diseñado para acompañarte en tu proceso de manera progresiva y sostenida.
          </p>
        </section>

        {/* CURSOS */}
        <section className="px-6 pb-16 md:px-16">
          <div className="flex flex-col gap-6">
            {cursos.map((curso) => (
              <div key={curso.id} className="bg-white rounded-2xl border border-[#D8A48F]/15 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-[#A9A9A2] text-xs tracking-widest uppercase mb-1">Nivel {curso.nivel}</p>
                      <h2 className="text-xl font-semibold text-[#7B9B77]">{curso.nombre}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-light text-[#7B9B77]">${curso.precio.toLocaleString()}</p>
                      <p className="text-[#A9A9A2] text-xs">ARS</p>
                    </div>
                  </div>
                  <p className="text-[#888] text-sm leading-relaxed mb-4">{curso.descripcion}</p>
                  <div className="flex gap-4 mb-6">
                    <div className="flex flex-col items-center bg-[#F5F0EB] rounded-xl px-4 py-3 flex-1">
                      <span className="text-[#7B9B77] font-semibold">{curso.duracion}</span>
                      <span className="text-[#A9A9A2] text-[10px] tracking-widest uppercase mt-1">Duración</span>
                    </div>
                    <div className="flex flex-col items-center bg-[#F5F0EB] rounded-xl px-4 py-3 flex-1">
                      <span className="text-[#7B9B77] font-semibold">{curso.videos}</span>
                      <span className="text-[#A9A9A2] text-[10px] tracking-widest uppercase mt-1">Videos</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleComprar(curso.id)}
                    className="w-full bg-[#7B9B77] text-white text-xs tracking-widest uppercase py-4 rounded-full hover:bg-[#5a7a56] transition-colors"
                  >
                    Comprar ahora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </>
  )
}

export default Cursos