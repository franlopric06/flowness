// Arma los datos de una pregunta frecuente. Devuelve { datos } o { error }
const limpiar = (valor) => (valor == null ? '' : String(valor).trim())

export function datosDePregunta(cuerpo = {}) {
  const pregunta = limpiar(cuerpo.pregunta)
  const respuesta = limpiar(cuerpo.respuesta)
  if (!pregunta) return { error: 'Escribí la pregunta' }
  if (!respuesta) return { error: 'Escribí la respuesta' }
  if (pregunta.length > 200) return { error: 'La pregunta es muy larga (máximo 200 letras)' }
  if (respuesta.length > 1500) return { error: 'La respuesta es muy larga (máximo 1500 letras)' }

  const datos = {
    pregunta,
    respuesta,
    // Se guardan separadas por coma, sin repetidas ni vacías
    palabrasClave: [...new Set(limpiar(cuerpo.palabrasClave).split(',').map((p) => p.trim()).filter(Boolean))].join(', ').slice(0, 500),
  }
  if (cuerpo.orden !== undefined) datos.orden = parseInt(cuerpo.orden, 10) || 0
  if (cuerpo.activo !== undefined) datos.activo = Boolean(cuerpo.activo)
  return { datos }
}
