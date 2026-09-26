import { useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import FranjaMedios from '../../../compartido/componentes/pagos/FranjaMedios'
import { CATALOGO_MEDIOS, itemsDeLaFranja } from '../../../compartido/utilidades/mediosDePago'
import { estiloLabel, botonBorde } from '../componentes/estilos'

// Elegir qué medios de pago se muestran en la franja y agregar textos propios
// (por ejemplo "3 cuotas sin interés"). valor: { activos: [id], extras: [texto] }
function EditorMediosPago({ valor, alCambiar }) {
  const [nuevo, setNuevo] = useState('')

  const alternar = (id) => {
    const activos = valor.activos.includes(id) ? valor.activos.filter((a) => a !== id) : [...valor.activos, id]
    alCambiar({ ...valor, activos })
  }

  const agregarExtra = () => {
    const texto = nuevo.trim()
    if (!texto || valor.extras.includes(texto)) return
    alCambiar({ ...valor, extras: [...valor.extras, texto] })
    setNuevo('')
  }

  const quitarExtra = (texto) => alCambiar({ ...valor, extras: valor.extras.filter((t) => t !== texto) })

  return (
    <div>
      <label className={estiloLabel}>Qué se muestra</label>
      <p className="text-piedra text-xs mb-3">Tocá cada uno para mostrarlo u ocultarlo. Solo mostrá lo que realmente aceptás en tu cuenta de Mercado Pago.</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {CATALOGO_MEDIOS.map(({ id, Icono, texto }) => {
          const activo = valor.activos.includes(id)
          return (
            <button key={id} type="button" onClick={() => alternar(id)} aria-pressed={activo}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium border transition-colors ${
                activo ? 'bg-verde text-blanco border-verde' : 'bg-blanco text-texto/60 border-piedra/40 hover:border-verde'
              }`}>
              {activo ? <Check size={14} /> : <Icono size={14} />} {texto}
            </button>
          )
        })}
      </div>

      <label className={estiloLabel}>Textos propios (opcional)</label>
      <div className="flex gap-2 mb-3">
        <input value={nuevo} onChange={(e) => setNuevo(e.target.value)} maxLength={60}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); agregarExtra() } }}
          placeholder='Ej: "3 cuotas sin interés con Visa"' className="input" />
        <button type="button" onClick={agregarExtra} className={botonBorde}><Plus size={14} /> Agregar</button>
      </div>
      {valor.extras.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {valor.extras.map((texto) => (
            <span key={texto} className="inline-flex items-center gap-1.5 rounded-full bg-arena/50 pl-3.5 pr-1.5 py-1.5 text-xs">
              {texto}
              <button type="button" onClick={() => quitarExtra(texto)} aria-label={`Quitar ${texto}`}
                className="w-6 h-6 inline-flex items-center justify-center rounded-full hover:bg-blanco"><X size={12} /></button>
            </span>
          ))}
        </div>
      )}

      <label className={estiloLabel}>Así se ve</label>
      <div className="rounded-xl border border-terracota/20 bg-blanco overflow-hidden">
        {valor.activos.length + valor.extras.length > 0
          ? <FranjaMedios items={itemsDeLaFranja(valor)} />
          : <p className="text-piedra text-xs p-4">No elegiste ninguno: la franja no se va a mostrar.</p>}
      </div>
    </div>
  )
}

export default EditorMediosPago
