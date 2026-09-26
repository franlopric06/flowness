import { Check, X, Star, MessageSquareReply, Trash2 } from 'lucide-react'
import Estrellas from '../../../compartido/componentes/resenas/Estrellas'
import { botonVerde, botonBorde, botonGris, botonIcono } from '../componentes/estilos'

const ESTADO = {
  PENDIENTE: ['Por revisar', 'bg-arena/60 text-texto'],
  APROBADA: ['Publicada', 'chip-verde'],
  RECHAZADA: ['Rechazada', 'bg-error/10 text-error'],
}

const fecha = (texto) => new Date(texto).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })

// Una reseña en el panel: quién, qué compró, el comentario y los botones para moderarla
function TarjetaResenaAdmin({ resena, alModerar, alResponder, alEliminar }) {
  const [textoEstado, claseEstado] = ESTADO[resena.estado] || ESTADO.PENDIENTE
  const producto = resena.clase ? `Clase · ${resena.clase.nombre}` : resena.curso ? `Formación · ${resena.curso.nombre}` : ''

  return (
    <article className="card p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
        <Estrellas valor={resena.estrellas} tamano={16} />
        <span className={`chip ${claseEstado}`}>{textoEstado}</span>
        {resena.destacada && <span className="chip chip-terracota"><Star size={11} /> En el Inicio</span>}
        <span className="text-piedra text-xs ml-auto">{fecha(resena.creadoEn)}</span>
      </div>

      <p className="text-sm text-texto"><strong>{resena.usuario?.nombre}</strong> <span className="text-piedra">· {resena.usuario?.email}</span></p>
      <p className="text-xs text-verde font-medium mb-3">{producto}</p>

      {resena.texto
        ? <p className="text-texto/85 text-sm leading-relaxed whitespace-pre-line bg-crema/60 rounded-lg p-3">{resena.texto}</p>
        : <p className="text-piedra text-xs italic">Solo dejó las estrellas, sin comentario.</p>}

      {resena.respuesta && (
        <div className="mt-3 pl-4 border-l-2 border-verde/40">
          <p className="text-verde text-xs font-semibold mb-1">Tu respuesta</p>
          <p className="text-texto/75 text-sm whitespace-pre-line">{resena.respuesta}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {resena.estado !== 'APROBADA' && <button onClick={() => alModerar({ estado: 'APROBADA' })} className={botonVerde}><Check size={14} /> Publicar</button>}
        {resena.estado !== 'RECHAZADA' && <button onClick={() => alModerar({ estado: 'RECHAZADA' })} className={botonGris}><X size={14} /> Rechazar</button>}
        {resena.estado === 'APROBADA' && (
          <button onClick={() => alModerar({ destacada: !resena.destacada })} className={botonBorde}>
            <Star size={14} /> {resena.destacada ? 'Sacar del Inicio' : 'Mostrar en el Inicio'}
          </button>
        )}
        <button onClick={alResponder} className={botonBorde}><MessageSquareReply size={14} /> {resena.respuesta ? 'Editar respuesta' : 'Responder'}</button>
        <button onClick={alEliminar} className={`${botonIcono} text-error self-center ml-auto`} title="Eliminar" aria-label="Eliminar reseña"><Trash2 size={14} /></button>
      </div>
    </article>
  )
}

export default TarjetaResenaAdmin
