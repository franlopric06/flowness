import { motion } from 'framer-motion'
import { Megaphone } from 'lucide-react'
import { fadeUpScrollDelay } from '../../../compartido/utilidades/animaciones'

// Avisos cargados en el panel, debajo de la portada
function Novedades({ avisos }) {
  if (!avisos.length) return null
  return (
    <section className="contenedor pt-10 pb-4">
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
  )
}

export default Novedades
