// Fechas en la hora de Argentina (así "este mes" es el mes de Florencia, no el de UTC)
const ZONA = 'America/Argentina/Buenos_Aires'

// 'AAAA-MM' del momento dado, en Argentina
export const mesDe = (fecha) => new Date(fecha).toLocaleDateString('en-CA', { timeZone: ZONA }).slice(0, 7)

// Los últimos N meses como 'AAAA-MM', del más viejo al actual
export function ultimosMeses(cantidad, hoy = new Date()) {
  const [anio, mes] = mesDe(hoy).split('-').map(Number)
  return Array.from({ length: cantidad }, (_, i) => {
    const d = new Date(Date.UTC(anio, mes - 1 - (cantidad - 1 - i), 1))
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
  })
}
