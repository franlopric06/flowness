import { useConfiguracion } from './useConfiguracion'

const PERFIL_POR_DEFECTO = 'https://instagram.com/flownessargentina'

// Link al perfil de Instagram de Flowness (el que está cargado en Configuración)
export function usePerfilInstagram() {
  return useConfiguracion().instagram_url || PERFIL_POR_DEFECTO
}
