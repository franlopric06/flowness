// Cliente HTTP común a todos los módulos: arma la URL, agrega el token y maneja errores.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const obtenerToken = () => localStorage.getItem('token')

export const peticion = async (ruta, opciones = {}) => {
  const token = obtenerToken()
  const cabeceras = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opciones.headers,
  }
  const res = await fetch(`${BASE}${ruta}`, { ...opciones, headers: cabeceras })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Error desconocido' }))
    throw new Error(error.error || 'Error en la petición')
  }
  return res.json()
}

// Subida de archivos (multipart): no lleva Content-Type, el navegador lo arma solo.
export const subirArchivo = async (ruta, archivo) => {
  const form = new FormData()
  form.append('archivo', archivo)
  const token = obtenerToken()
  const res = await fetch(`${BASE}${ruta}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })
  return res.json()
}
