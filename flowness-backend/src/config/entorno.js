import dotenv from 'dotenv'

dotenv.config()

// Variables sin las cuales el servidor no puede funcionar de forma segura.
const obligatorias = [
  'DATABASE_URL',
  'JWT_SECRET',
  'FRONTEND_URL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'MP_ACCESS_TOKEN',
]

const faltantes = obligatorias.filter((clave) => !process.env[clave])

if (faltantes.length > 0) {
  console.error(`Faltan variables de entorno: ${faltantes.join(', ')}`)
  console.error('Copiá .env.example como .env y completá los valores.')
  process.exit(1)
}

const entorno = {
  puerto: process.env.PORT || 3000,
  // Admite varias URLs separadas por coma (ej: producción y previews de Vercel)
  origenesPermitidos: process.env.FRONTEND_URL.split(',').map((url) => url.trim()),
  frontendUrl: process.env.FRONTEND_URL.split(',')[0].trim(),
  jwtSecret: process.env.JWT_SECRET,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  mpAccessToken: process.env.MP_ACCESS_TOKEN,
  // URL pública del backend: Mercado Pago avisa los pagos a BACKEND_URL/api/pagos/webhook
  backendUrl: (process.env.BACKEND_URL || '').replace(/\/$/, ''),
}

export default entorno
