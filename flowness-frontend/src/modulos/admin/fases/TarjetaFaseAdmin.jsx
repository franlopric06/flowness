import { Pencil, Trash2, PlayCircle } from 'lucide-react'
import { botonBorde } from '../componentes/estilos'

// Una fase en el panel: número, nombre, descripción y botones
function TarjetaFaseAdmin({ fase, alEditar, alEliminar }) {
  return (
    <div className="card card-elevable p-5">
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 shrink-0 rounded-full bg-verde text-blanco flex items-center justify-center titulo text-lg">{fase.numero}</span>
        <div className="min-w-0">
          <p className="titulo text-verde text-xl">{fase.nombre}</p>
          {fase.videoUrl && <p className="flex items-center gap-1 text-terracota text-[0.65rem] tracking-widest uppercase"><PlayCircle size={12} /> Con video</p>}
        </div>
      </div>
      <p className="text-texto/60 text-xs mt-3 line-clamp-3">{fase.descripcion}</p>
      <div className="flex gap-2 mt-3">
        <button onClick={alEditar} className={botonBorde}><Pencil size={13} /> Editar</button>
        <button onClick={alEliminar} className="btn btn-chico border border-error/40 text-error hover:bg-error/5"><Trash2 size={13} /> Eliminar</button>
      </div>
    </div>
  )
}

export default TarjetaFaseAdmin
