import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, FileText, CheckCircle2, PartyPopper } from 'lucide-react'
import ReproductorVideo from '../../../compartido/componentes/ReproductorVideo'
import EstadoVacio from '../../../compartido/componentes/EstadoVacio'
import { tabContent } from '../../../compartido/utilidades/animaciones'
import { urlVisorPdf } from '../../../compartido/utilidades/medios'
import ListaLecciones from './ListaLecciones'
import Volver from './Volver'
import SeccionResenas from '../../resenas/SeccionResenas'

// Aula: para quien ya compró el curso (video, material y lista de lecciones)
function Aula({ curso }) {
  const [actual, setActual] = useState(curso.lecciones[0] || null)
  const indice = actual ? curso.lecciones.findIndex((l) => l.id === actual.id) : -1

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

          <ListaLecciones curso={curso} actual={actual} alElegir={elegir} />
        </div>

        <div className="mt-14 max-w-3xl">
          <SeccionResenas producto={{ cursoId: curso.id }} titulo="Tu opinión sobre el curso" conFormulario />
        </div>
      </div>
    </main>
  )
}

export default Aula
