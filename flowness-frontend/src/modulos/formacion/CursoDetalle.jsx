import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useVibrar } from '../../compartido/hooks/useVibrar'
import ReproductorVideo from '../../compartido/componentes/ReproductorVideo'
import { formatearPrecio } from '../../compartido/utilidades/video'
import { obtenerCurso } from './formacion.servicio'
import { comprarCurso } from '../pagos/pagos.servicio'
import { urlVisorPdf } from '../../compartido/utilidades/medios'

// Página de un nivel de la Formación.
// - Si todavía no lo compró: página de venta (info, temario y botón Comprar).
// - Si ya lo compró: el aula (lista de lecciones, video y PDF).
function CursoDetalle() {
  const { slug } = useParams()
  // Guarda para qué nivel es lo cargado; si cambia el nivel, se muestra "Cargando…"
  const [estado, setEstado] = useState({ slug: null, curso: null, error: '' })

  useEffect(() => {
    obtenerCurso(slug)
      .then((curso) => setEstado({ slug, curso, error: '' }))
      .catch(() => setEstado({ slug, curso: null, error: 'No encontramos este curso.' }))
  }, [slug])

  const cargando = estado.slug !== slug
  const { curso, error } = estado

  if (cargando) return <main className="pt-32 min-h-screen text-center text-[#A9A9A2]">Cargando…</main>
  if (error || !curso) {
    return (
      <main className="pt-32 min-h-screen text-center px-6">
        <p className="text-[#A9A9A2] mb-6">{error}</p>
        <Link to="/formacion" className="text-[#7B9B77] underline text-sm">Volver a la formación</Link>
      </main>
    )
  }

  return curso.tieneAcceso ? <Aula curso={curso} /> : <PaginaVenta curso={curso} />
}

