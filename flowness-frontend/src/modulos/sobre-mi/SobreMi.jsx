import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, PlayCircle, Quote, UserRound } from 'lucide-react'
import EstadoVacio from '../../compartido/componentes/EstadoVacio'
import ReproductorVideo from '../../compartido/componentes/ReproductorVideo'
import { fadeUpDelay, fadeUpScroll } from '../../compartido/utilidades/animaciones'
import { imagenReducida } from '../../compartido/utilidades/medios'
import { obtenerDatosPublicos } from '../../compartido/servicios/publico.servicio'

function SobreMi() {
  const [sobreMi, setSobreMi] = useState(undefined) // undefined = cargando, null = sin datos

  useEffect(() => {
    obtenerDatosPublicos().then((d) => setSobreMi(d.sobreMi || null)).catch(() => setSobreMi(null))
  }, [])

  if (sobreMi === undefined) {
    return (
      <main className="contenedor pt-32 min-h-screen grid md:grid-cols-[320px_1fr] gap-10" role="status" aria-label="Cargando">
        <div className="esqueleto aspect-[4/5] rounded-xl" />
        <div className="space-y-4">
          <div className="esqueleto h-3 w-24" /><div className="esqueleto h-12 w-2/3" />
          <div className="esqueleto h-3 w-full" /><div className="esqueleto h-3 w-5/6" /><div className="esqueleto h-3 w-4/6" />
        </div>
      </main>
    )
  }

  if (!sobreMi) {
    return <main className="contenedor pt-32 min-h-screen"><EstadoVacio icono={UserRound} titulo="Muy pronto" texto="Esta sección se está preparando." /></main>
  }

  return (
    <main className="min-h-screen overflow-x-clip">
      <section className="relative isolate pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <span className="absolute top-10 -left-24 w-80 h-80 rounded-full bg-verde/20 blur-3xl animate-respirar" />
          <span className="absolute bottom-0 -right-24 w-80 h-80 rounded-full bg-terracota/25 blur-3xl animate-respirar-lento" />
        </div>

        {/* Si hay video de la historia, va arriba y ocupa todo el ancho (en vez de la foto) */}
        {sobreMi.videoUrl && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="contenedor max-w-4xl mb-12">
            <div className="rounded-xl overflow-hidden shadow-alta bg-black">
              <ReproductorVideo url={sobreMi.videoUrl} titulo="La historia de Flowness" />
            </div>
          </motion.div>
        )}
        <div className={`contenedor grid gap-12 md:gap-16 items-start ${sobreMi.videoUrl ? 'max-w-3xl' : 'max-w-5xl md:grid-cols-[minmax(0,340px)_1fr]'}`}>
          {sobreMi.fotoUrl && !sobreMi.videoUrl && (
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              className="relative mx-auto md:mx-0 w-64 md:w-full md:sticky md:top-28">
              <span className="absolute inset-0 translate-x-4 translate-y-4 rounded-xl border-2 border-terracota" aria-hidden="true" />
              <img src={imagenReducida(sobreMi.fotoUrl, 800)} alt={sobreMi.nombre}
                className="relative w-full aspect-[4/5] rounded-xl object-cover shadow-alta" />
            </motion.div>
          )}

          <div className="text-center md:text-left">
            <motion.p {...fadeUpDelay(0.1)} className="etiqueta mb-3">Sobre mí</motion.p>
            <motion.h1 {...fadeUpDelay(0.18)} className="titulo text-verde text-5xl md:text-6xl leading-tight">{sobreMi.nombre}</motion.h1>
            {sobreMi.titulo && <motion.p {...fadeUpDelay(0.26)} className="text-piedra tracking-wide mt-3">{sobreMi.titulo}</motion.p>}
            <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.35 }}
              className="block h-px w-16 my-7 mx-auto md:mx-0 bg-terracota origin-left" aria-hidden="true" />

            {sobreMi.descripcion1 && (
              <motion.p {...fadeUpDelay(0.35)} className="text-texto/85 text-base leading-relaxed whitespace-pre-line mb-8 text-left">{sobreMi.descripcion1}</motion.p>
            )}
            {sobreMi.descripcion2 && (
              <motion.blockquote {...fadeUpScroll} className="card-vidrio p-6 md:p-7 relative text-left mb-10">
                <Quote size={28} className="text-terracota/60 mb-3" />
                <p className="text-texto/85 leading-relaxed whitespace-pre-line">{sobreMi.descripcion2}</p>
              </motion.blockquote>
            )}

            <motion.div {...fadeUpScroll} className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link to="/clases" className="btn btn-primario"><PlayCircle size={16} /> Ver clases</Link>
              <Link to="/formacion" className="btn btn-secundario">Formación <ArrowRight size={16} /></Link>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default SobreMi
