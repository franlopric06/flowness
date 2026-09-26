import { peticion } from './cliente'

// producto: { claseId } o { cursoId }
const consulta = (producto) => `?${new URLSearchParams(producto)}`

export const obtenerResenas = (producto) => peticion(`/resenas${consulta(producto)}`)
export const obtenerMia = (producto) => peticion(`/resenas/mia${consulta(producto)}`)
export const guardarMia = (producto, datos) => peticion('/resenas', { method: 'POST', body: JSON.stringify({ ...producto, ...datos }) })
export const obtenerResumen = () => peticion('/resenas/resumen')
export const obtenerDestacadas = () => peticion('/resenas/destacadas')
