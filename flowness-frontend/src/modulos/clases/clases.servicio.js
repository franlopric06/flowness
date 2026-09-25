import { peticion } from '../../compartido/servicios/cliente'

// Fases del método
export const obtenerFases = () => peticion('/fases')
export const crearFase = (datos) => peticion('/fases', { method: 'POST', body: JSON.stringify(datos) })
export const actualizarFase = (id, datos) => peticion(`/fases/${id}`, { method: 'PUT', body: JSON.stringify(datos) })
export const eliminarFase = (id) => peticion(`/fases/${id}`, { method: 'DELETE' })

// Clases
export const obtenerClases = () => peticion('/clases')
export const obtenerClase = (id) => peticion(`/clases/${id}`)
export const crearClase = (datos) => peticion('/clases', { method: 'POST', body: JSON.stringify(datos) })
export const actualizarClase = (id, datos) => peticion(`/clases/${id}`, { method: 'PUT', body: JSON.stringify(datos) })
export const eliminarClase = (id) => peticion(`/clases/${id}`, { method: 'DELETE' })
