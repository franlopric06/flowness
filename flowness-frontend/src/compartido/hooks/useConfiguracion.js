import { useEffect, useState } from 'react'
import { obtenerConfiguracion } from '../servicios/configuracion.servicio'

// La configuración del sitio se pide UNA sola vez y la comparten todos los
// componentes (pie de página, WhatsApp, cartel, franja de pagos, etc.)
let pedido = null
let guardada = null

const pedir = () => {
  pedido = pedido || obtenerConfiguracion()
    .then((config) => { guardada = config || {}; return guardada })
    .catch(() => { pedido = null; return {} })
  return pedido
}

// Después de guardar en el panel, la próxima lectura trae lo nuevo
export const olvidarConfiguracion = () => { pedido = null; guardada = null }

// Devuelve la configuración, o null mientras todavía no llegó
export function useConfiguracionLista() {
  const [config, setConfig] = useState(guardada)
  useEffect(() => {
    let activo = true
    pedir().then((c) => { if (activo) setConfig(c) })
    return () => { activo = false }
  }, [])
  return config
}

// Devuelve la configuración ({} mientras carga o si falla)
export function useConfiguracion() {
  return useConfiguracionLista() || {}
}
