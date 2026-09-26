import { useState } from 'react'
import { FlaskConical, CheckCircle2, MessageCircleOff } from 'lucide-react'
import { buscarRespuesta } from '../../../compartido/utilidades/buscarRespuesta'
import { estiloLabel } from '../componentes/estilos'

// Para probar cómo responde el asistente sin salir del panel
function ProbarAsistente({ preguntas }) {
  const [texto, setTexto] = useState('')
  const activas = preguntas.filter((p) => p.activo)
  const { mejor } = texto.trim() ? buscarRespuesta(texto, activas) : { mejor: undefined }

  return (
    <div className="card p-4 md:p-5 mb-5 bg-crema/40">
      <label className={`${estiloLabel} flex items-center gap-1.5`}><FlaskConical size={13} /> Probá el asistente</label>
      <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribí una pregunta como la haría una alumna" className="input" />
      {mejor === null && (
        <p className="mt-3 text-sm text-alerta flex items-start gap-2">
          <MessageCircleOff size={16} className="shrink-0 mt-0.5" />
          No encuentra respuesta: ofrecería escribir por WhatsApp. Si es una duda común, agregala como pregunta nueva o sumá esas palabras en "Otras formas de preguntarlo".
        </p>
      )}
      {mejor && (
        <div className="mt-3 text-sm">
          <p className="text-verde font-semibold flex items-center gap-2"><CheckCircle2 size={16} /> Respondería: {mejor.pregunta}</p>
          <p className="text-texto/70 text-xs mt-1 line-clamp-3 whitespace-pre-line">{mejor.respuesta}</p>
        </div>
      )}
    </div>
  )
}

export default ProbarAsistente
