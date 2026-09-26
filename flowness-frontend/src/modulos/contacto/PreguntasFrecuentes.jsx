import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { usePreguntas } from '../../compartido/hooks/usePreguntas'

// Lista de preguntas frecuentes que se abren al tocarlas (las mismas del asistente)
function PreguntasFrecuentes() {
  const preguntas = usePreguntas()
  const [abierta, setAbierta] = useState(null)

  if (!preguntas?.length) return null

  return (
    <section className="contenedor max-w-2xl mt-16" aria-labelledby="titulo-preguntas">
      <h2 id="titulo-preguntas" className="titulo text-verde text-3xl md:text-4xl text-center mb-6">Preguntas frecuentes</h2>
      <div className="card divide-y divide-terracota/15">
        {preguntas.map((p) => {
          const estaAbierta = abierta === p.id
          return (
            <div key={p.id}>
              <button type="button" onClick={() => setAbierta(estaAbierta ? null : p.id)} aria-expanded={estaAbierta}
                className="w-full flex items-center gap-3 text-left px-5 py-4 hover:bg-crema/50 transition-colors">
                <span className="flex-1 font-medium text-texto text-sm md:text-base">{p.pregunta}</span>
                <ChevronDown size={18} className={`text-verde shrink-0 transition-transform ${estaAbierta ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {estaAbierta && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-texto/80 text-sm leading-relaxed whitespace-pre-line">{p.respuesta}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default PreguntasFrecuentes