// ─────────────────────────────────────────────
// Página de venta
// ─────────────────────────────────────────────
function PaginaVenta({ curso }) {
  const [comprando, setComprando] = useState(false)
  const vibrar = useVibrar()
  const navigate = useNavigate()
  const hayUsuario = !!localStorage.getItem('token')
  const faltan = Math.max((curso.totalVideos || 0) - curso.lecciones.length, 0)

  const comprar = async () => {
    vibrar()
    if (!hayUsuario) return navigate(`/ingresar?modo=registro&volver=/formacion/${curso.slug}`)
    setComprando(true)
    try {
      const { init_point } = await comprarCurso(curso.id)
      window.location.assign(init_point)
    } catch (err) {
      alert(err.message || 'No se pudo iniciar el pago')
      setComprando(false)
    }
  }

  return (
    <main className="pt-28 min-h-screen px-6 md:px-16 pb-16">
      <div className="max-w-5xl mx-auto">
        <Link to="/formacion" onClick={vibrar} className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77]">← Formación</Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 mt-6">
          {/* Información */}
          <div>
            {curso.subtitulo && <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-2">{curso.subtitulo}</p>}
            <h1 className="text-[#7B9B77] text-3xl md:text-4xl font-bold tracking-widest mb-6">{curso.nombre}</h1>

            {curso.portadaUrl && (
              <img src={curso.portadaUrl} alt={curso.nombre} className="w-full aspect-video object-cover rounded-2xl mb-6" />
            )}

            {curso.descripcion && (
              <p className="text-[#555] text-sm leading-relaxed whitespace-pre-line mb-8">{curso.descripcion}</p>
            )}

            {curso.dirigidoA && (
              <section className="mb-8">
                <h2 className="text-[#7B9B77] font-semibold tracking-widest uppercase text-sm mb-2">¿A quién está dirigido?</h2>
                <p className="text-[#555] text-sm leading-relaxed whitespace-pre-line">{curso.dirigidoA}</p>
              </section>
            )}

            <section>
              <h2 className="text-[#7B9B77] font-semibold tracking-widest uppercase text-sm mb-3">Temario</h2>
              {curso.lecciones.length === 0 && faltan === 0 ? (
                <p className="text-[#A9A9A2] text-sm">El temario se publica muy pronto.</p>
              ) : (
                <ol className="bg-white rounded-2xl border border-[#D8A48F]/20 divide-y divide-[#D8A48F]/15">
                  {curso.lecciones.map((leccion, i) => (
                    <li key={leccion.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                      <span className="text-[#D8A48F] text-xs w-6">{i + 1}</span>
                      <span className="flex-1 text-[#555]">{leccion.titulo}</span>
                      {leccion.tienePdf && <span className="text-[10px] tracking-widest uppercase text-[#A9A9A2]">+ PDF</span>}
                      <span className="text-[#A9A9A2]" title="Se desbloquea al comprar">🔒</span>
                    </li>
                  ))}
                  {faltan > 0 && (
                    <li className="px-4 py-3 text-sm text-[#A9A9A2]">
                      + {faltan} {faltan === 1 ? 'lección más' : 'lecciones más'} que se van sumando al curso
                    </li>
                  )}
                </ol>
              )}
            </section>
          </div>

          {/* Tarjeta de compra */}
          <aside className="lg:sticky lg:top-28 h-fit bg-white rounded-2xl border border-[#D8A48F]/20 shadow-sm p-6">
            <p className="text-[#555] text-3xl font-bold mb-1">
              {curso.disponibleParaComprar ? formatearPrecio(curso.precio) : 'Próximamente'}
            </p>
            <p className="text-[#A9A9A2] text-xs mb-6">Pago único · acceso para siempre</p>

            <ul className="text-sm text-[#555] space-y-2 mb-6">
              {curso.duracion && <li>⏱ {curso.duracion}</li>}
              {curso.totalVideos
                ? <li>▶ {curso.totalVideos} videos</li>
                : curso.lecciones.length > 0 && <li>▶ {curso.lecciones.length} videos</li>}
              <li>📄 Material en PDF de cada lección</li>
              <li>✚ Las lecciones nuevas se suman solas a tu cuenta</li>
            </ul>

            {curso.disponibleParaComprar ? (
              <button onClick={comprar} disabled={comprando}
                className="w-full bg-[#7B9B77] text-white text-xs tracking-widest uppercase py-4 rounded-full hover:bg-[#5a7a56] transition-colors disabled:opacity-50">
                {comprando ? 'Redirigiendo…' : hayUsuario ? 'Comprar' : 'Registrate para comprar'}
              </button>
            ) : (
              <p className="text-center text-[#A9A9A2] text-xs tracking-widest uppercase py-4 border border-[#A9A9A2]/40 rounded-full">
                Disponible próximamente
              </p>
            )}
            <p className="text-[#A9A9A2] text-[11px] text-center mt-3">Pagás de forma segura con Mercado Pago</p>
          </aside>
        </div>
      </div>
    </main>
  )
}

// ─────────────────────────────────────────────
// Aula: para quien ya compró el curso
// ─────────────────────────────────────────────
function Aula({ curso }) {
  const [actual, setActual] = useState(curso.lecciones[0] || null)
  const vibrar = useVibrar()
  const faltan = Math.max((curso.totalVideos || 0) - curso.lecciones.length, 0)
  const indice = actual ? curso.lecciones.findIndex((l) => l.id === actual.id) : -1

  const elegir = (leccion) => {
    vibrar()
    setActual(leccion)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="pt-28 min-h-screen px-4 md:px-10 pb-16">
      <div className="max-w-6xl mx-auto">
        <Link to="/formacion" onClick={vibrar} className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77]">← Formación</Link>
        <h1 className="text-[#7B9B77] text-2xl md:text-3xl font-bold tracking-widest mt-3 mb-6">{curso.nombre}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Video y material */}
          <section>
            {actual ? (
              <>
                <ReproductorVideo url={actual.videoUrl} titulo={actual.titulo} />
                <div className="bg-white rounded-2xl border border-[#D8A48F]/20 p-5 mt-4">
                  <p className="text-[#D8A48F] text-[10px] tracking-widest uppercase mb-1">Lección {indice + 1}</p>
                  <h2 className="text-[#7B9B77] font-semibold text-lg mb-2">{actual.titulo}</h2>
                  {actual.descripcion && <p className="text-[#555] text-sm leading-relaxed whitespace-pre-line mb-4">{actual.descripcion}</p>}

                  <div className="flex flex-wrap gap-3">
                    {actual.pdfUrl && (
                      <a href={urlVisorPdf(actual.pdfUrl)} target="_blank" rel="noreferrer" onClick={vibrar}
                        className="bg-[#D8A48F] text-white text-xs tracking-widest uppercase px-5 py-2.5 rounded-full hover:opacity-85">
                        📄 Ver material en PDF
                      </a>
                    )}
                    {indice < curso.lecciones.length - 1 && (
                      <button onClick={() => elegir(curso.lecciones[indice + 1])}
                        className="border border-[#7B9B77] text-[#7B9B77] text-xs tracking-widest uppercase px-5 py-2.5 rounded-full hover:bg-[#7B9B77]/10">
                        Siguiente lección →
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-[#D8A48F]/20 p-8 text-center">
                <p className="text-[#555] mb-2">¡Gracias por sumarte!</p>
                <p className="text-[#A9A9A2] text-sm">La primera lección se publica muy pronto. Te va a aparecer acá automáticamente.</p>
              </div>
            )}
          </section>

          {/* Lista de lecciones */}
          <aside className="bg-white rounded-2xl border border-[#D8A48F]/20 h-fit lg:sticky lg:top-28 overflow-hidden">
            <p className="px-4 py-3 text-[#7B9B77] text-xs tracking-widest uppercase border-b border-[#D8A48F]/15">
              Lecciones · {curso.lecciones.length}{curso.totalVideos ? ` de ${curso.totalVideos}` : ''}
            </p>
            <ol className="max-h-[60vh] overflow-y-auto divide-y divide-[#D8A48F]/10">
              {curso.lecciones.map((leccion, i) => (
                <li key={leccion.id}>
                  <button onClick={() => elegir(leccion)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      actual?.id === leccion.id ? 'bg-[#7B9B77]/10 text-[#7B9B77] font-medium' : 'text-[#555] hover:bg-[#F5F0EB]'
                    }`}>
                    <span className="text-[#D8A48F] text-xs w-5">{i + 1}</span>
                    <span className="flex-1">{leccion.titulo}</span>
                    {leccion.pdfUrl && <span className="text-xs" title="Tiene PDF">📄</span>}
                  </button>
                </li>
              ))}
              {Array.from({ length: faltan }).map((_, i) => (
                <li key={`proxima-${i}`} className="flex items-center gap-3 px-4 py-3 text-sm text-[#A9A9A2]">
                  <span className="text-xs w-5">{curso.lecciones.length + i + 1}</span>
                  <span className="flex-1 italic">Próximamente</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default CursoDetalle
