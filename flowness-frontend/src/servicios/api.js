const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const obtenerToken = () => localStorage.getItem('token')

const peticion = async (ruta, opciones = {}) => {
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

export const registrar = (datos) => peticion('/auth/registrar', { method: 'POST', body: JSON.stringify(datos) })
export const iniciarSesion = (datos) => peticion('/auth/iniciar-sesion', { method: 'POST', body: JSON.stringify(datos) })
export const obtenerDatosPublicos = () => peticion('/publico')
export const obtenerFases = () => peticion('/fases')
export const obtenerClases = () => peticion('/clases')
export const obtenerClase = (id) => peticion(`/clases/${id}`)
export const crearPreferencia = (claseId) => peticion('/pagos/crear-preferencia', { method: 'POST', body: JSON.stringify({ claseId }) })
export const obtenerConfiguracion = () => peticion('/configuracion')
export const actualizarConfiguracion = (datos) => peticion('/configuracion', { method: 'PUT', body: JSON.stringify(datos) })
export const obtenerUsuarios = () => peticion('/admin/usuarios')
export const obtenerCompras = () => peticion('/admin/compras')
export const obtenerAvisos = () => peticion('/admin/avisos')
export const crearAviso = (datos) => peticion('/admin/avisos', { method: 'POST', body: JSON.stringify(datos) })
export const eliminarAviso = (id) => peticion(`/admin/avisos/${id}`, { method: 'DELETE' })
export const obtenerSobreMi = () => peticion('/admin/sobre-mi')
export const actualizarSobreMi = (datos) => peticion('/admin/sobre-mi', { method: 'PUT', body: JSON.stringify(datos) })
export const crearFase = (datos) => peticion('/fases', { method: 'POST', body: JSON.stringify(datos) })
export const actualizarFase = (id, datos) => peticion(`/fases/${id}`, { method: 'PUT', body: JSON.stringify(datos) })
export const eliminarFase = (id) => peticion(`/fases/${id}`, { method: 'DELETE' })
export const crearClase = (datos) => peticion('/clases', { method: 'POST', body: JSON.stringify(datos) })
export const actualizarClase = (id, datos) => peticion(`/clases/${id}`, { method: 'PUT', body: JSON.stringify(datos) })
export const eliminarClase = (id) => peticion(`/clases/${id}`, { method: 'DELETE' })

export const subirImagen = (archivo) => {
  const form = new FormData()
  form.append('archivo', archivo)
  const token = obtenerToken()
  return fetch(`${BASE}/media/imagen`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form }).then(r => r.json())
}
export const subirVideo = (archivo) => {
  const form = new FormData()
  form.append('archivo', archivo)
  const token = obtenerToken()
  return fetch(`${BASE}/media/video`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form }).then(r => r.json())
}
export const subirDocumento = (archivo) => {
  const form = new FormData()
  form.append('archivo', archivo)
  const token = obtenerToken()
  return fetch(`${BASE}/media/documento`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form }).then(r => r.json())
}
