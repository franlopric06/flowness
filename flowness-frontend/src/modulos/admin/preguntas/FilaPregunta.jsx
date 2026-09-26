import { ChevronUp, ChevronDown, Pencil, Eye, EyeOff, Trash2 } from 'lucide-react'
import { botonIcono } from '../componentes/estilos'

// Una pregunta en la lista del panel, con botones para ordenar, editar, ocultar y borrar
function FilaPregunta({ pregunta, esPrimera, esUltima, alSubir, alBajar, alEditar, alCambiarVisibilidad, alEliminar }) {
  return (
    <div className={`card p-4 flex gap-3 ${pregunta.activo ? '' : 'opacity-60'}`}>
      <div className="flex flex-col gap-1 shrink-0">
        <button type="button" onClick={alSubir} disabled={esPrimera} className={botonIcono} aria-label="Subir"><ChevronUp size={14} /></button>
        <button type="button" onClick={alBajar} disabled={esUltima} className={botonIcono} aria-label="Bajar"><ChevronDown size={14} /></button>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-texto">{pregunta.pregunta}</p>
        <p className="text-texto/65 text-xs mt-1 line-clamp-2 whitespace-pre-line">{pregunta.respuesta}</p>
        {pregunta.palabrasClave && <p className="text-piedra text-[0.7rem] mt-1.5 truncate">También: {pregunta.palabrasClave}</p>}
        {!pregunta.activo && <p className="text-error text-[0.7rem] mt-1 flex items-center gap-1"><EyeOff size={11} /> Oculta: el asistente no la usa</p>}
      </div>
      <div className="flex flex-col sm:flex-row gap-1.5 shrink-0 self-start">
        <button type="button" onClick={alEditar} className={botonIcono} title="Editar" aria-label="Editar"><Pencil size={14} /></button>
        <button type="button" onClick={alCambiarVisibilidad} className={botonIcono} title={pregunta.activo ? 'Ocultar' : 'Mostrar'} aria-label={pregunta.activo ? 'Ocultar' : 'Mostrar'}>
          {pregunta.activo ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        <button type="button" onClick={alEliminar} className={`${botonIcono} text-error`} title="Eliminar" aria-label="Eliminar"><Trash2 size={14} /></button>
      </div>
    </div>
  )
}

export default FilaPregunta
