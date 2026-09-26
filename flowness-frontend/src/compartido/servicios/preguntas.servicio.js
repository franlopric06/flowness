import { peticion } from './cliente'

// Preguntas frecuentes visibles (para el asistente y la página de Contacto)
export const obtenerPreguntas = () => peticion('/preguntas')
