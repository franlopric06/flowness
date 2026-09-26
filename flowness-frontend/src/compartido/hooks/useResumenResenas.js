import { useEffect, useState } from 'react'
import { obtenerResumen } from '../servicios/resenas.servicio'

// Promedio de estrellas de todas las clases y cursos. Se pide una sola vez
// y lo comparten todas las tarjetas.
const VACIO = { clases: {}, cursos: {} }
let pedido = null

export function useResumenResenas() {
  const [resumen, setResumen] = useState(VACIO)
  useEffect(() => {
    pedido = pedido || obtenerResumen().catch(() => { pedido = null; return VACIO })
    let activo = true
    pedido.then((r) => { if (activo) setResumen(r || VACIO) })
    return () => { activo = false }
  }, [])
  return resumen
}
