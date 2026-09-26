import { Payment } from 'mercadopago'
import clienteMP from '../../config/mercadopago.js'
import prisma from '../../config/prisma.js'
import { ESTADOS, avisoWebhook } from './pagos.comun.js'

// POST /api/pagos/procesar  body: { compraId, formData }
// formData es lo que devuelve el formulario de Mercado Pago (token de la tarjeta,
// cuotas, medio de pago, datos del pagador). El monto SIEMPRE sale de la base.
export const procesarPago = async (req, res) => {
  const { compraId, formData = {} } = req.body
  try {
    const compra = await prisma.compra.findUnique({
      where: { id: Number(compraId) },
      include: { clase: true, curso: true, usuario: { select: { email: true } } },
    })
    if (!compra || compra.usuarioId !== req.usuario.id) return res.status(404).json({ error: 'Compra no encontrada' })
    if (compra.estado === 'APROBADO') return res.status(400).json({ error: 'Esta compra ya está pagada' })
    if (!formData.payment_method_id) return res.status(400).json({ error: 'Faltan los datos del pago' })

    const descripcion = compra.curso ? `Formación Flowness · ${compra.curso.nombre}` : `Clase Flowness · ${compra.clase?.nombre || ''}`
    const payer = formData.payer || {}

    const pago = await new Payment(clienteMP).create({
      body: {
        transaction_amount: compra.monto,
        description: descripcion,
        payment_method_id: formData.payment_method_id,
        external_reference: String(compra.id),
        ...(formData.token ? { token: formData.token } : {}),
        ...(formData.installments ? { installments: Number(formData.installments) } : {}),
        ...(formData.issuer_id ? { issuer_id: Number(formData.issuer_id) } : {}),
        ...(formData.transaction_details?.financial_institution
          ? { transaction_details: { financial_institution: formData.transaction_details.financial_institution } }
          : {}),
        payer: {
          email: payer.email || compra.usuario.email,
          ...(payer.identification?.number ? { identification: payer.identification } : {}),
          ...(payer.first_name ? { first_name: payer.first_name } : {}),
          ...(payer.last_name ? { last_name: payer.last_name } : {}),
        },
        ...avisoWebhook(),
      },
    })

    const estado = ESTADOS[pago.status]
    if (estado) {
      await prisma.compra.update({ where: { id: compra.id }, data: { estado, mpPagoId: String(pago.id) } })
    } else {
      await prisma.compra.update({ where: { id: compra.id }, data: { mpPagoId: String(pago.id) } })
    }

    res.json({
      pagoId: pago.id,
      status: pago.status,               // approved | in_process | pending | rejected
      detalle: pago.status_detail,
      // Pago en efectivo: link a la boleta para pagar en Rapipago / Pago Fácil
      boleta: pago.transaction_details?.external_resource_url || null,
    })
  } catch (err) {
    console.error('Error al procesar el pago:', err?.message || err, err?.cause || '')
    const mensaje = err?.message && /invalid|not found|required/i.test(err.message)
      ? 'Mercado Pago no aceptó los datos. Revisalos y probá de nuevo.'
      : 'No se pudo procesar el pago. Probá de nuevo en unos minutos.'
    res.status(400).json({ error: mensaje })
  }
}
