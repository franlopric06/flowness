import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getCursos, crearPreferenciaPago } from '../services/api'
import SEO from '../components/SEO'

function Cursos() {
  const [cursos, setCursos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [searchParams] = useSearchParams()
  const nivelParam = searchParams.get('nivel')
  const refsCursos = useRef({})

  useEffect(() => {
    getCursos()
      .then(data => {
        setCursos(data)
        setCargando(false)
      })
      .catch(() => setCargando(false))
  }, [])

  useEffect(() => {
    if (!cargando && nivelParam && refsCursos.current[nivelParam]) {
      setTimeout(() => {
        refsCursos.current[nivelParam].scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [cargando, nivelParam])

  const handleComprar = async (cursoId) => {
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
        descripcion="Accedé a los cursos grabados de Flowness. Tres niveles de formación en movilidad, flexibilidad y mindfulness con acceso de por vida."
        url="/cursos"
      />
      <main className="pt-20 bg-[#F5F0EB] min-h-screen md:pt-24">

        {/* HERO */}
        <section className="px-6 py-16 text-center md:px-16">
          <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-3">
            Formación online
          </p>
          <h1 className="text-4xl font-light text-gray-800 mb-6 md:text-5xl">
            Elegí tu <span className="text-[#7B9B77] font-semibold">nivel</span>
          </h1>
          <p className="text-[#A9A9A2] text-sm leading-relaxed max-w-xl mx-auto md:text-base">
            Accedé a los cursos grabados de Flowness y aprendé a tu ritmo desde cualquier lugar.
          </p>
        </section>

        {/* CURSOS */}
        <section className="px-6 pb-16 md:px-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
            {cursos.map((curso) => (
              <div
                key={curso.id}
                ref={el => refsCursos.current[curso.nivel] = el}
                className={`bg-white rounded-2xl overflow-hidden border flex flex-col flex-1 transition-all ${
                  nivelParam === curso.nivel
                    ? 'border-[#7B9B77] shadow-lg'
                    : 'border-[#D8A48F]/15'
                }`}
              >
                <div className="bg-[#E6D5B8] px-6 py-8">
                  <p className="text-[#A9A9A2] text-[10px] tracking-widest uppercase mb-2">
                    NIVEL {curso.nivel}
                  </p>
                  <h2 className="text-xl font-semibold text-[#555] mb-2">{curso.nombre}</h2>
                  <p className="text-[#888] text-sm leading-relaxed">{curso.descripcion}</p>
                </div>

                <div className="px-6 py-8 flex flex-col flex-1">
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-[#D8A48F]/15">
                      <span className="text-[#A9A9A2] text-xs">Duración</span>
                      <span className="text-[#555] text-xs font-medium">{curso.duracion}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#D8A48F]/15">
                      <span className="text-[#A9A9A2] text-xs">Videos</span>
                      <span className="text-[#555] text-xs font-medium">{curso.videos} clases</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-[#A9A9A2] text-xs">Acceso</span>
                      <span className="text-[#555] text-xs font-medium">de por vida</span>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <p className="text-4xl font-light text-[#7B9B77]">
                      ${curso.precio.toLocaleString()}
                    </p>
                    <p className="text-[#A9A9A2] text-xs mt-1">pago único</p>
                  </div>

                  <div className="mt-auto flex flex-col gap-3">
                    <button
                      onClick={() => handleComprar(curso.id)}
                      className="w-full bg-[#7B9B77] text-white text-xs tracking-widest uppercase py-4 rounded-full hover:bg-[#5a7a56] transition-colors"
                    >
                      Comprar ahora
                    </button>
                    
                    <button
                      onClick={() => document.getElementById('fases').scrollIntoView({ behavior: 'smooth' })}
                      className="text-[#D8A48F] text-xs tracking-widest uppercase text-center py-4 hover:opacity-70 transition-opacity"
                    >
                      Ver clases online →
                    </button>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INFO */}
        <section className="px-6 py-12 bg-white md:px-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">📱</span>
              <p className="text-[#7B9B77] font-semibold text-sm">Acceso desde cualquier dispositivo</p>
              <p className="text-[#A9A9A2] text-xs leading-relaxed">Celular, tablet o computadora</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">♾️</span>
              <p className="text-[#7B9B77] font-semibold text-sm">Acceso de por vida</p>
              <p className="text-[#A9A9A2] text-xs leading-relaxed">Comprás una vez y es tuyo para siempre</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">🎓</span>
              <p className="text-[#7B9B77] font-semibold text-sm">Certificación incluida</p>
              <p className="text-[#A9A9A2] text-xs leading-relaxed">Al completar el nivel 03</p>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}

export default Cursos