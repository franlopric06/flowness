import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import IconoWhatsapp from '../IconoWhatsapp'

const chip = 'text-left text-xs rounded-full border border-verde/40 text-verde px-3 py-1.5 hover:bg-verde hover:text-blanco transition-colors'

// Botón para seguir la consulta por WhatsApp, con la pregunta ya escrita
function BotonWhatsappConsulta({ whatsapp, consulta }) {
  if (!whatsapp) return <p className="text-xs text-texto/60 mt-2">También podés escribir desde la página de Contacto.</p>
  const texto = consulta ? `Hola Flor! Tengo una consulta: ${consulta}` : 'Hola Flor! Tengo una consulta'
  return (
    <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`} target="_blank" rel="noreferrer"
      className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-blanco text-xs font-semibold px-4 py-2 hover:brightness-95">
      <IconoWhatsapp size={16} /> Escribir por WhatsApp
    </a>
  )
}

// Un mensaje de la charla (de la persona o del asistente)
function BurbujaMensaje({ mensaje, sugerencias, whatsapp, alPreguntar, alNoSirvio }) {
  const [calificado, setCalificado] = useState(null) // null | 'si' | 'no'

  if (mensaje.de === 'usuario') {
    return <p className="self-end max-w-[85%] rounded-2xl rounded-br-md bg-verde text-blanco text-sm px-3.5 py-2">{mensaje.texto}</p>
  }

  const listaChips = mensaje.sugerencias ? sugerencias : mensaje.otras || []

  return (
    <div className="self-start max-w-[92%]">
      <div className="rounded-2xl rounded-bl-md bg-crema text-texto text-sm px-3.5 py-2.5 whitespace-pre-line">
        {mensaje.texto}
        {mensaje.derivar && <div><BotonWhatsappConsulta whatsapp={whatsapp} consulta={mensaje.consulta} /></div>}
      </div>

      {mensaje.faq && (
        <div className="flex items-center gap-2 mt-1.5 ml-1 text-[0.7rem] text-texto/60">
          {calificado === null ? (
            <>
              ¿Te sirvió?
              <button type="button" onClick={() => setCalificado('si')} className="p-1 rounded-full hover:bg-verde/10 hover:text-verde" aria-label="Sí, me sirvió"><ThumbsUp size={13} /></button>
              <button type="button" onClick={() => { setCalificado('no'); alNoSirvio(mensaje.consulta) }} className="p-1 rounded-full hover:bg-error/10 hover:text-error" aria-label="No me sirvió"><ThumbsDown size={13} /></button>
            </>
          ) : calificado === 'si' ? '¡Genial! 🌿' : null}
        </div>
      )}

      {listaChips.length > 0 && (
        <div className="mt-2 flex flex-col items-start gap-1.5">
          {!mensaje.sugerencias && <p className="text-[0.7rem] text-texto/60 ml-1">{mensaje.faq ? 'También te puede interesar:' : '¿Quizás buscabas…?'}</p>}
          {listaChips.map((faq) => (
            <button key={faq.id} type="button" onClick={() => alPreguntar(faq.pregunta)} className={chip}>{faq.pregunta}</button>
          ))}
        </div>
      )}
    </div>
  )
}

export default BurbujaMensaje
