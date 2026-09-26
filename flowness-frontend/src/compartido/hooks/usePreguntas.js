import { useEffect, useState } from 'react'
import { obtenerPreguntas } from '../servicios/preguntas.servicio'

// Las preguntas frecuentes se piden una sola vez y las comparten el asistente y Contacto.
// Devuelve null mientras cargan.
let pedido = null

export function usePreguntas(activo = true) {
  const [preguntas, setPreguntas] = useState(null)
  useEffect(() => {
    if (!activo) return
    pedido = pedido || obtenerPreguntas().catch(() => { pedido = null; return [] })
    let vigente = true
    pedido.then((lista) => { if (vigente) setPreguntas(lista || []) })
    return () => { vigente = false }
  }, [activo])
  return preguntas
}
