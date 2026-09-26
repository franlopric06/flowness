import { useState } from 'react'
import { Clock, CheckCircle2, XCircle, Loader2, Send } from 'lucide-react'
import SelectorEstrellas from '../../compartido/componentes/resenas/SelectorEstrellas'
import { avisar } from '../../compartido/utilidades/avisos'
import { guardarMia } from '../../compartido/servicios/resenas.servicio'

const ESTADOS = {
  PENDIENTE: { Icono: Clock, texto: 'Tu opinión está esperando aprobación. Se publica en cuanto Florencia la revise.', clase: 'bg-arena/40 text-texto/80' },
  APROBADA: { Icono: CheckCircle2, texto: '¡Tu opinión está publicada! Gracias por compartirla.', clase: 'bg-verde/10 text-verde' },
  RECHAZADA: { Icono: XCircle, texto: 'Tu opinión no se publicó. Podés editarla y volver a enviarla.', clase: 'bg-error/5 text-error' },
}

// La reseña propia: si todavía no opinó, el formulario; si ya opinó, su estado y la opción de editar
function FormularioResena({ producto, inicial, alGuardar }) {
  const [editando, setEditando] = useState(!inicial)
  const [estrellas, setEstrellas] = useState(inicial?.estrellas || 0)
  const [texto, setTexto] = useState(inicial?.texto || '')
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    if (!estrellas) return avisar('Elegí de 1 a 5 estrellas', 'alerta')
    setEnviando(true)
    try {
      const guardada = await guardarMia(producto, { estrellas, texto })
      avisar('¡Gracias! Tu opinión se publica cuando Florencia la apruebe.')
      setEditando(false)
      alGuardar(guardada)
    } catch { /* el aviso de error lo muestra el cliente de la API */ }
    setEnviando(false)
  }

  if (!editando && inicial) {
    const { Icono, texto: mensaje, clase } = ESTADOS[inicial.estado] || ESTADOS.PENDIENTE
    return (
      <div className={`rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${clase}`}>
        <p className="flex items-start gap-2 text-sm flex-1"><Icono size={17} className="shrink-0 mt-0.5" /> {mensaje}</p>
        <button type="button" onClick={() => setEditando(true)} className="btn btn-chico btn-secundario shrink-0">Editar mi opinión</button>
      </div>
    )
  }

  return (
    <form onSubmit={enviar} className="card-vidrio p-5">
      <p className="font-semibold text-texto mb-3">{inicial ? 'Editar tu opinión' : '¿Qué te pareció?'}</p>
      <SelectorEstrellas valor={estrellas} alCambiar={setEstrellas} />
      <textarea rows={3} value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={1000}
        placeholder="Contá tu experiencia (opcional)" className="input mt-4" />
      <div className="flex flex-wrap items-center gap-3 mt-3">
        <button type="submit" disabled={enviando} className="btn btn-chico btn-primario">
          {enviando ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Enviar opinión
        </button>
        {inicial && <button type="button" onClick={() => setEditando(false)} className="btn btn-chico text-texto/60">Cancelar</button>}
        <span className="text-piedra text-xs">Se muestra tu nombre y la inicial del apellido.</span>
      </div>
    </form>
  )
}

export default FormularioResena
