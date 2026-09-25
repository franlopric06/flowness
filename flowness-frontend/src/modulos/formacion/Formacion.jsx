import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, PlayCircle, FileText, CheckCircle2, Sprout, TrendingUp, Award, GraduationCap, WifiOff, BadgeCheck } from 'lucide-react'
import CabeceraPagina from '../../compartido/componentes/CabeceraPagina'
import MediaTarjeta from '../../compartido/componentes/MediaTarjeta'
import MediosDePago from '../../compartido/componentes/MediosDePago'
import EstadoVacio from '../../compartido/componentes/EstadoVacio'
import { EsqueletoGrilla } from '../../compartido/componentes/Esqueleto'
import { fadeUpScrollDelay } from '../../compartido/utilidades/animaciones'
import { formatearPrecio } from '../../compartido/utilidades/video'
import { obtenerCursos } from './formacion.servicio'

const ICONOS_NIVEL = [Sprout, TrendingUp, Award]

// Página general de la Formación: presenta los 3 niveles.
// Cada tarjeta lleva a la página del nivel (info completa y compra).
function Formacion() {
  const [cursos, setCursos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    obtenerCursos()
      .then(setCursos)
      .catch(() => setError(true))
      .finally(() => setCargando(false))
  }, [])

  return (
    <main className="min-h-screen pb-20">
      <CabeceraPagina
        etiqueta="Para profesionales"
        titulo="Formación Flowness"
        texto="Un programa en tres niveles para profesores de educación física, entrenadores y profesionales del movimiento. Cada nivel se compra por separado y queda en tu cuenta para siempre.">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-2 mt-6 chip bg-verde/15 text-verde">
          <BadgeCheck size={14} /> Método con marca registrada
        </motion.p>
      </CabeceraPagina>

      <MediosDePago className="mb-10" />

      <div className="contenedor">
        {cargando ? (
          <EsqueletoGrilla cantidad={3} imagen="aspect-[4/3]" className="grid grid-cols-1 md:grid-cols-3 gap-6" />
        ) : error ? (
          <EstadoVacio icono={WifiOff} error titulo="No pudimos cargar la formación" texto="Revisá tu conexión y probá de nuevo en un rato." />
        ) : cursos.length === 0 ? (
          <EstadoVacio icono={GraduationCap} titulo="Muy pronto" texto="La formación va a estar disponible acá muy pronto." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cursos.map((curso, i) => {
              const Icono = ICONOS_NIVEL[i % ICONOS_NIVEL.length]
              return (
                <motion.article key={curso.id} {...fadeUpScrollDelay(i * 0.1)} className="card card-elevable group flex flex-col">
                  <Link to={`/formacion/${curso.slug}`} className="relative block aspect-[4/3] bg-gradient-to-br from-verde/30 to-terracota/30 overflow-hidden" tabIndex={-1}>
                    <MediaTarjeta muestraUrl={curso.muestraUrl} imagenUrl={curso.portadaUrl} alt={curso.nombre}>
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <span className="w-16 h-16 rounded-full bg-blanco/70 text-verde flex items-center justify-center zoom"><Icono size={30} /></span>
                        <span className="titulo text-verde/60 text-5xl">0{i + 1}</span>
                      </div>
                    </MediaTarjeta>
                    {curso.subtitulo && <span className="chip chip-claro absolute top-3 left-3">{curso.subtitulo}</span>}
                    {curso.comprado && <span className="chip chip-verde absolute top-3 right-3"><CheckCircle2 size={12} /> Comprado</span>}
                  </Link>

                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="titulo text-verde text-3xl mb-2">{curso.nombre}</h2>
                    {curso.descripcion && (
                      <p className="text-texto/70 text-sm leading-relaxed mb-5 line-clamp-4 whitespace-pre-line">{curso.descripcion}</p>
                    )}

                    <ul className="text-xs text-texto/80 space-y-2 mb-6 flex-1">
                      {curso.duracion && <li className="flex items-center gap-2"><Clock size={14} className="text-terracota" /> {curso.duracion}</li>}
                      {curso.totalVideos && <li className="flex items-center gap-2"><PlayCircle size={14} className="text-terracota" /> {curso.totalVideos} videos</li>}
                      <li className="flex items-center gap-2"><FileText size={14} className="text-terracota" /> Material en PDF en cada lección</li>
                    </ul>

                    <div className="flex items-end justify-between pt-4 border-t border-terracota/15 mb-5">
                      <p className="text-piedra text-[0.65rem] tracking-[0.18em] uppercase">Inversión</p>
                      <p className="text-texto font-semibold text-lg">
                        {curso.disponibleParaComprar ? formatearPrecio(curso.precio) : 'Próximamente'}
                      </p>
                    </div>

                    <Link to={`/formacion/${curso.slug}`} className={`btn w-full ${curso.tieneAcceso ? 'btn-primario' : 'btn-secundario'}`}>
                      {curso.tieneAcceso ? <>Ir al curso <PlayCircle size={16} /></> : <>Ver más <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></>}
                    </Link>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default Formacion
