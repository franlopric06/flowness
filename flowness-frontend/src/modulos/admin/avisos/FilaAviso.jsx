import { Pencil, Eye, EyeOff, Trash2, CalendarClock } from 'lucide-react'
import { tipoDeAviso } from '../../../compartido/utilidades/tiposAviso'
import { estaVencida } from '../../../compartido/utilidades/fechas'
import { botonBorde, botonGris, botonIcono } from '../componentes/estilos'

// Muestra una fecha 'AAAA-MM-DD' como 'DD/MM/AAAA'
const fechaLinda = (texto) => texto.split('-').reverse().join('/')

// Estado del aviso: visible, oculto o vencido
function EstadoAviso({ aviso }) {
  if (!aviso.activo) return <span className="chip bg-piedra/20 text-texto/60"><EyeOff size={11} /> Oculto</span>
  if (estaVencida(aviso)) return <span className="chip bg-alerta/10 text-alerta"><CalendarClock size={11} /> Vencido</span>
  return <span className="chip chip-verde"><Eye size={11} /> Visible</span>
}

// Un aviso en la lista del panel
function FilaAviso({ aviso, alEditar, alCambiarVisibilidad, alEliminar }) {
  const { nombre, Icono, icono } = tipoDeAviso(aviso.tipo)
  const apagado = !aviso.activo || estaVencida(aviso)

  return (
    <div className={`card p-3 flex flex-col sm:flex-row sm:items-center gap-3 ${apagado ? 'opacity-70' : ''}`}>
      <div className="h-14 aspect-video rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-crema">
        {aviso.imagenUrl
          ? <img src={aviso.imagenUrl} alt="" className="h-full w-full object-cover" />
          : <span className={`icono-caja ${icono}`}><Icono size={18} /></span>}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-texto truncate">{aviso.titulo}</p>
        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px]">
          <span className="text-piedra">{nombre}</span>
          <EstadoAviso aviso={aviso} />
          {aviso.hasta && <span className="text-piedra">hasta el {fechaLinda(aviso.hasta)}</span>}
        </div>
      </div>

      <div className="flex gap-2 shrink-0">
        <button onClick={alEditar} className={botonBorde}><Pencil size={13} /> Editar</button>
        <button onClick={alCambiarVisibilidad} className={botonGris}>
          {aviso.activo ? <><EyeOff size={13} /> Ocultar</> : <><Eye size={13} /> Mostrar</>}
        </button>
        <button onClick={alEliminar} className={`${botonIcono} text-error self-center`} title="Eliminar" aria-label="Eliminar aviso">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default FilaAviso
