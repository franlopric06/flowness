import { peticion } from '../../compartido/servicios/cliente'

// Inicia el pago en Mercado Pago de una clase o de un curso de la formación
export const crearPreferencia = (claseId) =>
  peticion('/pagos/crear-preferencia', { method: 'POST', body: JSON.stringify({ claseId }) })

export const comprarCurso = (cursoId) =>
  peticion('/pagos/crear-preferencia', { method: 'POST', body: JSON.stringify({ cursoId }) })

// Prepara la compra para pagar dentro de la página (devuelve compraId, preferenceId, título y precio)
export const prepararPago = ({ claseId, cursoId }) =>
  peticion('/pagos/crear-preferencia', { method: 'POST', body: JSON.stringify(claseId ? { claseId } : { cursoId }) })

// Envía los datos que devolvió el formulario de Mercado Pago para crear el pago
export const procesarPago = (compraId, formData) =>
  peticion('/pagos/procesar', { method: 'POST', body: JSON.stringify({ compraId, formData }) })
