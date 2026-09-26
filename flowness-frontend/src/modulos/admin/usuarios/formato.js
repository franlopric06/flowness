// Formatos que se repiten en Usuarios, Compras y Métricas
export { formatearPrecio } from '../../../compartido/utilidades/video'

export const fechaCorta = (texto) =>
  new Date(texto).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const fechaHora = (texto) =>
  new Date(texto).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

// '2026-09' → 'sep' (o 'septiembre 2026' con largo = true)
export const nombreMes = (clave, largo = false) => {
  const [anio, mes] = clave.split('-').map(Number)
  const fecha = new Date(anio, mes - 1, 1)
  return largo
    ? fecha.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
    : fecha.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '')
}

// Estado del pago de Mercado Pago, en palabras y con su color
export const ESTADO_PAGO = {
  APROBADO: { texto: 'Pagado', clase: 'chip-verde' },
  PENDIENTE: { texto: 'Pendiente', clase: 'bg-arena/70 text-texto' },
  RECHAZADO: { texto: 'Rechazado', clase: 'bg-error/10 text-error' },
}

// Qué compró: "Clase · Columna libre" o "Formación · Esencial"
export const productoDeCompra = (c) =>
  c.curso ? `Formación · ${c.curso.nombre}` : c.clase ? `Clase · ${c.clase.nombre}` : 'Producto eliminado'
