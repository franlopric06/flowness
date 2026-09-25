import { peticion, subirArchivo } from '../../compartido/servicios/cliente'

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
export const subirImagen = (archivo) => subirArchivo('/media/imagen', archivo)
export const subirVideo = (archivo) => subirArchivo('/media/video', archivo)
export const subirDocumento = (archivo) => subirArchivo('/media/documento', archivo)

// Formación (cursos y lecciones)
export { obtenerCursosAdmin, actualizarCurso, crearLeccion, actualizarLeccion } from '../formacion/formacion.servicio'

// Galería (fotos y reels)
export {
  obtenerGaleriaAdmin, crearFoto, actualizarFoto, eliminarFoto,
  crearReel, actualizarReel, eliminarReel,
} from '../galeria/galeria.servicio'
