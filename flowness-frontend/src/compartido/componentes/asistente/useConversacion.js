import { useCallback, useState } from 'react'
import { buscarRespuesta } from '../../utilidades/buscarRespuesta'

const BIENVENIDA = {
  id: 'hola',
  de: 'asistente',
  texto: '¡Hola! Soy el asistente de Flowness. Elegí una de estas preguntas o escribí la tuya.',
  sugerencias: true,
}

let contador = 0
const nuevoId = () => `m${++contador}`

// Maneja la charla del asistente: lo que pregunta la persona y lo que se responde.
// Cada mensaje: { id, de: 'usuario' | 'asistente', texto, faq?, otras?, derivar?, consulta? }
export function useConversacion(preguntas) {
  const [mensajes, setMensajes] = useState([BIENVENIDA])

  const agregar = (...nuevos) => setMensajes((lista) => [...lista, ...nuevos.map((m) => ({ id: nuevoId(), ...m }))])

  // La persona escribió algo o tocó una sugerencia
  const preguntar = useCallback((texto) => {
    const consulta = String(texto || '').trim()
    if (!consulta) return
    const { mejor, otras } = buscarRespuesta(consulta, preguntas || [])
    agregar(
      { de: 'usuario', texto: consulta },
      mejor
        ? { de: 'asistente', texto: mejor.respuesta, faq: mejor, otras, consulta }
        : {
            de: 'asistente',
            texto: 'No encontré una respuesta para eso. Escribile a Florencia por WhatsApp y te responde personalmente.',
            otras, derivar: true, consulta,
          },
    )
  }, [preguntas])

  // Tocó "No" en "¿Te sirvió?"
  const noSirvio = useCallback((consulta) => {
    agregar({ de: 'asistente', texto: 'Perdón. Escribile a Florencia por WhatsApp y te responde personalmente.', derivar: true, consulta })
  }, [])

  const reiniciar = useCallback(() => setMensajes([BIENVENIDA]), [])

  return { mensajes, preguntar, noSirvio, reiniciar }
}
