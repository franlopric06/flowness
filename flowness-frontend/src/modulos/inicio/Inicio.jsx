import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
  ArrowRight, ChevronDown, Clock, Lock, Megaphone, PlayCircle, Sprout, TrendingUp, Award, Sparkles, Images, Film,
} from 'lucide-react'
import ReproductorVideo from '../../compartido/componentes/ReproductorVideo'
import Medio from '../../compartido/componentes/Medio'
import VisorMedios from '../../compartido/componentes/VisorMedios'
import TituloSeccion from '../../compartido/componentes/TituloSeccion'
import Carrusel from '../../compartido/componentes/Carrusel'
import { EsqueletoGrilla } from '../../compartido/componentes/Esqueleto'
import { fadeUpScroll, fadeUpScrollDelay, listItem } from '../../compartido/utilidades/animaciones'
import { formatearPrecio } from '../../compartido/utilidades/video'
import { imagenReducida } from '../../compartido/utilidades/medios'
import { obtenerDatosPublicos } from '../../compartido/servicios/publico.servicio'
import { obtenerClases } from '../clases/clases.servicio'
import { obtenerCursos } from '../formacion/formacion.servicio'
import { obtenerGaleria } from '../galeria/galeria.servicio'

const ICONOS_NIVEL = [Sprout, TrendingUp, Award]

// Título de la portada que aparece letra por letra (o palabra por palabra)
function TituloAnimado({ texto }) {
  const partes = texto.includes(' ') ? texto.split(' ') : [...texto]
  const separador = texto.includes(' ') ? ' ' : ''
  return (
    <h1 className="titulo text-verde text-6xl sm:text-7xl md:text-8xl leading-none" aria-label={texto}>
      {partes.map((parte, i) => (
        <motion.span key={i} aria-hidden="true" className="inline-block"
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.3 + i * 0.07, ease: 'easeOut' }}>
          {parte}{i < partes.length - 1 ? separador : ''}
        </motion.span>
      ))}
    </h1>
  )
}

