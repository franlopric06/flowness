// Busca la pregunta frecuente que mejor responde lo que escribió la persona.
// Compara palabras (sin tildes, sin mayúsculas y sin palabras de relleno) con la
// pregunta y con sus "otras formas de preguntarlo". No usa inteligencia artificial:
// es rápido, gratis y siempre responde lo que Florencia escribió.

const RELLENO = new Set(('a al algo algun alguna como con cual cuales cuando de del el en es esta estan este esto hay la las le les lo los me mi mis o para pero por puedo que quiero se si su sus te tengo tu un una uno unos y ya yo vos hola buenas buen dia tarde noches gracias favor necesito saber quisiera consulta pregunta').split(' '))

const sinTildes = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

// Raíz de una palabra, para que "pago", "pagar" y "pagos" cuenten como la misma
const TERMINACIONES = ['aciones', 'acion', 'iendo', 'ando', 'ados', 'adas', 'ado', 'ada', 'ar', 'er', 'ir', 'as', 'os', 'es', 'a', 'o', 'e', 's']
const raiz = (p) => {
  const fin = TERMINACIONES.find((t) => p.endsWith(t) && p.length - t.length >= 3)
  return fin ? p.slice(0, -fin.length) : p
}

// "¿Cómo compro las clases?" → ['compr', 'clas']
export function palabras(texto = '') {
  return sinTildes(String(texto).toLowerCase())
    .replace(/[^a-z0-9ñ\s]/g, ' ')
    .split(/\s+/)
    .filter((p) => p.length > 1 && !RELLENO.has(p))
    .map(raiz)
}

// Dos raíces "se parecen" si son iguales o una contiene el principio de la otra (formacion / formaciones)
const seParecen = (a, b) => a === b || (Math.min(a.length, b.length) >= 5 && (a.startsWith(b) || b.startsWith(a)))

function puntaje(consulta, faq) {
  const buscadas = palabras(consulta)
  if (buscadas.length === 0) return 0
  const frases = String(faq.palabrasClave || '').split(',').map((f) => palabras(f)).filter((f) => f.length)
  const propias = [...palabras(faq.pregunta), ...frases.flat()]

  const coinciden = buscadas.filter((b) => propias.some((p) => seParecen(b, p))).length
  // Bonus si aparece una de las "otras formas de preguntarlo" completa
  const fraseEntera = frases.some((f) => f.length > 1 && f.every((p) => buscadas.some((b) => seParecen(b, p))))
  return coinciden / buscadas.length + (fraseEntera ? 0.5 : 0)
}

// Devuelve { mejor, otras } — mejor es null si ninguna responde bien
export function buscarRespuesta(consulta, preguntas = []) {
  const ordenadas = preguntas
    .map((faq) => ({ faq, puntos: puntaje(consulta, faq) }))
    .filter((r) => r.puntos > 0)
    .sort((a, b) => b.puntos - a.puntos)

  const [primera, ...resto] = ordenadas
  const alcanza = primera && primera.puntos >= 0.5
  return {
    mejor: alcanza ? primera.faq : null,
    otras: (alcanza ? resto : ordenadas).slice(0, 3).map((r) => r.faq),
  }
}
