// Valores del formulario de preguntas frecuentes
export const PREGUNTA_VACIA = { pregunta: '', respuesta: '', palabrasClave: '', activo: true }

export const datosDePregunta = (p) => ({
  pregunta: p.pregunta || '', respuesta: p.respuesta || '', palabrasClave: p.palabrasClave || '', activo: p.activo,
})
