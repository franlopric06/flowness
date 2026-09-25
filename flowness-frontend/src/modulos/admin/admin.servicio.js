import { peticion } from '../../compartido/servicios/cliente'
import { subirACloudinary } from '../../compartido/servicios/cloudinary'

// El panel admin reutiliza servicios de otros módulos
export { obtenerConfiguracion, actualizarConfiguracion } from '../../compartido/servicios/configuracion.servicio'
export {
  obtenerFases, crearFase, actualizarFase, eliminarFase,
  obtenerClases, obtenerClasesAdmin, crearClase, actualizarClase, eliminarClase,
} from '../clases/clases.servicio'

// Usuarios y compras
export const obtenerUsuarios = () => peticion('/admin/usuarios')
export const obtenerCompras = () => peticion('/admin/compras')

// Avisos
export const obtenerAvisos = () => peticion('/admin/avisos')
export const crearAviso = (datos) => peticion('/admin/avisos', { method: 'POST', body: JSON.stringify(datos) })
export const eliminarAviso = (id) => peticion(`/admin/avisos/${id}`, { method: 'DELETE' })

// Sobre mí
export const obtenerSobreMi = () => peticion('/admin/sobre-mi')
export const actualizarSobreMi = (datos) => peticion('/admin/sobre-mi', { method: 'PUT', body: JSON.stringify(datos) })

// Archivos multimedia
// Archivos multimedia: se suben directo a Cloudinary. Devuelven { url } o { error }.
// alProgresar (opcional) recibe el porcentaje subido, de 0 a 100.
export const subirImagen = (archivo, alProgresar) => subirACloudinary(archivo, 'image', alProgresar)
export const subirVideo = (archivo, alProgresar) => subirACloudinary(archivo, 'video', alProgresar)
export const subirDocumento = (archivo, alProgresar) => subirACloudinary(archivo, 'raw', alProgresar)

// Formación (cursos y lecciones)
export { obtenerCursosAdmin, actualizarCurso, crearLeccion, actualizarLeccion } from '../formacion/formacion.servicio'

// Galería (fotos y reels)
export {
  obtenerGaleriaAdmin, crearFoto, actualizarFoto, eliminarFoto,
  crearReel, actualizarReel, eliminarReel,
} from '../galeria/galeria.servicio'
