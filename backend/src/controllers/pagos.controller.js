const { MercadoPagoConfig, Preference } = require('mercadopago')
const prisma = require('../prisma')

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
})

const crearPreferencia = async (req, res) => {
  try {
    const { cursoId } = req.body
    const usuarioId = req.usuario.id

    const curso = await prisma.curso.findUnique({
      where: { id: parseInt(cursoId) }
    })

    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' })
    }

    const preference = new Preference(client)

    const resultado = await preference.create({
      body: {
        items: [
          {
            id: curso.id.toString(),
            title: curso.nombre,
            description: curso.descripcion,
            quantity: 1,
            currency_id: 'ARS',
            unit_price: curso.precio
          }
        ],
        back_urls: {
          success: `https://flowness.vercel.app/pago-exitoso?tipo=curso&cursoId=${cursoId}&usuarioId=${usuarioId}`,
          failure: `https://flowness.vercel.app/cursos`,
          pending: `https://flowness.vercel.app/cursos`
        },
        auto_return: 'approved',
        external_reference: `curso-${usuarioId}-${cursoId}`,
        notification_url: `https://flowness-production.up.railway.app/api/pagos/webhook`
      }
    })

    res.json({ init_point: resultado.init_point })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear preferencia de pago' })
  }
}

const crearPreferenciaClase = async (req, res) => {
  try {
    const { claseId, tipo } = req.body
    const usuarioId = req.usuario.id

    const clase = await prisma.clase.findUnique({
      where: { id: parseInt(claseId) }
    })

    if (!clase) {
      return res.status(404).json({ error: 'Clase no encontrada' })
    }

    const precio = tipo === 'vivo' ? clase.precio_vivo : clase.precio_grabada
    const titulo = tipo === 'vivo'
      ? `Clase en vivo - ${clase.nombre}`
      : `Clase grabada - ${clase.nombre}`

    const preference = new Preference(client)

    const resultado = await preference.create({
      body: {
        items: [
          {
            id: clase.id.toString(),
            title: titulo,
            description: clase.descripcion,
            quantity: 1,
            currency_id: 'ARS',
            unit_price: precio
          }
        ],
        back_urls: {
          success: `https://flowness.vercel.app/pago-exitoso?tipo=clase&claseId=${claseId}&usuarioId=${usuarioId}&modalidad=${tipo}`,
          failure: `https://flowness.vercel.app/clases`,
          pending: `https://flowness.vercel.app/clases`
        },
        auto_return: 'approved',
        external_reference: `clase-${tipo}-${usuarioId}-${claseId}`,
        notification_url: `https://flowness-production.up.railway.app/api/pagos/webhook`
      }
    })

    res.json({ init_point: resultado.init_point })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear preferencia de clase' })
  }
}

const webhook = async (req, res) => {
  try {
    const { type, data } = req.body

    if (type === 'payment') {
      const { MercadoPagoConfig, Payment } = require('mercadopago')
      const client = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN
      })
      const payment = new Payment(client)
      const pagoInfo = await payment.get({ id: data.id })

      if (pagoInfo.status === 'approved') {
        const referencia = pagoInfo.external_reference

        if (referencia.startsWith('curso-')) {
          const [, usuarioId, cursoId] = referencia.split('-')
          await prisma.compra.create({
            data: {
              usuarioId: parseInt(usuarioId),
              cursoId: parseInt(cursoId),
              monto: pagoInfo.transaction_amount,
              estado: 'aprobado'
            }
          })
        } else if (referencia.startsWith('clase-')) {
          const [, tipo, usuarioId, claseId] = referencia.split('-')
          await prisma.reserva.create({
            data: {
              usuarioId: parseInt(usuarioId),
              claseId: parseInt(claseId),
              tipo,
              monto: pagoInfo.transaction_amount,
              estado: 'aprobado'
            }
          })
        }
      }
    }

    res.sendStatus(200)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

module.exports = { crearPreferencia, crearPreferenciaClase, webhook }