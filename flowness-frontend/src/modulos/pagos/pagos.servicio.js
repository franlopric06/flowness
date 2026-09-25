import { peticion } from '../../compartido/servicios/cliente'

export const crearPreferencia = (claseId) =>
  peticion('/pagos/crear-preferencia', { method: 'POST', body: JSON.stringify({ claseId }) })
