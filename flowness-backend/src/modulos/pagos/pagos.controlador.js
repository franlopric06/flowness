// ─────────────────────────────────────────────
// Flujo de pago:
// 1. El usuario toca "Comprar": se crea (o se reutiliza) una Compra PENDIENTE
//    y una preferencia de Mercado Pago con external_reference = id de la compra.
// 2. Paga DENTRO de la página de Flowness (formulario de Mercado Pago,
//    "Checkout Bricks"): los datos de la tarjeta los recibe Mercado Pago,
//    acá solo llega un "token" de un solo uso. Con eso se crea el pago en
//    /procesar. Si elige pagar con su cuenta de Mercado Pago, va a su sitio.
// 3. Mercado Pago avisa al webhook. Consultamos el pago DIRECTAMENTE a
//    Mercado Pago (así nadie puede falsificar el aviso) y actualizamos la compra.
// ─────────────────────────────────────────────
//
// Cada paso vive en su propio archivo:
//   pagos.producto.js    → qué se compra y si se puede
//   pagos.preferencia.js → paso 1
//   pagos.procesar.js    → paso 2
//   pagos.webhook.js     → paso 3
// ─────────────────────────────────────────────

export { crearPreferencia } from './pagos.preferencia.js'
export { procesarPago } from './pagos.procesar.js'
export { webhookPago } from './pagos.webhook.js'
