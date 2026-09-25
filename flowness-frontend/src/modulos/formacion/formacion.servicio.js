import { peticion } from '../../compartido/servicios/cliente'

// Público: los niveles y el detalle de cada uno (con sesión, indica si lo compró)
export const obtenerCursos = () => peticion('/cursos')
export const obtenerCurso = (slug) => peticion(`/cursos/${slug}`)

// Panel de administración
export const obtenerCursosAdmin = () => peticion('/cursos/admin/todos')
export const actualizarCurso = (id, datos) => peticion(`/cursos/${id}`, { method: 'PUT', body: JSON.stringify(datos) })
export const crearLeccion = (cursoId, datos) => peticion(`/cursos/${cursoId}/lecciones`, { method: 'POST', body: JSON.stringify(datos) })
export const actualizarLeccion = (leccionId, datos) => peticion(`/cursos/lecciones/${leccionId}`, { method: 'PUT', body: JSON.stringify(datos) })
