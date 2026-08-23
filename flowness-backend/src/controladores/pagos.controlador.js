import { Preference } from 'mercadopago'
import clienteMP from '../config/mercadopago.js'
import prisma from '../config/prisma.js'

export const crearPreferencia = async (req, res) => {
  const { claseId } = req.body
  const usuarioId = req.usuario.id

  try {
    const clase = await prisma.clase.findUnique({ where: { id: Number(claseId) } })
    if (!clase) return res.status(404).json({ error: 'Clase no encontrada' })

    const preference = new Preference(clienteMP)
    const respuesta = await preference.create({
      body: {
        items: [{ title: clase.nombre, quantity: 1, unit_price: clase.precio }],
        back_urls: {
          success: `${process.env.FRONTEND_URL}/pago-exitoso`,
          failure: `${process.env.FRONTEND_URL}/pago-fallido`,
        },
        auto_return: 'approved',
        metadata: { usuarioId, claseId },
      },
    })

    // Crear compra pendiente
    await prisma.compra.create({
      data: { usuarioId, claseId: Number(claseId), monto: clase.precio, estado: 'PENDIENTE' },
    })

    res.json({ init_point: respuesta.init_point })
  } catch {
    res.status(500).json({ error: 'Error al crear preferencia de pago' })
  }
}

export const webhookPago = async (req, res) => {
  const { data, type } = req.body

  if (type === 'payment') {
    try {
      const { Payment } = await import('mercadopago')
      const pago = new Payment(clienteMP)
      const infoPago = await pago.get({ id: data.id })

      const { usuarioId, claseId } = infoPago.metadata
      const estadoMP = infoPago.status

      const estado = estadoMP === 'approved' ? 'APROBADO' : 'RECHAZADO'

      await prisma.compra.updateMany({
        where: { usuarioId: Number(usuarioId), claseId: Number(claseId), estado: 'PENDIENTE' },
        data: { estado, mpPagoId: String(data.id) },
      })
    } catch (err) {
      console.error('Error en webhook:', err)
    }
  }

  res.sendStatus(200)
}
