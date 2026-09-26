import { Eye, EyeOff, Trash2 } from 'lucide-react'
import { DESTINOS, estaVencida } from '../../../compartido/utilidades/promociones'
import { estiloLabel, botonIcono } from '../componentes/estilos'

// Estado que se muestra arriba de cada promo
function EstadoPromo({ promo }) {
  if (!promo.activa) return <span className="chip bg-piedra/20 text-texto/60">Oculta</span>
  if (estaVencida(promo)) return <span className="chip bg-alerta/10 text-alerta">Vencida</span>
  return <span className="chip chip-verde">Visible</span>
}

// Una promoción en el panel: texto, botón, hasta cuándo y si se ve
function FilaPromo({ promo, alCambiar, alQuitar }) {
  const cambiar = (campo, valor) => alCambiar({ ...promo, [campo]: valor })

  return (
    <div className="rounded-xl border border-terracota/20 bg-crema/40 p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <EstadoPromo promo={promo} />
        <div className="flex gap-2">
          <button type="button" onClick={() => cambiar('activa', !promo.activa)} className={botonIcono}
            title={promo.activa ? 'Ocultar' : 'Mostrar'} aria-label={promo.activa ? 'Ocultar promoción' : 'Mostrar promoción'}>
            {promo.activa ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button type="button" onClick={alQuitar} className={`${botonIcono} text-error`} title="Eliminar" aria-label="Eliminar promoción">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <label className={estiloLabel}>Mensaje</label>
      <input value={promo.texto} onChange={(e) => cambiar('texto', e.target.value)} maxLength={110}
        placeholder='Ej: "Comprando 2 clases, la segunda te la regalo"' className="input mb-3" />

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className={estiloLabel}>Botón</label>
          <select value={promo.destino} onChange={(e) => cambiar('destino', e.target.value)} className="input">
            {DESTINOS.map(([valor, texto]) => <option key={valor} value={valor}>{texto}</option>)}
          </select>
        </div>
        <div>
          <label className={estiloLabel}>Se muestra hasta (opcional)</label>
          <input type="date" value={promo.hasta} onChange={(e) => cambiar('hasta', e.target.value)} className="input" />
        </div>
        {promo.destino === 'link' && (
          <div className="sm:col-span-2">
            <label className={estiloLabel}>Link</label>
            <input value={promo.enlace} onChange={(e) => cambiar('enlace', e.target.value)}
              placeholder="https://... o /formacion/nivel-1" className="input" />
          </div>
        )}
      </div>
    </div>
  )
}

export default FilaPromo
