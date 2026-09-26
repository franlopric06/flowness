import { motion } from 'framer-motion'
import { FileText, Lock, PlusCircle, ListOrdered } from 'lucide-react'
import { fadeUpScroll, listItem } from '../../../compartido/utilidades/animaciones'

// Lista de lecciones (bloqueadas) que se ve antes de comprar
function TemarioCurso({ lecciones, faltan }) {
  return (
    <section>
      <motion.h2 {...fadeUpScroll} className="titulo text-verde text-3xl mb-5 flex items-center gap-3">
        <ListOrdered size={24} className="text-terracota" /> Temario
      </motion.h2>
      {lecciones.length === 0 && faltan === 0 ? (
        <p className="text-piedra text-sm">El temario se publica muy pronto.</p>
      ) : (
        <ol className="card divide-y divide-terracota/15">
          {lecciones.map((leccion, i) => (
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
  )
}

export default TemarioCurso
