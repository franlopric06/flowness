// Reglas de los avisos: qué tipos y botones existen y cómo se validan los datos

export const TIPOS = ['NOVEDAD', 'CLASE_GRATIS', 'PROMO']
export const DESTINOS = ['', 'clases', 'formacion', 'whatsapp', 'link']

const esFecha = (texto) => /^\d{4}-\d{2}-\d{2}$/.test(texto)
const esLinkValido = (texto) => texto.startsWith('/') || /^https?:\/\/\S+$/i.test(texto)
const esImagenCloudinary = (texto) => /^https:\/\/res\.cloudinary\.com\/.+\/image\/upload\//i.test(texto)
const limpiar = (valor) => (valor == null ? '' : String(valor).trim())

// Fecha de hoy en Argentina, como 'AAAA-MM-DD'
export const hoyEnArgentina = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' })

// Condición para traer solo los avisos que se ven hoy en el sitio
export const soloVigentes = () => ({
  activo: true,
  OR: [{ hasta: null }, { hasta: '' }, { hasta: { gte: hoyEnArgentina() } }],
})

// Arma los datos a guardar. Devuelve { datos } o { error }
export function datosDeAviso(cuerpo = {}) {
  const titulo = limpiar(cuerpo.titulo)
  if (!titulo) return { error: 'Poné un título para el aviso' }
  if (titulo.length > 120) return { error: 'El título es muy largo (máximo 120 letras)' }

  const tipo = TIPOS.includes(cuerpo.tipo) ? cuerpo.tipo : 'NOVEDAD'
  const destino = DESTINOS.includes(cuerpo.destino) ? cuerpo.destino : ''

  const enlace = limpiar(cuerpo.enlace)
  if (destino === 'link' && !esLinkValido(enlace)) return { error: 'El link tiene que empezar con https:// o con /' }

  const imagenUrl = limpiar(cuerpo.imagenUrl)
  if (imagenUrl && !esImagenCloudinary(imagenUrl)) return { error: 'La imagen no es válida' }

  const hasta = limpiar(cuerpo.hasta)
  if (hasta && !esFecha(hasta)) return { error: 'La fecha no es válida' }

  const datos = {
    tipo, titulo, destino,
    descripcion: limpiar(cuerpo.descripcion).slice(0, 600),
    enlace: destino === 'link' ? enlace : null,
    imagenUrl: imagenUrl || null,
    hasta: hasta || null,
  }
  if (cuerpo.activo !== undefined) datos.activo = Boolean(cuerpo.activo)
  return { datos }
}
