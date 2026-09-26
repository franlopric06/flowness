import { Pencil, Eye, EyeOff, Sparkles, Clock, ShoppingBag, VideoOff } from 'lucide-react'
import { formatearPrecio } from '../../../compartido/utilidades/video'
import { botonBorde, botonGris } from '../componentes/estilos'

// Una clase en la lista del panel: miniatura, datos y botones
function FilaClase({ clase, alEditar, alCambiarVisibilidad }) {
  return (
    <div className={`card p-3 flex flex-col sm:flex-row sm:items-center gap-3 ${clase.activo ? '' : 'opacity-60'}`}>
      <div className="h-16 aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-verde/25 to-terracota/25 shrink-0 flex items-center justify-center">
        {clase.miniaturaUrl
          ? <img src={clase.miniaturaUrl} alt="" className="h-full w-full object-cover" />
          : <img src="/logo.png" alt="" className="h-8 w-8 opacity-40" />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="titulo text-verde text-xl truncate">{clase.orden}. {clase.nombre}</p>
        <div className="flex flex-wrap gap-2 mt-1 text-[11px]">
          <span className={`chip ${clase.esGratis ? 'chip-terracota' : 'bg-arena/60 text-texto'}`}>
            {clase.esGratis ? <><Sparkles size={11} /> Gratis</> : formatearPrecio(clase.precio)}
          </span>
          {clase.duracion && <span className="flex items-center gap-1 text-piedra"><Clock size={12} /> {clase.duracion}</span>}
          {!clase.esGratis && <span className="flex items-center gap-1 text-piedra"><ShoppingBag size={12} /> {clase.ventas} {clase.ventas === 1 ? 'venta' : 'ventas'}</span>}
          {!clase.videoUrl && <span className="flex items-center gap-1 text-error"><VideoOff size={12} /> Sin video</span>}
          {!clase.activo && <span className="flex items-center gap-1 text-error"><EyeOff size={12} /> Oculta</span>}
        </div>
      </div>

      <div className="flex gap-2 shrink-0">
        <button onClick={alEditar} className={botonBorde}><Pencil size={13} /> Editar</button>
        <button onClick={alCambiarVisibilidad} className={botonGris}>
          {clase.activo ? <><EyeOff size={13} /> Ocultar</> : <><Eye size={13} /> Publicar</>}
        </button>
      </div>
    </div>
  )
}

export default FilaClase
