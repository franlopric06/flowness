import { Payment } from 'mercadopago'
import clienteMP from '../../config/mercadopago.js'
import prisma from '../../config/prisma.js'
import { ESTADOS } from './pagos.comun.js'

// POST /api/pagos/webhook — aviso de Mercado Pago
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
