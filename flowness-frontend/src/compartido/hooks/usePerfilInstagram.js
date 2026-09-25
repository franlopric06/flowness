import { useEffect, useState } from 'react'
import { obtenerConfiguracion } from '../servicios/configuracion.servicio'

const PERFIL_POR_DEFECTO = 'https://instagram.com/flownessargentina'
let pedido = null // se pide una sola vez y lo comparten todas las tarjetas

// Link al perfil de Instagram de Flowness (el que está cargado en Configuración)
export function usePerfilInstagram() {
  const [perfil, setPerfil] = useState(PERFIL_POR_DEFECTO)
  useEffect(() => {
    pedido = pedido || obtenerConfiguracion().then((c) => c.instagram_url || PERFIL_POR_DEFECTO).catch(() => PERFIL_POR_DEFECTO)
    let activo = true
    pedido.then((url) => { if (activo) setPerfil(url) })
    return () => { activo = false }
  }, [])
  return perfil
}
