import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useVibrar } from '../../compartido/hooks/useVibrar'
import ReproductorVideo from '../../compartido/componentes/ReproductorVideo'
import Reel from '../../compartido/componentes/Reel'
import { formatearPrecio } from '../../compartido/utilidades/video'
import { imagenReducida } from '../../compartido/utilidades/medios'
import { obtenerDatosPublicos } from '../../compartido/servicios/publico.servicio'
import { obtenerClases } from '../clases/clases.servicio'
import { obtenerCursos } from '../formacion/formacion.servicio'
import { obtenerGaleria } from '../galeria/galeria.servicio'

const botonVerde = 'bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-[#5a7a56] transition-colors'
const botonBorde = 'border border-[#D8A48F] text-[#D8A48F] text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-[#D8A48F]/10 transition-colors'

// Encabezado de cada sección
function Titulo({ etiqueta, titulo, texto }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-10">
      <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-2">{etiqueta}</p>
      <h2 className="text-[#7B9B77] text-2xl md:text-3xl font-bold tracking-widest mb-3">{titulo}</h2>
      {texto && <p className="text-[#A9A9A2] text-sm leading-relaxed">{texto}</p>}
    </div>
  )
}

// Inicio: presenta el método (6 fases) e invita a Clases y a la Formación
function Inicio() {
  const [datos, setDatos] = useState({ fases: [], sobreMi: null, avisos: [], configuracion: {} })
  const [clases, setClases] = useState([])
  const [cursos, setCursos] = useState([])
  const [galeria, setGaleria] = useState({ fotos: [], reels: [] })
  const vibrar = useVibrar()

  useEffect(() => {
    obtenerDatosPublicos().then(setDatos).catch(() => {})
    obtenerClases().then(setClases).catch(() => {})
    obtenerCursos().then(setCursos).catch(() => {})
    obtenerGaleria().then(setGaleria).catch(() => {})
  }, [])

  const { fases, sobreMi, avisos, configuracion } = datos
  const heroTitulo = configuracion.hero_titulo || 'Flowness'
  const heroSubtitulo = configuracion.hero_subtitulo || 'Movilidad · Flexibilidad · Mindfulness'
  const heroDescripcion = configuracion.hero_descripcion || 'Un método de movilidad, flexibilidad y mindfulness en seis fases, para moverte mejor y sentirte bien.'

  const hayClaseGratis = clases.some((c) => c.esGratis)
  const clasesDestacadas = [...clases].sort((a, b) => Number(b.esGratis) - Number(a.esGratis)).slice(0, 3)
  const fotosDestacadas = galeria.fotos.slice(0, 6)
  const reelDestacado = galeria.reels[0]

  return (
    <main className="pt-20">

      {/* ── HERO ─────────────────────────────── */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 bg-[#F5F0EB]">
        <img src="/logo.png" alt="" className="w-20 h-20 mb-6 opacity-90" />
        <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-4">{heroSubtitulo}</p>
        <h1 className="text-[#7B9B77] text-5xl md:text-7xl font-bold tracking-widest mb-6">{heroTitulo}</h1>
        <p className="text-[#A9A9A2] text-sm md:text-base max-w-lg leading-relaxed mb-10 whitespace-pre-line">{heroDescripcion}</p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/clases" onClick={vibrar} className={botonVerde}>
            {hayClaseGratis ? 'Probá una clase gratis' : 'Ver clases'}
          </Link>
          <Link to="/formacion" onClick={vibrar} className={botonBorde}>Formación profesional</Link>
        </div>
      </section>

      {/* ── AVISOS ───────────────────────────── */}
      {avisos.length > 0 && (
        <section className="bg-[#7B9B77]/10 border-y border-[#7B9B77]/20 px-6 py-8 md:px-16">
          <p className="text-[#7B9B77] text-xs tracking-widest uppercase mb-4 text-center">Novedades</p>
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap max-w-5xl mx-auto">
            {avisos.map((aviso) => (
              <div key={aviso.id} className="bg-white rounded-2xl p-5 border border-[#7B9B77]/20 flex-1 md:min-w-64">
                <p className="text-[#555] font-medium mb-1">{aviso.titulo}</p>
                <p className="text-[#888] text-sm whitespace-pre-line">{aviso.descripcion}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── LAS 6 FASES ──────────────────────── */}
      {fases.length > 0 && (
        <section className="px-6 py-20 md:px-16 bg-white">
          <Titulo
            etiqueta="El método"
            titulo={`Las ${fases.length} fases de Flowness`}
            texto="Cada clase recorre estas fases, una después de la otra. Así, en cada práctica trabajás el cuerpo y la mente de forma completa."
          />
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {fases.map((fase) => (
              <li key={fase.id} className="relative bg-[#F5F0EB] rounded-2xl overflow-hidden border border-[#D8A48F]/20 flex flex-col">
                {fase.videoUrl && <ReproductorVideo url={fase.videoUrl} titulo={fase.nombre} />}
                <div className="p-6 flex-1">
                  <span className="text-[#7B9B77]/25 text-6xl font-bold leading-none absolute top-3 right-5 select-none">{fase.numero}</span>
                  <p className="text-[#D8A48F] text-[10px] tracking-widest uppercase mb-1">Fase {fase.numero}</p>
                  <h3 className="text-[#7B9B77] font-semibold tracking-widest uppercase mb-3 pr-10">{fase.nombre}</h3>
                  <p className="text-[#555] text-sm leading-relaxed whitespace-pre-line">{fase.descripcion}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── CLASES ───────────────────────────── */}
      <section className="px-6 py-20 md:px-16 bg-[#F5F0EB]">
        <Titulo
          etiqueta="Para todo público"
          titulo="Clases"
          texto={`Clases grabadas para hacer cuando quieras, a tu ritmo. ${hayClaseGratis ? 'Registrate y mirá la primera gratis; ' : ''}las demás las comprás de a una y quedan en tu cuenta para siempre.`}
        />
        {clasesDestacadas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            {clasesDestacadas.map((clase) => (
              <Link key={clase.id} to="/clases" onClick={vibrar}
                className="bg-white rounded-2xl overflow-hidden border border-[#D8A48F]/20 hover:shadow-md transition-shadow">
                <div className="relative aspect-video bg-gradient-to-br from-[#7B9B77]/25 to-[#D8A48F]/25 flex items-center justify-center">
                  {clase.miniaturaUrl
                    ? <img src={imagenReducida(clase.miniaturaUrl, 600)} alt={clase.nombre} loading="lazy" className="h-full w-full object-cover" />
                    : <img src="/logo.png" alt="" className="h-14 w-14 opacity-40" />}
                  <span className={`absolute top-3 left-3 text-[10px] tracking-widest uppercase px-3 py-1 rounded-full ${clase.esGratis ? 'bg-[#D8A48F] text-white' : 'bg-white/90 text-[#7B9B77]'}`}>
                    {clase.esGratis ? 'Gratis' : formatearPrecio(clase.precio)}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-[#7B9B77] font-semibold text-sm tracking-widest uppercase mb-1">{clase.nombre}</h3>
                  {clase.duracion && <p className="text-[#A9A9A2] text-xs">{clase.duracion}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center">
          <Link to="/clases" onClick={vibrar} className={botonVerde}>
            {hayClaseGratis ? 'Empezá gratis' : 'Ver todas las clases'}
          </Link>
        </div>
      </section>

      {/* ── FORMACIÓN ────────────────────────── */}
      {cursos.length > 0 && (
        <section className="px-6 py-20 md:px-16 bg-white">
          <Titulo
            etiqueta="Para profesionales"
            titulo="Formación Flowness"
            texto="Tres niveles para profesores de educación física, entrenadores y profesionales del movimiento. Método con marca registrada a nivel nacional."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            {cursos.map((curso) => (
              <Link key={curso.id} to={`/formacion/${curso.slug}`} onClick={vibrar}
                className="bg-[#F5F0EB] rounded-2xl p-6 border border-[#D8A48F]/20 hover:shadow-md transition-shadow flex flex-col">
                <p className="text-[#D8A48F] text-[10px] tracking-widest uppercase mb-1">{curso.subtitulo || 'Nivel'}</p>
                <h3 className="text-[#7B9B77] font-bold tracking-widest uppercase mb-3">{curso.nombre}</h3>
                {curso.descripcion && <p className="text-[#555] text-sm leading-relaxed mb-4 line-clamp-3 flex-1">{curso.descripcion}</p>}
                <p className="text-[#555] font-semibold text-sm">
                  {curso.disponibleParaComprar ? formatearPrecio(curso.precio) : 'Próximamente'}
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link to="/formacion" onClick={vibrar} className={botonBorde}>Conocé la formación</Link>
          </div>
        </section>
      )}

      {/* ── SOBRE MÍ ─────────────────────────── */}
      {sobreMi && (
        <section className="px-6 py-20 md:px-16 bg-[#F5F0EB]">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-center">
            {sobreMi.fotoUrl && (
              <img src={imagenReducida(sobreMi.fotoUrl, 500)} alt={sobreMi.nombre}
                className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-[#D8A48F]/30 shrink-0" />
            )}
            <div>
              <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-2">Sobre mí</p>
              <h2 className="text-[#7B9B77] text-2xl font-bold tracking-widest mb-2">{sobreMi.nombre}</h2>
              <p className="text-[#A9A9A2] text-sm mb-4">{sobreMi.titulo}</p>
              <p className="text-[#555] text-sm leading-relaxed mb-6 line-clamp-5 whitespace-pre-line">{sobreMi.descripcion1}</p>
              <Link to="/sobre-mi" onClick={vibrar} className="text-[#7B9B77] text-xs tracking-widest uppercase underline underline-offset-4">
                Conocé más sobre mí
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── GALERÍA ──────────────────────────── */}
      {(fotosDestacadas.length > 0 || reelDestacado) && (
        <section className="px-6 py-20 md:px-16 bg-white">
          <Titulo etiqueta="Galería" titulo="Momentos" />
          <div className={`max-w-6xl mx-auto grid gap-4 mb-10 ${reelDestacado && fotosDestacadas.length ? 'grid-cols-1 md:grid-cols-[320px_1fr]' : 'grid-cols-1'}`}>
            {reelDestacado && <div className="max-w-sm mx-auto w-full"><Reel reel={reelDestacado} /></div>}
            {fotosDestacadas.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 content-start">
                {fotosDestacadas.map((foto) => (
                  <Link key={foto.id} to="/galeria" onClick={vibrar} className="block overflow-hidden rounded-xl group">
                    <img src={imagenReducida(foto.url, 500)} alt={foto.descripcion || ''} loading="lazy"
                      className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="text-center">
            <Link to="/galeria" onClick={vibrar} className={botonBorde}>Ver galería completa</Link>
          </div>
        </section>
      )}

      {/* ── CIERRE ───────────────────────────── */}
      <section className="px-6 py-20 md:px-16 bg-[#7B9B77] text-center">
        <h2 className="text-white text-2xl md:text-3xl font-bold tracking-widest mb-4">Empezá a moverte con Flowness</h2>
        <p className="text-white/80 text-sm max-w-md mx-auto mb-8">
          {hayClaseGratis ? 'Creá tu cuenta gratis y hacé tu primera clase hoy.' : 'Conocé las clases y la formación.'}
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/clases" onClick={vibrar} className="bg-white text-[#7B9B77] text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-[#F5F0EB] transition-colors">
            {hayClaseGratis ? 'Probá una clase gratis' : 'Ver clases'}
          </Link>
          <Link to="/formacion" onClick={vibrar} className="border border-white text-white text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-white/10 transition-colors">
            Formación profesional
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Inicio
