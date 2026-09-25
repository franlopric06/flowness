import { Preference, Payment } from 'mercadopago'
import clienteMP from '../../config/mercadopago.js'
import prisma from '../../config/prisma.js'
import entorno from '../../config/entorno.js'

// ─────────────────────────────────────────────
// Flujo de pago:
// 1. El usuario toca "Comprar": se crea una Compra PENDIENTE y una
//    preferencia de Mercado Pago con external_reference = id de la compra.
// 2. Paga en Mercado Pago.
// 3. Mercado Pago avisa al webhook. Consultamos el pago DIRECTAMENTE a
//    Mercado Pago (así nadie puede falsificar el aviso) y actualizamos la compra.
// ─────────────────────────────────────────────

export const crearPreferencia = async (req, res) => {
  const { claseId } = req.body
  const usuarioId = req.usuario.id

  try {
    const clase = await prisma.clase.findUnique({ where: { id: Number(claseId) } })
    if (!clase || !clase.activo) return res.status(404).json({ error: 'Clase no encontrada' })
    if (clase.esGratis) return res.status(400).json({ error: 'Esta clase es gratis, no hace falta comprarla' })
    if (!(clase.precio > 0)) return res.status(400).json({ error: 'Esta clase todavía no tiene precio' })

    const yaComprada = await prisma.compra.findFirst({
      where: { usuarioId, claseId: clase.id, estado: 'APROBADO' },
    })
    if (yaComprada) return res.status(400).json({ error: 'Ya tenés esta clase' })

    const compra = await prisma.compra.create({
      data: { usuarioId, claseId: clase.id, monto: clase.precio, estado: 'PENDIENTE' },
    })

    const preference = new Preference(clienteMP)
    const respuesta = await preference.create({
      body: {
        items: [{ id: `clase-${clase.id}`, title: clase.nombre, quantity: 1, unit_price: clase.precio, currency_id: 'ARS' }],
        external_reference: String(compra.id),
        back_urls: {
          success: `${entorno.frontendUrl}/pago-exitoso`,
          failure: `${entorno.frontendUrl}/pago-fallido`,
          pending: `${entorno.frontendUrl}/pago-exitoso`,
        },
        auto_return: 'approved',
        ...(entorno.backendUrl.startsWith('https://') ? { notification_url: `${entorno.backendUrl}/api/pagos/webhook` } : {}),
      },
    })

    res.json({ init_point: respuesta.init_point })
  } catch (err) {
    console.error('Error al crear preferencia:', err?.message || err)
    res.status(500).json({ error: 'Error al crear preferencia de pago' })
  }
}

const ESTADOS = {
  approved: 'APROBADO',
  rejected: 'RECHAZADO',
  cancelled: 'RECHAZADO',
  refunded: 'RECHAZADO',
  charged_back: 'RECHAZADO',
  // pending, in_process, authorized: sigue PENDIENTE
}

export const webhookPago = async (req, res) => {
  // Mercado Pago manda el aviso en el cuerpo o en la URL, según el tipo de notificación
  const tipo = req.body?.type || req.query.type || req.query.topic
  const pagoId = req.body?.data?.id || req.query['data.id'] || req.query.id

  // Respondemos enseguida para que Mercado Pago no reintente
  res.sendStatus(200)

  if (tipo !== 'payment' || !pagoId) return

  try {
    const infoPago = await new Payment(clienteMP).get({ id: pagoId })
    const compraId = Number(infoPago.external_reference)
    const estado = ESTADOS[infoPago.status]
    if (!compraId || !estado) return

    const compra = await prisma.compra.findUnique({ where: { id: compraId } })
    if (!compra) return

    // Control extra: el monto pagado tiene que coincidir con el de la compra
    if (estado === 'APROBADO' && Number(infoPago.transaction_amount) < compra.monto) {
      console.error(`Webhook: monto pagado menor al esperado en compra ${compraId}`)
      return
    }

    await prisma.compra.update({
      where: { id: compraId },
      data: { estado, mpPagoId: String(pagoId) },
    })
  } catch (err) {
    console.error('Error en webhook:', err?.message || err)
  }
}
