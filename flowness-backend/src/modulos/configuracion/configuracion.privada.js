// Las claves que empiezan con "privado_" (por ejemplo el token de Instagram)
// se guardan en la misma tabla pero NUNCA salen del servidor ni se editan
// desde el panel.
export const esPrivada = (clave) => clave.startsWith('privado_')

// Convierte las filas de la tabla en { clave: valor }, sin las privadas
export const configuracionPublica = (filas) => {
  const resultado = {}
  filas.forEach(({ clave, valor }) => { if (!esPrivada(clave)) resultado[clave] = valor })
  return resultado
}
