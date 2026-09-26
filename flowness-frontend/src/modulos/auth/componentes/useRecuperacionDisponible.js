import { useEffect, useState } from 'react'
import { estadoRecuperacion } from '../auth.servicio'

// ¿El sitio puede mandar el email de recuperación? (si no, no se muestra el link)
let pedido = null

export function useRecuperacionDisponible() {
  const [disponible, setDisponible] = useState(false)
  useEffect(() => {
    pedido = pedido || estadoRecuperacion().then((r) => !!r.disponible).catch(() => { pedido = null; return false })
    let activo = true
    pedido.then((d) => { if (activo) setDisponible(d) })
    return () => { activo = false }
  }, [])
  return disponible
}
