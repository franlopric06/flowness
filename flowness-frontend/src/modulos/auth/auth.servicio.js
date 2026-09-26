import { peticion } from '../../compartido/servicios/cliente'

const enviar = (ruta, datos) => peticion(ruta, { method: 'POST', body: JSON.stringify(datos) })

export const registrar = (datos) => enviar('/auth/registrar', datos)
export const iniciarSesion = (datos) => enviar('/auth/iniciar-sesion', datos)

// Recuperar la contraseña
export const estadoRecuperacion = () => peticion('/auth/recuperacion')
export const olvideClave = (email) => enviar('/auth/olvide-clave', { email })
export const restablecerClave = (codigo, password) => enviar('/auth/restablecer-clave', { codigo, password })

// Guarda la sesión en el navegador y avisa al encabezado
export function guardarSesion({ token, usuario }) {
  localStorage.setItem('token', token)
  localStorage.setItem('usuario', JSON.stringify(usuario))
  window.dispatchEvent(new Event('storage'))
}
