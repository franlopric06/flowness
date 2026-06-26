import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function MiCuenta() {
  const [cursos, setCursos] = useState([])
  const [clases, setClases] = useState([])
  const [cargando, setCargando] = useState(true)
  const [seccion, setSeccion] = useState('cursos')
  const [videosActivos, setVideosActivos] = useState({})
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  useEffect(() => {
    if (!token) {
      navigate('/ingresar')
      return
    }
    cargarMisCursos()
    cargarMisClases()
  }, [])

  const cargarMisCursos = async () => {
    try {
      const res = await fetch(`${API_URL}/usuario/mis-cursos`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setCursos(data)
      setCargando(false)
    } catch (error) {
      setCargando(false)
    }
  }

  const cargarMisClases = async () => {
    try {
      const res = await fetch(`${API_URL}/usuario/mis-clases`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setClases(data)
    } catch (error) {
      console.error(error)
    }
  }

  const verVideos = async (cursoId) => {
    if (videosActivos[cursoId]) {
      setVideosActivos({ ...videosActivos, [cursoId]: null })
      return
    }
    try {
      const res = await fetch(`${API_URL}/videos/curso/${cursoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setVideosActivos({ ...videosActivos, [cursoId]: data })
    } catch (error) {
      console.error(error)
    }
  }

  if (cargando) {
    return (
      <main className="pt-20 bg-[#F5F0EB] min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#7B9B77] border-t-transparent rounded-full" />
      </main>
    )
  }

  return (
    <>
      <SEO titulo="Mi Cuenta" descripcion="Mis cursos y clases comprados en Flowness" url="/mi-cuenta" />
      <main className="pt-18 bg-[#F5F0EB] min-h-screen md:pt-34">

        {/* Header */}
        <section className="bg-white border-b border-[#D8A48F]/20 px-6 py-6 md:px-16">
          <h1 className="text-2xl font-light text-gray-700">
            Hola, <span className="text-[#7B9B77] font-semibold">{usuario.nombre}</span>
          </h1>
          <p className="text-[#A9A9A2] text-xs mt-1">Tu espacio personal en Flowness</p>
        </section>

        {/* Tabs */}
        <section className="bg-white border-b border-[#D8A48F]/20 px-6 md:px-16">
          <div className="flex gap-6">
            <button
              onClick={() => setSeccion('cursos')}
              className={`py-4 text-xs tracking-widest uppercase border-b-2 transition-colors ${
                seccion === 'cursos' ? 'border-[#7B9B77] text-[#7B9B77]' : 'border-transparent text-[#A9A9A2] hover:text-[#7B9B77]'
              }`}
            >
              Mis Cursos ({cursos.length})
            </button>
            <button
              onClick={() => setSeccion('clases')}
              className={`py-4 text-xs tracking-widest uppercase border-b-2 transition-colors ${
                seccion === 'clases' ? 'border-[#7B9B77] text-[#7B9B77]' : 'border-transparent text-[#A9A9A2] hover:text-[#7B9B77]'
              }`}
            >
              Mis Clases ({clases.length})
            </button>
          </div>
        </section>

        <section className="px-6 py-8 md:px-16">

          {/* MIS CURSOS */}
          {seccion === 'cursos' && (
            <>
              {cursos.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-5xl mb-4">📚</p>
                  <p className="text-[#555] font-medium mb-2">No tenés cursos comprados</p>
                  <p className="text-[#A9A9A2] text-sm mb-6">Explorá nuestros niveles de formación</p>
                  <a href="/formacion" className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-3 rounded-full hover:bg-[#5a7a56] transition-colors">
                    Ver formación
                  </a>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {cursos.map((compra) => (
                    <div key={compra.id} className="bg-white rounded-2xl border border-[#D8A48F]/15 overflow-hidden">
                      <div className="bg-[#E6D5B8] px-6 py-4">
                        <p className="text-[#A9A9A2] text-xs">NIVEL {compra.curso.nivel}</p>
                        <h2 className="text-lg font-semibold text-[#555]">{compra.curso.nombre}</h2>
                      </div>
                      <div className="px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-[#888] text-sm">{compra.curso.descripcion}</p>
                          <p className="text-[#A9A9A2] text-xs mt-1">
                            Comprado el {new Date(compra.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-3 items-center">
                          <span className="bg-[#7B9B77]/10 text-[#7B9B77] text-xs px-4 py-2 rounded-full">
                            ✓ Acceso habilitado
                          </span>
                          <button
                            onClick={() => verVideos(compra.curso.id)}
                            className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-4 py-2 rounded-full hover:bg-[#5a7a56] transition-colors"
                          >
                            {videosActivos[compra.curso.id] ? 'Ocultar videos' : 'Ver videos'}
                          </button>
                        </div>
                      </div>

                      {/* Videos del curso */}
                      {videosActivos[compra.curso.id] && (
                        <div className="border-t border-[#D8A48F]/15 px-6 py-4">
                          {videosActivos[compra.curso.id].length === 0 ? (
                            <p className="text-[#A9A9A2] text-sm text-center py-4">
                              Próximamente se agregarán los videos de este curso.
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                             {videosActivos[compra.curso.id].map((video) => (
                               <div key={video.id} className="bg-[#F5F0EB] rounded-2xl overflow-hidden">
                                 <video 
                                   src={video.url} 
                                   controls 
                                   className="w-full md:w-96 md:mx-auto max-h-48 object-contain bg-black"
                                   preload="metadata"
                                 />
                                 <div className="px-4 py-3">
                                   <p className="text-[#A9A9A2] text-xs">CLASE {video.orden}</p>
                                   <p className="text-[#555] font-medium text-sm">{video.titulo}</p>
                                   {video.descripcion && (
                                     <p className="text-[#888] text-xs mt-1">{video.descripcion}</p>
                                   )}
                                 </div>
                               </div>
                             ))}
                           </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* MIS CLASES */}
          {seccion === 'clases' && (
            <>
              {clases.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-5xl mb-4">🎯</p>
                  <p className="text-[#555] font-medium mb-2">No tenés clases compradas</p>
                  <p className="text-[#A9A9A2] text-sm mb-6">Explorá nuestras clases online</p>
                  <a href="/clases" className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-3 rounded-full hover:bg-[#5a7a56] transition-colors">
                    Ver clases
                  </a>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {clases.map((reserva) => (
                    <div key={reserva.id} className="bg-white rounded-2xl border border-[#D8A48F]/15 overflow-hidden">
                      <div className="bg-[#E6D5B8] px-6 py-4">
                        <p className="text-[#A9A9A2] text-xs">FASE {reserva.clase.fase}</p>
                        <h2 className="text-lg font-semibold text-[#555]">{reserva.clase.nombre}</h2>
                      </div>
                      <div className="px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-[#888] text-sm">{reserva.clase.descripcion}</p>
                          <p className="text-[#A9A9A2] text-xs mt-1">
                            Tipo: {reserva.tipo === 'vivo' ? 'Clase en vivo' : 'Clase grabada'} •
                            Comprado el {new Date(reserva.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="bg-[#7B9B77]/10 text-[#7B9B77] text-xs px-4 py-2 rounded-full w-fit">
                          ✓ Acceso habilitado
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </section>
      </main>
    </>
  )
}

export default MiCuenta