import { Preference, Payment } from 'mercadopago'
import clienteMP from '../../config/mercadopago.js'
import prisma from '../../config/prisma.js'
import entorno from '../../config/entorno.js'

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

// Busca lo que se quiere comprar (una clase o un curso) y valida que se pueda
const obtenerProducto = async ({ claseId, cursoId }, usuarioId) => {
  if (cursoId) {
    const curso = await prisma.curso.findUnique({ where: { id: Number(cursoId) } })
    if (!curso || !curso.activo) return { error: 'Curso no encontrado', status: 404 }
    if (!(curso.precio > 0)) return { error: 'Este curso todavía no está a la venta' }
    const yaComprado = await prisma.compra.findFirst({ where: { usuarioId, cursoId: curso.id, estado: 'APROBADO' } })
    if (yaComprado) return { error: 'Ya tenés este curso' }
    return { titulo: curso.nombre, precio: curso.precio, idItem: `curso-${curso.id}`, datosCompra: { cursoId: curso.id }, volver: `/formacion/${curso.slug}` }
  }

  const clase = await prisma.clase.findUnique({ where: { id: Number(claseId) } })
  if (!clase || !clase.activo) return { error: 'Clase no encontrada', status: 404 }
  if (clase.esGratis) return { error: 'Esta clase es gratis, no hace falta comprarla' }
  if (!(clase.precio > 0)) return { error: 'Esta clase todavía no tiene precio' }
  const yaComprada = await prisma.compra.findFirst({ where: { usuarioId, claseId: clase.id, estado: 'APROBADO' } })
  if (yaComprada) return { error: 'Ya tenés esta clase' }
  return { titulo: clase.nombre, precio: clase.precio, idItem: `clase-${clase.id}`, datosCompra: { claseId: clase.id }, volver: '/clases' }
}

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
        ...(entorno.backendUrl.startsWith('https://') ? { notification_url: `${entorno.backendUrl}/api/pagos/webhook` } : {}),
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
        ...(entorno.backendUrl.startsWith('https://') ? { notification_url: `${entorno.backendUrl}/api/pagos/webhook` } : {}),
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
