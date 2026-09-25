import { peticion } from '../../compartido/servicios/cliente'

// Público
export const obtenerGaleria = () => peticion('/galeria')

// Panel de administración
export const obtenerGaleriaAdmin = () => peticion('/galeria/admin')
export const crearFoto = (datos) => peticion('/galeria/fotos', { method: 'POST', body: JSON.stringify(datos) })
export const actualizarFoto = (id, datos) => peticion(`/galeria/fotos/${id}`, { method: 'PUT', body: JSON.stringify(datos) })
export const eliminarFoto = (id) => peticion(`/galeria/fotos/${id}`, { method: 'DELETE' })
export const crearReel = (datos) => peticion('/galeria/reels', { method: 'POST', body: JSON.stringify(datos) })
export const actualizarReel = (id, datos) => peticion(`/galeria/reels/${id}`, { method: 'PUT', body: JSON.stringify(datos) })
export const eliminarReel = (id) => peticion(`/galeria/reels/${id}`, { method: 'DELETE' })
