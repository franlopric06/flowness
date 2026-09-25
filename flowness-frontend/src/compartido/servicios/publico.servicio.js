import { peticion } from './cliente'

// Datos públicos del sitio (fases, sobre mí, fotos, avisos, configuración)
export const obtenerDatosPublicos = () => peticion('/publico')
