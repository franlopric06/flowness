import { peticion } from '../../compartido/servicios/cliente'

// Inicia el pago en Mercado Pago de una clase o de un curso de la formación
export const crearPreferencia = (claseId) =>
  peticion('/pagos/crear-preferencia', { method: 'POST', body: JSON.stringify({ claseId }) })

export const comprarCurso = (cursoId) =>
  peticion('/pagos/crear-preferencia', { method: 'POST', body: JSON.stringify({ cursoId }) })
