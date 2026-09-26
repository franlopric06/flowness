import { Preference } from 'mercadopago'
import clienteMP from '../../config/mercadopago.js'
import prisma from '../../config/prisma.js'
import entorno from '../../config/entorno.js'
import { obtenerProducto } from './pagos.producto.js'
import { avisoWebhook } from './pagos.comun.js'

// POST /api/pagos/crear-preferencia  body: { claseId } o { cursoId }
export const crearPreferencia = async (req, res) => {
  const usuarioId = req.usuario.id

  try {
    const producto = await obtenerProducto(req.body, usuarioId)
    if (producto.error) return res.status(producto.status || 400).json({ error: producto.error })

    // Si ya había empezado a comprar lo mismo (y no pagó), se reutiliza esa compra
    const pendiente = await prisma.compra.findFirst({
      where: { usuarioId, ...producto.datosCompra, estado: 'PENDIENTE', monto: producto.precio },
      orderBy: { creadoEn: 'desc' },
    })
    const compra = pendiente || await prisma.compra.create({
      data: { usuarioId, ...producto.datosCompra, monto: producto.precio, estado: 'PENDIENTE' },
    })

    // Después de pagar vuelve a la página de lo que compró
    const volver = producto.volver

    const preference = new Preference(clienteMP)
    const respuesta = await preference.create({
      body: {
        items: [{ id: producto.idItem, title: producto.titulo, quantity: 1, unit_price: producto.precio, currency_id: 'ARS' }],
        external_reference: String(compra.id),
        back_urls: {
          success: `${entorno.frontendUrl}/pago-exitoso?volver=${encodeURIComponent(volver)}`,
          failure: `${entorno.frontendUrl}/pago-fallido`,
          pending: `${entorno.frontendUrl}/pago-exitoso?volver=${encodeURIComponent(volver)}`,
        },
        auto_return: 'approved',
        ...avisoWebhook(),
      },
    })

    res.json({
      init_point: respuesta.init_point,
      preferenceId: respuesta.id,
      compraId: compra.id,
      titulo: producto.titulo,
      precio: producto.precio,
      volver,
    })
  } catch (err) {
    console.error('Error al crear preferencia:', err?.message || err)
    res.status(500).json({ error: 'Error al crear preferencia de pago' })
  }
}
