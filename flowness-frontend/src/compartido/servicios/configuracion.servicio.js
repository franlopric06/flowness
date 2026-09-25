import { peticion } from './cliente'

export const obtenerConfiguracion = () => peticion('/configuracion')
export const actualizarConfiguracion = (datos) =>
  peticion('/configuracion', { method: 'PUT', body: JSON.stringify(datos) })
