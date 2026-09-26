import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Quote, BadgeCheck } from 'lucide-react'
import TituloSeccion from '../../../compartido/componentes/TituloSeccion'
import Estrellas from '../../../compartido/componentes/resenas/Estrellas'
import { fadeUpScrollDelay } from '../../../compartido/utilidades/animaciones'
import { obtenerDestacadas } from '../../../compartido/servicios/resenas.servicio'

// Testimonios: las reseñas que Florencia marcó como destacadas en el panel.
// Si no hay ninguna, la sección no aparece. En el celular se deslizan de costado.
function Testimonios() {
  const [lista, setLista] = useState([])

  useEffect(() => {
    obtenerDestacadas().then(setLista).catch(() => {})
  }, [])

  if (lista.length === 0) return null

  return (
    <section className="py-20 md:py-28 overflow-x-clip" aria-label="Testimonios">
      <div className="contenedor">
        <TituloSeccion etiqueta="Testimonios" titulo="Lo que dicen quienes ya se mueven con Flowness" />
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-5 px-5 pb-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:mx-0 md:px-0">
          {lista.map((t, i) => (
            <motion.figure key={t.id} {...fadeUpScrollDelay((i % 3) * 0.08)}
              className="card p-6 md:p-7 flex flex-col snap-start shrink-0 w-[85%] sm:w-[60%] md:w-auto">
              <Quote size={26} className="text-terracota/60 mb-3" aria-hidden="true" />
              <Estrellas valor={t.estrellas} tamano={16} className="mb-3" />
              {t.texto && <blockquote className="text-texto/85 text-sm leading-relaxed whitespace-pre-line flex-1">{t.texto}</blockquote>}
              <figcaption className="mt-5 pt-4 border-t border-terracota/15">
                <p className="font-semibold text-texto text-sm flex items-center gap-1.5">{t.autor} <BadgeCheck size={14} className="text-verde" aria-label="Opinión verificada" /></p>
                {t.producto && <p className="text-piedra text-xs mt-0.5">{t.producto}</p>}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonios
