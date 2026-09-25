import cloudinary from '../../config/cloudinary.js'
import prisma from '../../config/prisma.js'
import entorno from '../../config/entorno.js'

// Sube el archivo a Cloudinary mandándolo "en streaming" desde la memoria.
// Así no se convierte a texto (base64), que para videos pesa un 33% más
// y puede hacer fallar la subida.
const subirACloudinary = (archivo, opciones) =>
  new Promise((resolver, rechazar) => {
    const flujo = cloudinary.uploader.upload_stream(opciones, (error, resultado) =>
      error ? rechazar(error) : resolver(resultado)
    )
    flujo.end(archivo.buffer)
  })

// Maneja la subida y, si falla, deja el motivo real en los logs de Railway
const manejarSubida = (opciones, textoError) => async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No llegó ningún archivo' })
  try {
    const resultado = await subirACloudinary(req.file, opciones)
    res.json({ url: resultado.secure_url })
  } catch (err) {
    const motivo = err?.message || err?.error?.message || String(err)
    console.error(`${textoError} (${req.file.mimetype}, ${(req.file.size / 1024 / 1024).toFixed(1)} MB):`, motivo)
    res.status(500).json({ error: `${textoError}: ${motivo}` })
  }
}

export const subirImagen = manejarSubida({ folder: 'flowness/imagenes' }, 'Error al subir imagen')

export const subirVideo = manejarSubida(
  { folder: 'flowness/videos', resource_type: 'video', chunk_size: 20 * 1024 * 1024 },
  'Error al subir video'
)

export const subirDocumento = manejarSubida(
  { folder: 'flowness/documentos', resource_type: 'raw' },
  'Error al subir documento'
)

// ─────────────────────────────────────────────
// Subida directa desde el navegador a Cloudinary
// El panel pide una "firma" (permiso de un solo uso, válido 1 hora) y sube el
// archivo directo a Cloudinary, sin pasar por Railway. La clave secreta nunca
// sale del servidor.
// ─────────────────────────────────────────────
const CARPETAS = {
  image: 'flowness/imagenes',
  video: 'flowness/videos',
  raw: 'flowness/documentos',
}

// POST /api/media/firma  body: { tipo: 'image' | 'video' | 'raw' }
export const firmarSubida = (req, res) => {
  const tipo = req.body?.tipo
  const folder = CARPETAS[tipo]
  if (!folder) return res.status(400).json({ error: 'Tipo de archivo no válido' })

  const timestamp = Math.round(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, entorno.cloudinary.apiSecret)

  res.json({
    cloudName: entorno.cloudinary.cloudName,
    apiKey: entorno.cloudinary.apiKey,
    tipo,
    folder,
    timestamp,
    signature,
  })
}

export const obtenerGaleria = async (req, res) => {
  try {
    const fotos = await prisma.foto.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
    })
    res.json(fotos)
  } catch {
    res.status(500).json({ error: 'Error al obtener galería' })
  }
}
