import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useVibrar } from '../../compartido/hooks/useVibrar'
import { formatearPrecio } from '../../compartido/utilidades/video'
import { obtenerCursos } from './formacion.servicio'

// Página general de la Formación: presenta los 3 niveles.
// Cada tarjeta lleva a la página del nivel (info completa y compra).
function Formacion() {
  const [cursos, setCursos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const vibrar = useVibrar()

  useEffect(() => {
    obtenerCursos()
      .then(setCursos)
      .catch(() => setError('No pudimos cargar la formación. Probá de nuevo en un rato.'))
      .finally(() => setCargando(false))
  }, [])

  return (
    <main className="pt-32 min-h-screen px-6 md:px-16 pb-16">
      <p className="text-[#D8A48F] text-xs tracking-widest uppercase text-center mb-2">Para profesionales</p>
      <h1 className="text-[#7B9B77] text-3xl md:text-4xl font-bold text-center tracking-widest mb-4">Formación Flowness</h1>
      <p className="text-[#A9A9A2] text-sm text-center max-w-2xl mx-auto mb-12">
        Un programa en tres niveles para profesores de educación física, entrenadores y profesionales del movimiento.
        Método con marca registrada a nivel nacional. Cada nivel se compra por separado y queda en tu cuenta para siempre.
      </p>

      {cargando ? (
        <p className="text-center text-[#A9A9A2]">Cargando…</p>
      ) : error ? (
        <p className="text-center text-[#D8A48F]">{error}</p>
      ) : cursos.length === 0 ? (
        <p className="text-center text-[#A9A9A2]">Muy pronto vas a encontrar la formación acá.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {cursos.map((curso) => (
            <article key={curso.id} className="bg-white rounded-2xl overflow-hidden border border-[#D8A48F]/20 shadow-sm flex flex-col">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-[#7B9B77]/30 to-[#D8A48F]/30">
                {curso.portadaUrl ? (
                  <img src={curso.portadaUrl} alt={curso.nombre} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <img src="/logo.png" alt="" className="h-20 w-20 opacity-40" />
                  </div>
                )}
                {curso.subtitulo && (
                  <span className="absolute top-3 left-3 bg-white/90 text-[#7B9B77] text-[10px] tracking-widest uppercase px-3 py-1 rounded-full">
                    {curso.subtitulo}
                  </span>
                )}
                {curso.comprado && (
                  <span className="absolute top-3 right-3 bg-[#7B9B77] text-white text-[10px] tracking-widest uppercase px-3 py-1 rounded-full">
                    Comprado
                  </span>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-[#7B9B77] font-bold text-lg tracking-widest uppercase mb-2">{curso.nombre}</h2>
                {curso.descripcion && (
                  <p className="text-[#A9A9A2] text-sm leading-relaxed mb-4 line-clamp-4 whitespace-pre-line">{curso.descripcion}</p>
                )}

                <ul className="text-xs text-[#555] space-y-1 mb-6 flex-1">
                  {curso.duracion && <li>⏱ Duración: {curso.duracion}</li>}
                  {curso.totalVideos && <li>▶ {curso.totalVideos} videos con material en PDF</li>}
                </ul>

                <p className="text-[#555] font-semibold mb-4">
                  {curso.disponibleParaComprar ? formatearPrecio(curso.precio) : 'Próximamente'}
                </p>

                <Link to={`/formacion/${curso.slug}`} onClick={vibrar}
                  className={`w-full text-center text-xs tracking-widest uppercase py-3 rounded-full transition-colors ${
                    curso.tieneAcceso
                      ? 'bg-[#7B9B77] text-white hover:bg-[#5a7a56]'
                      : 'border border-[#7B9B77] text-[#7B9B77] hover:bg-[#7B9B77]/10'
                  }`}>
                  {curso.tieneAcceso ? 'Ir al curso' : 'Ver más'}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default Formacion
