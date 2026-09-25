import { peticion } from './cliente'

// Sube un archivo directo desde el navegador a Cloudinary.
// 1. Le pide al servidor una firma (permiso) para ese tipo de archivo.
// 2. Manda el archivo a Cloudinary mostrando el progreso.
// Devuelve { url } si salió bien o { error } con el motivo si falló.
// tipo: 'image' (fotos), 'video' (videos) o 'raw' (PDFs)
export const subirACloudinary = async (archivo, tipo, alProgresar) => {
  let firma
  try {
    firma = await peticion('/media/firma', { method: 'POST', body: JSON.stringify({ tipo }) })
  } catch (err) {
    return { error: err.message || 'No se pudo pedir permiso para subir el archivo' }
  }

  const form = new FormData()
  form.append('file', archivo)
  form.append('api_key', firma.apiKey)
  form.append('timestamp', firma.timestamp)
  form.append('signature', firma.signature)
  form.append('folder', firma.folder)

  return new Promise((resolver) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${firma.cloudName}/${firma.tipo}/upload`)

    xhr.upload.onprogress = (e) => {
      if (alProgresar && e.lengthComputable) alProgresar(Math.round((e.loaded / e.total) * 100))
    }

    xhr.onload = () => {
      let datos = null
      try { datos = JSON.parse(xhr.responseText) } catch { /* respuesta que no es JSON */ }
      if (xhr.status >= 200 && xhr.status < 300 && datos?.secure_url) {
        resolver({ url: datos.secure_url })
      } else {
        resolver({ error: datos?.error?.message || `Cloudinary rechazó el archivo (código ${xhr.status})` })
      }
    }

    xhr.onerror = () => resolver({ error: 'Se cortó la conexión mientras se subía el archivo' })
    xhr.send(form)
  })
}
