import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Clock, PlayCircle, FileText, Lock, PlusCircle, ShieldCheck, ShoppingBag,
  UserPlus, Users, ListOrdered, CheckCircle2, Hourglass, SearchX, PartyPopper,
} from 'lucide-react'
import ReproductorVideo from '../../compartido/componentes/ReproductorVideo'
import EstadoVacio from '../../compartido/componentes/EstadoVacio'
import VideoMuestra from '../../compartido/componentes/VideoMuestra'
import SellosConfianza from '../../compartido/componentes/SellosConfianza'
import MediosDePago from '../../compartido/componentes/MediosDePago'
import { fadeUp, fadeUpDelay, fadeUpScroll, listItem, tabContent } from '../../compartido/utilidades/animaciones'
import { avisar } from '../../compartido/utilidades/avisos'
import { formatearPrecio } from '../../compartido/utilidades/video'
import { imagenReducida, urlVisorPdf } from '../../compartido/utilidades/medios'
import { obtenerCurso } from './formacion.servicio'

// Página de un nivel de la Formación.
// - Si todavía no lo compró: página de venta (info, temario y botón Comprar).
// - Si ya lo compró: el aula (lista de lecciones, video y PDF).
function CursoDetalle() {
  const { slug } = useParams()
  // Guarda para qué nivel es lo cargado; si cambia el nivel, se muestra la carga
  const [estado, setEstado] = useState({ slug: null, curso: null, error: false })

  useEffect(() => {
    obtenerCurso(slug)
      .then((curso) => setEstado({ slug, curso, error: false }))
      .catch(() => setEstado({ slug, curso: null, error: true }))
  }, [slug])

  const cargando = estado.slug !== slug
  const { curso, error } = estado

  if (cargando) {
    return (
      <main className="contenedor pt-28 md:pt-32 min-h-screen" role="status" aria-label="Cargando">
        <div className="esqueleto h-3 w-24 mb-6" />
        <div className="esqueleto h-10 w-2/3 mb-8" />
        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          <div className="esqueleto aspect-video rounded-2xl" />
          <div className="esqueleto h-72 rounded-2xl" />
        </div>
      </main>
    )
  }
  if (error || !curso) {
    return (
      <main className="contenedor pt-32 min-h-screen">
        <EstadoVacio icono={SearchX} titulo="No encontramos este curso" texto="Puede que el link esté mal o que el curso ya no esté disponible.">
          <Link to="/formacion" className="btn btn-secundario"><ArrowLeft size={16} /> Volver a la formación</Link>
        </EstadoVacio>
      </main>
    )
  }

  return curso.tieneAcceso ? <Aula curso={curso} /> : <PaginaVenta curso={curso} />
}

function Volver() {
  return (
    <Link to="/formacion" className="inline-flex items-center gap-1.5 text-piedra text-[0.7rem] tracking-[0.18em] uppercase hover:text-verde transition-colors group">
      <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Formación
    </Link>
  )
}

