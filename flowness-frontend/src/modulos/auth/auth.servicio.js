import { peticion } from '../../compartido/servicios/cliente'

export const registrar = (datos) =>
  peticion('/auth/registrar', { method: 'POST', body: JSON.stringify(datos) })
export const iniciarSesion = (datos) =>
  peticion('/auth/iniciar-sesion', { method: 'POST', body: JSON.stringify(datos) })