// Línea de tiempo de las fases: la línea se va dibujando a medida que bajás
function LineaFases({ fases }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const progreso = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <div ref={ref} className="relative max-w-4xl mx-auto">
      {/* Línea de fondo y línea que se dibuja */}
      <span className="absolute left-5 lg:left-1/2 top-2 bottom-2 w-px bg-terracota/25 lg:-translate-x-1/2" aria-hidden="true" />
      <motion.span style={{ scaleY: progreso }}
        className="absolute left-5 lg:left-1/2 top-2 bottom-2 w-px bg-verde origin-top lg:-translate-x-1/2" aria-hidden="true" />

      <ol className="space-y-10 lg:space-y-16">
        {fases.map((fase, i) => {
          const derecha = i % 2 === 1
          return (
            <li key={fase.id} className={`relative pl-16 lg:pl-0 lg:w-1/2 ${derecha ? 'lg:ml-auto lg:pl-14' : 'lg:pr-14 lg:text-right'}`}>
              {/* Número */}
              <motion.span
                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: '-40px' }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className={`absolute top-0 left-0 lg:top-1 w-10 h-10 rounded-full bg-verde text-blanco flex items-center justify-center titulo text-lg shadow-media ring-4 ring-crema ${
                  derecha ? 'lg:-left-5' : 'lg:left-auto lg:-right-5'
                }`}>
                {fase.numero}
              </motion.span>

              <motion.div
                initial={{ opacity: 0, x: derecha ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, ease: 'easeOut' }}
                className="card card-elevable p-5 md:p-6 text-left">
                <p className="etiqueta mb-1">Fase {fase.numero}</p>
                <h3 className="titulo text-verde text-2xl mb-3">{fase.nombre}</h3>
                <p className="text-texto/80 text-sm leading-relaxed whitespace-pre-line">{fase.descripcion}</p>
                {fase.videoUrl && <div className="mt-4"><ReproductorVideo url={fase.videoUrl} titulo={fase.nombre} /></div>}
              </motion.div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

// Inicio: presenta el método (fases) e invita a Clases y a la Formación
function Inicio() {
  const [datos, setDatos] = useState({ fases: [], sobreMi: null, avisos: [], configuracion: {} })
  const [clases, setClases] = useState(null)
  const [cursos, setCursos] = useState(null)
  const [galeria, setGaleria] = useState({ fotos: [], reels: [] })
  const [fotoAbierta, setFotoAbierta] = useState(null) // índice en el visor
  const [videoAbierto, setVideoAbierto] = useState(null)

  useEffect(() => {
    obtenerDatosPublicos().then(setDatos).catch(() => {})
    obtenerClases().then(setClases).catch(() => setClases([]))
    obtenerCursos().then(setCursos).catch(() => setCursos([]))
    obtenerGaleria().then(setGaleria).catch(() => {})
  }, [])

  const { fases, sobreMi, avisos, configuracion } = datos
  const heroTitulo = configuracion.hero_titulo || 'Flowness'
  const heroSubtitulo = configuracion.hero_subtitulo || 'Movilidad · Flexibilidad · Mindfulness'
  const heroDescripcion = configuracion.hero_descripcion || 'Un método de movilidad, flexibilidad y mindfulness para moverte mejor y sentirte bien, cuerpo y mente en armonía.'

  const listaClases = clases || []
  const hayClaseGratis = listaClases.some((c) => c.esGratis)
  const clasesDestacadas = [...listaClases].sort((a, b) => Number(b.esGratis) - Number(a.esGratis)).slice(0, 3)
  const fotosDestacadas = galeria.fotos.slice(0, 8)
  const reelsDestacados = galeria.reels.slice(0, 8)

  return (
    <main className="pt-16 md:pt-20 overflow-x-clip">

      {/* ── PORTADA ──────────────────────────── */}
      <section className="relative isolate min-h-[88svh] flex flex-col items-center justify-center text-center px-5 py-16 overflow-hidden">
        {/* Manchas de color que "respiran" */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <span className="absolute -top-24 -left-24 w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full bg-verde/30 blur-3xl animate-respirar" />
          <span className="absolute top-1/3 -right-28 w-72 h-72 md:w-[26rem] md:h-[26rem] rounded-full bg-terracota/35 blur-3xl animate-respirar-lento" />
          <span className="absolute -bottom-24 left-1/4 w-72 h-72 md:w-[24rem] md:h-[24rem] rounded-full bg-arena/70 blur-3xl animate-respirar" />
        </div>

        <motion.p className="etiqueta mb-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {heroSubtitulo}
        </motion.p>
        <TituloAnimado texto={heroTitulo} />
        <motion.p className="text-texto/75 text-sm md:text-lg max-w-xl leading-relaxed mt-6 mb-10 whitespace-pre-line"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5 }}>
          {heroDescripcion}
        </motion.p>
        <motion.div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto max-w-xs sm:max-w-none"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.5 }}>
          <Link to="/clases" className="btn btn-primario btn-brillo">
            <PlayCircle size={16} /> {hayClaseGratis ? 'Probá una clase gratis' : 'Ver clases'}
          </Link>
          <Link to="/formacion" className="btn btn-secundario">Formación profesional</Link>
        </motion.div>

        {/* Fundido suave hacia la sección siguiente */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-crema -z-10" aria-hidden="true" />

        <a href="#metodo" aria-label="Bajar" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-verde/70 animate-bounce-slow">
          <ChevronDown size={28} />
        </a>
      </section>

      {/* ── NOVEDADES ────────────────────────── */}
      {avisos.length > 0 && (
        <section className="contenedor pb-4">
          <div className={`grid gap-4 ${avisos.length > 1 ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
            {avisos.map((aviso, i) => (
              <motion.article key={aviso.id} {...fadeUpScrollDelay(i * 0.08)} className="card-vidrio p-5 flex gap-4 items-start">
                <span className="icono-caja bg-terracota/20 text-terracota"><Megaphone size={20} /></span>
                <div>
                  <p className="etiqueta mb-1">Novedad</p>
                  <h3 className="font-semibold text-texto mb-1">{aviso.titulo}</h3>
                  <p className="text-texto/70 text-sm whitespace-pre-line">{aviso.descripcion}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {/* ── EL MÉTODO: LAS FASES ─────────────── */}
      {fases.length > 0 && (
        <section id="metodo" className="contenedor py-20 md:py-28 scroll-mt-20">
          <TituloSeccion
            etiqueta="El método"
            titulo={`Las ${fases.length} fases de Flowness`}
            texto="Cada clase recorre estas fases, una después de la otra. Así, en cada práctica trabajás el cuerpo y la mente de forma completa."
          />
          <LineaFases fases={fases} />
        </section>
      )}

      {/* ── CLASES ───────────────────────────── */}
      <section className="bg-blanco py-20 md:py-28">
        <div className="contenedor">
          <TituloSeccion
            etiqueta="Para todo público"
            titulo="Clases"
            texto={`Clases grabadas para hacer cuando quieras, a tu ritmo. ${hayClaseGratis ? 'Registrate y mirá la primera gratis; ' : ''}las demás las comprás de a una y quedan en tu cuenta para siempre.`}
          />
          {clases === null ? (
            <EsqueletoGrilla cantidad={3} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" />
          ) : clasesDestacadas.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {clasesDestacadas.map((clase, i) => (
                <motion.div key={clase.id} {...fadeUpScrollDelay(i * 0.1)}>
                  <Link to="/clases" className="card card-elevable group block h-full">
                    <div className="relative aspect-video bg-gradient-to-br from-verde/25 to-terracota/25 flex items-center justify-center overflow-hidden">
                      {clase.miniaturaUrl
                        ? <img src={imagenReducida(clase.miniaturaUrl, 600)} alt={clase.nombre} loading="lazy" className="zoom h-full w-full object-cover" />
                        : <img src="/logo.png" alt="" className="zoom h-14 w-14 opacity-40" />}
                      <span className={`chip absolute top-3 left-3 ${clase.esGratis ? 'chip-terracota' : 'chip-claro'}`}>
                        {clase.esGratis ? <><Sparkles size={12} /> Gratis</> : <><Lock size={11} /> {formatearPrecio(clase.precio)}</>}
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center bg-verde/0 group-hover:bg-verde/25 transition-colors">
                        <PlayCircle size={46} className="text-blanco opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="titulo text-verde text-xl mb-1">{clase.nombre}</h3>
                      {clase.duracion && <p className="text-piedra text-xs flex items-center gap-1"><Clock size={12} /> {clase.duracion}</p>}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          <motion.div {...fadeUpScroll} className="text-center">
            <Link to="/clases" className="btn btn-primario">
              {hayClaseGratis ? 'Empezá gratis' : 'Ver todas las clases'} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FORMACIÓN ────────────────────────── */}
      {(cursos === null || cursos.length > 0) && (
        <section className="contenedor py-20 md:py-28">
          <TituloSeccion
            etiqueta="Para profesionales"
            titulo="Formación Flowness"
            texto="Tres niveles para profesores de educación física, entrenadores y profesionales del movimiento. Método con marca registrada a nivel nacional."
          />
          {cursos === null ? (
            <EsqueletoGrilla cantidad={3} imagen="h-0" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {cursos.map((curso, i) => {
                const Icono = ICONOS_NIVEL[i % ICONOS_NIVEL.length]
                return (
                  <motion.div key={curso.id} {...fadeUpScrollDelay(i * 0.12)}>
                    <Link to={`/formacion/${curso.slug}`} className="card card-elevable group p-6 md:p-7 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-5">
                        <span className="icono-caja bg-verde/15 text-verde group-hover:bg-verde group-hover:text-blanco transition-colors"><Icono size={20} /></span>
                        <span className="titulo text-5xl text-terracota/30 leading-none">0{i + 1}</span>
                      </div>
                      <p className="etiqueta mb-1">{curso.subtitulo || `Nivel ${i + 1}`}</p>
                      <h3 className="titulo text-verde text-3xl mb-3">{curso.nombre}</h3>
                      {curso.descripcion && <p className="text-texto/75 text-sm leading-relaxed mb-5 line-clamp-3 flex-1">{curso.descripcion}</p>}
                      <div className="flex items-center justify-between pt-4 border-t border-terracota/15 mt-auto">
                        <p className="font-semibold text-texto">
                          {curso.disponibleParaComprar ? formatearPrecio(curso.precio) : 'Próximamente'}
                        </p>
                        <ArrowRight size={18} className="text-verde transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
          <motion.div {...fadeUpScroll} className="text-center">
            <Link to="/formacion" className="btn btn-secundario">Conocé la formación <ArrowRight size={16} /></Link>
          </motion.div>
        </section>
      )}

      {/* ── SOBRE MÍ ─────────────────────────── */}
      {sobreMi && (
        <section className="bg-arena/40 py-20 md:py-28">
          <div className="contenedor max-w-5xl flex flex-col md:flex-row gap-12 md:gap-16 items-center">
            {sobreMi.fotoUrl && (
              <motion.div {...fadeUpScroll} className="relative shrink-0">
                <span className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] border-2 border-terracota" aria-hidden="true" />
                <img src={imagenReducida(sobreMi.fotoUrl, 600)} alt={sobreMi.nombre}
                  className="relative w-60 h-72 md:w-72 md:h-88 rounded-[2rem] object-cover shadow-alta" />
              </motion.div>
            )}
            <motion.div {...fadeUpScrollDelay(0.15)} className="text-center md:text-left">
              <p className="etiqueta mb-3">Sobre mí</p>
              <h2 className="titulo text-verde text-4xl md:text-5xl mb-2">{sobreMi.nombre}</h2>
              <p className="text-piedra text-sm tracking-wide mb-5">{sobreMi.titulo}</p>
              <p className="text-texto/80 text-sm md:text-base leading-relaxed mb-7 line-clamp-6 whitespace-pre-line">{sobreMi.descripcion1}</p>
              <Link to="/sobre-mi" className="btn btn-secundario">Conocé mi historia <ArrowRight size={16} /></Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── GALERÍA: primero fotos, después videos ── */}
      {(fotosDestacadas.length > 0 || reelsDestacados.length > 0) && (
        <section className="contenedor py-20 md:py-28">
          <TituloSeccion etiqueta="Galería" titulo="Momentos Flowness" />

          {fotosDestacadas.length > 0 && (
            <div className="mb-14">
              <p className="flex items-center justify-center gap-2 text-verde text-xs font-semibold tracking-[0.2em] uppercase mb-5"><Images size={16} /> Fotos</p>
              <Carrusel claseEscritorio="items-start md:mx-0 md:px-0 md:overflow-visible md:flex-wrap md:justify-center md:gap-6">
                {fotosDestacadas.map((foto, i) => (
                  <motion.div key={foto.id} {...listItem(i)} className={i >= 4 ? 'md:hidden' : ''}>
                    <Medio item={{ ...foto, descripcion: null }} clase="foto" alAbrir={() => setFotoAbierta(i)} />
                  </motion.div>
                ))}
              </Carrusel>
            </div>
          )}

          {reelsDestacados.length > 0 && (
            <div className="mb-14">
              <p className="flex items-center justify-center gap-2 text-verde text-xs font-semibold tracking-[0.2em] uppercase mb-5"><Film size={16} /> Videos</p>
              <Carrusel claseEscritorio="items-start md:mx-0 md:px-0 md:overflow-visible md:flex-wrap md:justify-center md:gap-6">
                {reelsDestacados.map((reel, i) => (
                  <motion.div key={reel.id} {...fadeUpScrollDelay((i % 4) * 0.1)} className={i >= 4 ? 'md:hidden' : ''}><Medio item={reel} clase="video" alAbrir={() => setVideoAbierto(i)} /></motion.div>
                ))}
              </Carrusel>
            </div>
          )}

          <div className="text-center">
            <Link to="/galeria" className="btn btn-secundario">Ver galería completa <ArrowRight size={16} /></Link>
          </div>
        </section>
      )}

      {/* ── CIERRE ───────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-arena/60 py-20 md:py-28 text-center">
        <span className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-terracota/30 blur-3xl animate-respirar -z-10" aria-hidden="true" />
        <span className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-verde/25 blur-3xl animate-respirar-lento -z-10" aria-hidden="true" />
        <motion.div {...fadeUpScroll} className="contenedor max-w-2xl">
          <img src="/logo.png" alt="" className="w-14 h-14 mx-auto mb-5" />
          <h2 className="titulo text-verde text-3xl md:text-5xl mb-4">Empezá a moverte con Flowness</h2>
          <p className="text-texto/75 text-sm md:text-base mb-9">
            {hayClaseGratis ? 'Creá tu cuenta gratis y hacé tu primera clase hoy.' : 'Conocé las clases y la formación.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xs sm:max-w-none mx-auto">
            <Link to="/clases" className="btn btn-primario btn-brillo">
              <PlayCircle size={16} /> {hayClaseGratis ? 'Probá una clase gratis' : 'Ver clases'}
            </Link>
            <Link to="/formacion" className="btn btn-secundario">Formación profesional</Link>
          </div>
        </motion.div>
      </section>

      <VisorMedios items={fotosDestacadas} indice={fotoAbierta} alCambiar={setFotoAbierta} clase="foto" />
      <VisorMedios items={reelsDestacados} indice={videoAbierto} alCambiar={setVideoAbierto} clase="video" />
    </main>
  )
}

export default Inicio
