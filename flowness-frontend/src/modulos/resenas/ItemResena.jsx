import { BadgeCheck } from 'lucide-react'
import Estrellas from '../../compartido/componentes/resenas/Estrellas'

const fecha = (texto) => new Date(texto).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })

// Una reseña publicada, con la respuesta de Florencia si la hay
function ItemResena({ resena }) {
  return (
    <article className="py-5 border-b border-terracota/15 last:border-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
        <Estrellas valor={resena.estrellas} tamano={15} />
        <span className="font-semibold text-sm text-texto">{resena.autor}</span>
        <span className="inline-flex items-center gap-1 text-[0.7rem] text-verde"><BadgeCheck size={13} /> Opinión verificada</span>
        <span className="text-piedra text-xs">{fecha(resena.fecha)}</span>
      </div>
      {resena.texto && <p className="text-texto/85 text-sm leading-relaxed whitespace-pre-line">{resena.texto}</p>}
      {resena.respuesta && (
        <div className="mt-3 ml-3 pl-4 border-l-2 border-verde/40">
          <p className="text-verde text-xs font-semibold mb-1">Respuesta de Florencia</p>
          <p className="text-texto/75 text-sm leading-relaxed whitespace-pre-line">{resena.respuesta}</p>
        </div>
      )}
    </article>
  )
}

export default ItemResena
