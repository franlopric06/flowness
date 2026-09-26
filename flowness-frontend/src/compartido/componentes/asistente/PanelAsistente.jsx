import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { X, SendHorizontal, RotateCcw, Loader2 } from 'lucide-react'
import BurbujaMensaje from './BurbujaMensaje'
import { useConversacion } from './useConversacion'

const SUGERENCIAS = 4 // cuántas preguntas se ofrecen al abrir

// Ventana del asistente: encabezado, la charla y el campo para escribir
function PanelAsistente({ preguntas, whatsapp, alCerrar }) {
  const { mensajes, preguntar, noSirvio, reiniciar } = useConversacion(preguntas)
  const [texto, setTexto] = useState('')
  const lista = useRef(null)
  const campo = useRef(null)

  // Baja solo al último mensaje
  useEffect(() => {
    lista.current?.scrollTo({ top: lista.current.scrollHeight, behavior: 'smooth' })
  }, [mensajes])

  useEffect(() => { campo.current?.focus() }, [])

  const enviar = (e) => {
    e.preventDefault()
    preguntar(texto)
    setTexto('')
  }

  return (
    <motion.section role="dialog" aria-label="Asistente de preguntas frecuentes"
      initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      onKeyDown={(e) => { if (e.key === 'Escape') alCerrar() }}
      className="fixed z-50 inset-x-3 bottom-3 md:inset-x-auto md:right-6 md:bottom-6 md:w-96 h-[min(34rem,78svh)] flex flex-col bg-blanco rounded-2xl shadow-alta border border-terracota/15 overflow-hidden">

      <header className="flex items-center gap-3 bg-verde text-blanco px-4 py-3">
        <img src="/logo-blanco.png" alt="" className="w-9 h-9" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight">Asistente Flowness</p>
          <p className="text-blanco/75 text-xs">Respuestas al instante</p>
        </div>
        <button type="button" onClick={reiniciar} className="p-2 rounded-full hover:bg-blanco/15" aria-label="Empezar de nuevo" title="Empezar de nuevo"><RotateCcw size={16} /></button>
        <button type="button" onClick={alCerrar} className="p-2 rounded-full hover:bg-blanco/15" aria-label="Cerrar asistente"><X size={18} /></button>
      </header>

      <div ref={lista} className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3" aria-live="polite">
        {preguntas === null ? (
          <p className="self-center flex items-center gap-2 text-piedra text-sm mt-6"><Loader2 size={16} className="animate-spin" /> Cargando…</p>
        ) : mensajes.map((m) => (
          <BurbujaMensaje key={m.id} mensaje={m} sugerencias={preguntas.slice(0, SUGERENCIAS)} whatsapp={whatsapp}
            alPreguntar={preguntar} alNoSirvio={noSirvio} />
        ))}
      </div>

      <form onSubmit={enviar} className="flex items-center gap-2 border-t border-terracota/15 p-2.5">
        <input ref={campo} value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={200}
          placeholder="Escribí tu pregunta…" aria-label="Tu pregunta" className="input !py-2.5 !text-sm flex-1" />
        <button type="submit" disabled={!texto.trim() || preguntas === null} aria-label="Enviar"
          className="w-10 h-10 shrink-0 rounded-full bg-verde text-blanco flex items-center justify-center disabled:opacity-40 hover:bg-verde-oscuro transition-colors">
          <SendHorizontal size={17} />
        </button>
      </form>
    </motion.section>
  )
}

export default PanelAsistente
