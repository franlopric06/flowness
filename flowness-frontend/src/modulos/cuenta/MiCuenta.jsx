import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, GraduationCap, PlayCircle, Sparkles, CheckCircle2, Clapperboard } from 'lucide-react'
import ReproductorVideo from '../../compartido/componentes/ReproductorVideo'
import Modal from '../../compartido/componentes/Modal'
import EstadoVacio from '../../compartido/componentes/EstadoVacio'
import { EsqueletoGrilla } from '../../compartido/componentes/Esqueleto'
import { fadeUpDelay, fadeUpScrollDelay } from '../../compartido/utilidades/animaciones'
import { imagenReducida } from '../../compartido/utilidades/medios'
import { obtenerClases } from '../clases/clases.servicio'
import { obtenerCursos } from '../formacion/formacion.servicio'

function TituloBloque({ icono: Icono, children }) {
  return (
    <h2 className="flex items-center gap-3 titulo text-verde text-3xl mb-6">
      <Icono size={22} className="text-terracota" /> {children}
    </h2>
  )
}

function MiCuenta() {
  const [misClases, setMisClases] = useState([])
  const [misCursos, setMisCursos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [claseAbierta, setClaseAbierta] = useState(null)
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  useEffect(() => {
    Promise.all([
      obtenerClases().then((clases) => setMisClases(clases.filter((c) => c.tieneAcceso))).catch(() => {}),
      obtenerCursos().then((cursos) => setMisCursos(cursos.filter((c) => c.comprado))).catch(() => {}),
    ]).finally(() => setCargando(false))
  }, [])

  return (
    <main className="min-h-screen pb-20">
      <header className="relative isolate overflow-hidden pt-28 md:pt-36 pb-10">
        <span className="absolute -top-20 -right-16 w-80 h-80 rounded-full bg-terracota/25 blur-3xl animate-respirar -z-10" aria-hidden="true" />
        <div className="contenedor">
          <motion.p {...fadeUpDelay(0)} className="etiqueta mb-2">Mi cuenta</motion.p>
          <motion.h1 {...fadeUpDelay(0.08)} className="titulo text-verde text-5xl md:text-6xl">Hola, {usuario.nombre?.split(' ')[0] || 'bienvenida/o'}</motion.h1>
          <motion.p {...fadeUpDelay(0.16)} className="text-texto/70 mt-3">Acá tenés todo lo que es tuyo, para ver cuando quieras.</motion.p>
        </div>
      </header>

      <div className="contenedor space-y-16">
        {/* Formación comprada */}
        {misCursos.length > 0 && (
          <section>
            <TituloBloque icono={GraduationCap}>Tu formación</TituloBloque>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {misCursos.map((curso, i) => {
                const total = curso.totalVideos || curso.leccionesPublicadas || 0
                const porcentaje = total ? Math.round(((curso.leccionesPublicadas || 0) / total) * 100) : 0
                return (
                  <motion.div key={curso.id} {...fadeUpScrollDelay(i * 0.08)}>
                    <Link to={`/formacion/${curso.slug}`} className="card card-elevable group block p-6 h-full">
                      <p className="etiqueta mb-1">{curso.subtitulo || 'Formación'}</p>
                      <h3 className="titulo text-verde text-3xl mb-4">{curso.nombre}</h3>
                      <div className="h-1.5 rounded-full bg-arena/60 overflow-hidden mb-2">
                        <div className="h-full bg-verde rounded-full" style={{ width: `${porcentaje}%` }} />
                      </div>
                      <p className="text-piedra text-xs mb-5">
                        {curso.leccionesPublicadas} {curso.leccionesPublicadas === 1 ? 'lección disponible' : 'lecciones disponibles'}
                        {curso.totalVideos ? ` de ${curso.totalVideos}` : ''}
                      </p>
                      <span className="inline-flex items-center gap-2 text-verde text-xs font-semibold tracking-[0.16em] uppercase">
                        Ir al curso <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </section>
        )}

        {/* Clases */}
        <section>
          <TituloBloque icono={PlayCircle}>Tus clases</TituloBloque>
          {cargando ? (
            <EsqueletoGrilla cantidad={3} />
          ) : misClases.length === 0 ? (
            <EstadoVacio icono={Clapperboard} titulo="Todavía no tenés clases" texto="Empezá con la clase gratis o elegí la que más te guste.">
              <Link to="/clases" className="btn btn-primario">Ver clases <ArrowRight size={16} /></Link>
            </EstadoVacio>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {misClases.map((clase, i) => (
                <motion.button key={clase.id} {...fadeUpScrollDelay((i % 3) * 0.08)} onClick={() => setClaseAbierta(clase)}
                  className="card card-elevable group text-left">
                  <div className="relative aspect-video bg-gradient-to-br from-verde/25 to-terracota/25 flex items-center justify-center overflow-hidden">
                    {clase.miniaturaUrl
                      ? <img src={imagenReducida(clase.miniaturaUrl, 600)} alt={clase.nombre} loading="lazy" className="zoom h-full w-full object-cover" />
                      : <img src="/logo.png" alt="" className="zoom h-14 w-14 opacity-40" />}
                    <span className="absolute inset-0 flex items-center justify-center bg-verde/0 group-hover:bg-verde/25 transition-colors">
                      <PlayCircle size={50} className="text-blanco drop-shadow opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    </span>
                  </div>
                  <div className="p-5">
                    <span className={`chip mb-2 ${clase.esGratis ? 'chip-terracota' : 'chip-verde'}`}>
                      {clase.esGratis ? <><Sparkles size={11} /> Gratis</> : <><CheckCircle2 size={11} /> Comprada</>}
                    </span>
                    <h3 className="titulo text-verde text-2xl">{clase.nombre}</h3>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal abierto={!!claseAbierta} alCerrar={() => setClaseAbierta(null)} titulo={claseAbierta?.nombre}>
        {claseAbierta && <ReproductorVideo url={claseAbierta.videoUrl} titulo={claseAbierta.nombre} />}
      </Modal>
    </main>
  )
}

export default MiCuenta
