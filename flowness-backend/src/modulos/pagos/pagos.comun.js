import entorno from '../../config/entorno.js'

// Lo que comparten la preferencia, el pago y el webhook

// Estado de Mercado Pago → estado de la compra en Flowness
export const ESTADOS = {
  approved: 'APROBADO',
  rejected: 'RECHAZADO',
  cancelled: 'RECHAZADO',
  refunded: 'RECHAZADO',
  charged_back: 'RECHAZADO',
  // pending, in_process, authorized: sigue PENDIENTE
}

// Dirección donde Mercado Pago avisa los pagos (solo si el servidor es https)
export const avisoWebhook = () =>
  entorno.backendUrl.startsWith('https://') ? { notification_url: `${entorno.backendUrl}/api/pagos/webhook` } : {}
