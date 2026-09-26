import { ChevronLeft, ChevronRight, Pencil, Eye, EyeOff, Trash2, Loader2, Link2, Download } from 'lucide-react'
import Medio from '../../../compartido/componentes/Medio'
import { botonIcono } from '../componentes/estilos'
import { CONFIG, mayuscula, terminacion } from './configMedios'

// Una foto o video en el panel: se ve igual que en la página, con sus botones abajo
function TarjetaMedioAdmin({ item, clase, esPrimero, esUltimo, trayendo, instagramConectado, acciones }) {
  const c = CONFIG[clase]
  const origen = item.tipo === 'INSTAGRAM' ? 'Recuadro de Instagram' : item.enlace ? 'De Instagram' : `Subid${terminacion(c)}`

  return (
    <div className={`medio ${item.activo ? '' : 'opacity-50'}`}>
      <Medio item={{ ...item, descripcion: null }} clase={clase} />
      <p className="text-[11px] text-piedra mt-2 w-full truncate" title={item.descripcion || ''}>
        {origen}
        {item.descripcion ? ` · ${item.descripcion}` : ''}
        {!item.activo && ` · ${mayuscula(c.oculta)}`}
      </p>
      <div className="flex flex-wrap gap-1 mt-2">
        <button onClick={() => acciones.mover(-1)} disabled={esPrimero} className={botonIcono} title="Mover antes" aria-label="Mover antes"><ChevronLeft size={16} /></button>
        <button onClick={() => acciones.mover(1)} disabled={esUltimo} className={botonIcono} title="Mover después" aria-label="Mover después"><ChevronRight size={16} /></button>
        <button onClick={acciones.editarDescripcion} className={botonIcono} title="Editar descripción" aria-label="Editar descripción"><Pencil size={14} /></button>
        {item.tipo === 'INSTAGRAM' && instagramConectado && (
          <button onClick={acciones.traerArchivo} disabled={trayendo} className={`${botonIcono} text-verde`}
            title="Traer el archivo de Instagram" aria-label="Traer el archivo de Instagram">
            {trayendo ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          </button>
        )}
        {item.tipo === 'INSTAGRAM' && (
          <button onClick={acciones.cambiarLink} className={botonIcono} title="Cambiar link" aria-label="Cambiar link"><Link2 size={14} /></button>
        )}
        <button onClick={acciones.alternar} className={botonIcono} title={item.activo ? 'Ocultar' : 'Mostrar'} aria-label={item.activo ? 'Ocultar' : 'Mostrar'}>
          {item.activo ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
        <button onClick={acciones.eliminar} className={`${botonIcono} text-error`} title="Eliminar" aria-label="Eliminar"><Trash2 size={14} /></button>
      </div>
    </div>
  )
}

export default TarjetaMedioAdmin