// ─────────────────────────────────────────────
// Página de venta
// ─────────────────────────────────────────────
function PaginaVenta({ curso }) {
  const navigate = useNavigate()
  const hayUsuario = !!localStorage.getItem('token')
  const faltan = Math.max((curso.totalVideos || 0) - curso.lecciones.length, 0)
  const cantidadVideos = curso.totalVideos || curso.lecciones.length

  const comprar = () => {
    const destino = `/pagar?curso=${curso.id}`
    if (!hayUsuario) {
      avisar('Creá tu cuenta o ingresá para comprar el curso.', 'info')
      return navigate(`/ingresar?modo=registro&volver=${encodeURIComponent(destino)}`)
    }
    navigate(destino)
  }

  const botonCompra = curso.disponibleParaComprar ? (
    <button onClick={comprar} className="btn btn-primario btn-brillo w-full">
      {hayUsuario ? <><ShoppingBag size={16} /> Comprar</> : <><UserPlus size={16} /> Registrate para comprar</>}
    </button>
  ) : (
    <p className="flex items-center justify-center gap-2 text-piedra text-xs tracking-[0.16em] uppercase py-3.5 border border-piedra/40 rounded-full">
      <Hourglass size={14} /> Disponible próximamente
    </p>
  )

  return (
    <main className="min-h-screen pb-28 lg:pb-20">
      {/* Cabecera */}
      <header className="relative isolate overflow-hidden pt-24 md:pt-32 pb-10">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <span className="absolute -top-20 -right-16 w-72 h-72 md:w-96 md:h-96 rounded-full bg-terracota/25 blur-3xl animate-respirar" />
          <span className="absolute top-10 -left-24 w-72 h-72 rounded-full bg-verde/20 blur-3xl animate-respirar-lento" />
        </div>
        <div className="contenedor">
          <Volver />
          {curso.subtitulo && <motion.p {...fadeUpDelay(0)} className="etiqueta mt-6 mb-2">{curso.subtitulo}</motion.p>}
          <motion.h1 {...fadeUpDelay(0.08)} className="titulo text-verde text-5xl md:text-7xl leading-none mt-2">{curso.nombre}</motion.h1>
          <motion.div {...fadeUpDelay(0.16)} className="flex flex-wrap gap-2 mt-6">
            {curso.duracion && <span className="chip bg-blanco text-texto shadow-suave"><Clock size={12} className="text-terracota" /> {curso.duracion}</span>}
            {cantidadVideos > 0 && <span className="chip bg-blanco text-texto shadow-suave"><PlayCircle size={12} className="text-terracota" /> {cantidadVideos} videos</span>}
            <span className="chip bg-blanco text-texto shadow-suave"><FileText size={12} className="text-terracota" /> PDF por lección</span>
          </motion.div>
        </div>
      </header>

      <MediosDePago className="mb-10" />

      <div className="contenedor grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        {/* Información */}
        <div>
          {(curso.muestraUrl || curso.portadaUrl) && (
            <motion.div {...fadeUp} className="relative w-full aspect-video rounded-xl overflow-hidden shadow-media mb-10 bg-arena">
              {curso.muestraUrl
                ? <VideoMuestra src={curso.muestraUrl} portada={curso.portadaUrl ? imagenReducida(curso.portadaUrl, 1100) : undefined} ancho={1100} />
                : <img src={imagenReducida(curso.portadaUrl, 1100)} alt={curso.nombre} className="absolute inset-0 w-full h-full object-cover" />}
            </motion.div>
          )}

          {curso.descripcion && (
            <motion.p {...fadeUpScroll} className="text-texto/85 text-base leading-relaxed whitespace-pre-line mb-10">{curso.descripcion}</motion.p>
          )}

          {curso.dirigidoA && (
            <motion.section {...fadeUpScroll} className="card-vidrio p-6 mb-10 flex gap-4">
              <span className="icono-caja bg-verde/15 text-verde"><Users size={20} /></span>
              <div>
                <h2 className="titulo text-verde text-2xl mb-2">¿A quién está dirigido?</h2>
                <p className="text-texto/80 text-sm leading-relaxed whitespace-pre-line">{curso.dirigidoA}</p>
              </div>
            </motion.section>
          )}

          <section>
            <motion.h2 {...fadeUpScroll} className="titulo text-verde text-3xl mb-5 flex items-center gap-3">
              <ListOrdered size={24} className="text-terracota" /> Temario
            </motion.h2>
            {curso.lecciones.length === 0 && faltan === 0 ? (
              <p className="text-piedra text-sm">El temario se publica muy pronto.</p>
            ) : (
              <ol className="card divide-y divide-terracota/15">
                {curso.lecciones.map((leccion, i) => (
                  <motion.li key={leccion.id} {...listItem(i)} className="flex items-center gap-4 px-5 py-4 text-sm">
                    <span className="titulo text-terracota text-xl w-7 text-center">{i + 1}</span>
                    <span className="flex-1 text-texto">{leccion.titulo}</span>
                    {leccion.tienePdf && <span className="chip bg-arena/60 text-texto/70"><FileText size={11} /> PDF</span>}
                    <Lock size={15} className="text-piedra shrink-0" aria-label="Se desbloquea al comprar" />
                  </motion.li>
                ))}
                {faltan > 0 && (
                  <li className="flex items-center gap-4 px-5 py-4 text-sm text-piedra">
                    <PlusCircle size={18} className="w-7" />
                    {faltan} {faltan === 1 ? 'lección más' : 'lecciones más'} que se van sumando al curso
                  </li>
                )}
              </ol>
            )}
          </section>
        </div>

        {/* Tarjeta de compra */}
        <motion.aside {...fadeUpDelay(0.2)} className="lg:sticky lg:top-28 h-fit card p-6 md:p-7 shadow-media">
          <p className="etiqueta mb-2">Inversión</p>
          <p className="text-texto text-4xl font-semibold mb-1">
            {curso.disponibleParaComprar ? formatearPrecio(curso.precio) : 'Próximamente'}
          </p>
          <p className="text-piedra text-xs mb-6">Pago único · acceso para siempre</p>

          <ul className="text-sm text-texto/85 space-y-3 mb-7">
            {curso.duracion && <li className="flex gap-3"><Clock size={18} className="text-verde shrink-0" /> {curso.duracion}</li>}
            {cantidadVideos > 0 && <li className="flex gap-3"><PlayCircle size={18} className="text-verde shrink-0" /> {cantidadVideos} videos</li>}
            <li className="flex gap-3"><FileText size={18} className="text-verde shrink-0" /> Material en PDF de cada lección</li>
            <li className="flex gap-3"><PlusCircle size={18} className="text-verde shrink-0" /> Las lecciones nuevas se suman solas a tu cuenta</li>
          </ul>

          <div className="hidden lg:block">{botonCompra}</div>
          <p className="hidden lg:flex items-center justify-center gap-1.5 text-piedra text-[0.7rem] mt-3">
            <ShieldCheck size={13} /> Pagás de forma segura con Mercado Pago
          </p>
          <SellosConfianza compacto className="mt-5 pt-5 border-t border-terracota/15" />
        </motion.aside>
      </div>

      {/* Barra de compra fija (celular) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-blanco/95 backdrop-blur border-t border-terracota/20 px-4 py-3 flex items-center gap-3 shadow-alta">
        <div className="shrink-0">
          <p className="text-piedra text-[0.6rem] tracking-[0.16em] uppercase">{curso.nombre}</p>
          <p className="text-texto font-semibold">{curso.disponibleParaComprar ? formatearPrecio(curso.precio) : 'Próximamente'}</p>
        </div>
        <div className="flex-1">{botonCompra}</div>
      </div>
    </main>
  )
}

// ─────────────────────────────────────────────
// Aula: para quien ya compró el curso
// ─────────────────────────────────────────────
function Aula({ curso }) {
  const [actual, setActual] = useState(curso.lecciones[0] || null)
  const faltan = Math.max((curso.totalVideos || 0) - curso.lecciones.length, 0)
  const indice = actual ? curso.lecciones.findIndex((l) => l.id === actual.id) : -1
  const total = curso.totalVideos || curso.lecciones.length
  const progreso = total ? Math.round((curso.lecciones.length / total) * 100) : 0

  const elegir = (leccion) => {
    setActual(leccion)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen pt-24 md:pt-28 pb-20">
      <div className="contenedor max-w-6xl">
        <Volver />
        <div className="flex flex-wrap items-end justify-between gap-3 mt-3 mb-6">
          <h1 className="titulo text-verde text-4xl md:text-5xl">{curso.nombre}</h1>
          <span className="chip chip-verde"><CheckCircle2 size={12} /> Tu curso</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_330px] gap-6">
          {/* Video y material */}
          <section>
            {actual ? (
              <AnimatePresence mode="wait">
                <motion.div key={actual.id} {...tabContent}>
                  <ReproductorVideo url={actual.videoUrl} titulo={actual.titulo} />
                  <div className="card p-5 md:p-6 mt-4">
                    <p className="etiqueta mb-1">Lección {indice + 1}</p>
                    <h2 className="titulo text-verde text-2xl md:text-3xl mb-3">{actual.titulo}</h2>
                    {actual.descripcion && <p className="text-texto/80 text-sm leading-relaxed whitespace-pre-line mb-5">{actual.descripcion}</p>}

                    <div className="flex flex-col sm:flex-row gap-3">
                      {actual.pdfUrl && (
                        <a href={urlVisorPdf(actual.pdfUrl)} target="_blank" rel="noreferrer" className="btn btn-acento">
                          <FileText size={16} /> Ver material en PDF
                        </a>
                      )}
                      {indice < curso.lecciones.length - 1 && (
                        <button onClick={() => elegir(curso.lecciones[indice + 1])} className="btn btn-secundario">
                          Siguiente lección <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <EstadoVacio icono={PartyPopper} titulo="¡Gracias por sumarte!"
                texto="La primera lección se publica muy pronto. Te va a aparecer acá automáticamente." />
            )}
          </section>

          {/* Lista de lecciones */}
          <aside className="card h-fit lg:sticky lg:top-28">
            <div className="px-5 py-4 border-b border-terracota/15">
              <p className="text-verde text-xs font-semibold tracking-[0.18em] uppercase mb-2">
                Lecciones · {curso.lecciones.length}{curso.totalVideos ? ` de ${curso.totalVideos}` : ''}
              </p>
              {curso.totalVideos > 0 && (
                <div className="h-1.5 rounded-full bg-arena/60 overflow-hidden" title="Lecciones publicadas">
                  <motion.div className="h-full bg-verde rounded-full" initial={{ width: 0 }} animate={{ width: `${progreso}%` }} transition={{ duration: 0.8 }} />
                </div>
              )}
            </div>
            <ol className="max-h-[60vh] overflow-y-auto divide-y divide-terracota/10">
              {curso.lecciones.map((leccion, i) => {
                const activa = actual?.id === leccion.id
                return (
                  <li key={leccion.id}>
                    <button onClick={() => elegir(leccion)}
                      className={`w-full text-left flex items-center gap-3 px-5 py-3.5 text-sm transition-colors ${
                        activa ? 'bg-verde/10 text-verde font-medium' : 'text-texto hover:bg-crema'
                      }`}>
                      {activa
                        ? <PlayCircle size={18} className="text-verde shrink-0" />
                        : <span className="titulo text-terracota text-lg w-[18px] text-center shrink-0">{i + 1}</span>}
                      <span className="flex-1">{leccion.titulo}</span>
                      {leccion.pdfUrl && <FileText size={14} className="text-piedra shrink-0" aria-label="Tiene PDF" />}
                    </button>
                  </li>
                )
              })}
              {Array.from({ length: faltan }).map((_, i) => (
                <li key={`proxima-${i}`} className="flex items-center gap-3 px-5 py-3.5 text-sm text-piedra">
                  <span className="titulo text-lg w-[18px] text-center">{curso.lecciones.length + i + 1}</span>
                  <span className="flex-1 italic">Próximamente</span>
                  <Hourglass size={14} />
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
