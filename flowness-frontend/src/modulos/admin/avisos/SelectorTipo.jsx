import { TIPOS_AVISO } from '../../../compartido/utilidades/tiposAviso'
import { estiloLabel } from '../componentes/estilos'

// Botones para elegir el tipo de aviso (novedad, clase gratis o promo)
function SelectorTipo({ valor, alCambiar }) {
  return (
    <div>
      <label className={estiloLabel}>Tipo de aviso</label>
      <div className="flex flex-wrap gap-2">
        {Object.entries(TIPOS_AVISO).map(([clave, { nombre, Icono }]) => {
          const activo = valor === clave
          return (
            <button key={clave} type="button" onClick={() => alCambiar(clave)} aria-pressed={activo}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold border transition-colors ${
                activo ? 'bg-verde text-blanco border-verde' : 'bg-blanco text-texto/70 border-piedra/40 hover:border-verde'
              }`}>
              <Icono size={14} /> {nombre}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SelectorTipo
