import { motion } from 'framer-motion'
import { PlayCircle, FileText, Hourglass } from 'lucide-react'

// Columna del aula con todas las lecciones (y las que faltan publicar)
function ListaLecciones({ curso, actual, alElegir }) {
  const faltan = Math.max((curso.totalVideos || 0) - curso.lecciones.length, 0)
  const total = curso.totalVideos || curso.lecciones.length
  const progreso = total ? Math.round((curso.lecciones.length / total) * 100) : 0

  return (
    <aside className="card h-fit lg:sticky lg:top-28">
      <div className="px-5 py-4 border-b border-terracota/15">
        <p className="text-verde text-xs font-semibold tracking-[0.18em] uppercase mb-2">
          Lecciones · {curso.lecciones.length}{curso.totalVideos ? ` de ${curso.totalVideos}` : ''}
        </p>
        {curso.totalVideos > 0 && (
          <div className="h-1.5 rounded-full bg-arena/60 overflow-hidden" title="Lecciones publicadas">
            <motion.div className="h-full bg-verde rounded-full" initial={{ width: 0 }} animate={{ width: `${progreso}%` }} transition={{ duration: 0.8 }} />
          </div>
        )}
      </div>
      <ol className="max-h-[60vh] overflow-y-auto divide-y divide-terracota/10">
        {curso.lecciones.map((leccion, i) => {
          const activa = actual?.id === leccion.id
          return (
            <li key={leccion.id}>
              <button onClick={() => alElegir(leccion)}
                className={`w-full text-left flex items-center gap-3 px-5 py-3.5 text-sm transition-colors ${activa ? 'bg-verde/10 text-verde font-medium' : 'text-texto hover:bg-crema'}`}>
                {activa
                  ? <PlayCircle size={18} className="text-verde shrink-0" />
                  : <span className="titulo text-terracota text-lg w-[18px] text-center shrink-0">{i + 1}</span>}
                <span className="flex-1">{leccion.titulo}</span>
                {leccion.pdfUrl && <FileText size={14} className="text-piedra shrink-0" aria-label="Tiene PDF" />}
              </button>
            </li>
          )
        })}
        {Array.from({ length: faltan }).map((_, i) => (
          <li key={`proxima-${i}`} className="flex items-center gap-3 px-5 py-3.5 text-sm text-piedra">
            <span className="titulo text-lg w-[18px] text-center">{curso.lecciones.length + i + 1}</span>
            <span className="flex-1 italic">Próximamente</span>
            <Hourglass size={14} />
          </li>
        ))}
      </ol>
    </aside>
  )
}

export default ListaLecciones
