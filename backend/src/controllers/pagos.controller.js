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
          success: `https://flowness.vercel.app/pago-exitoso?cursoId=${cursoId}&usuarioId=${usuarioId}`,
          failure: `https://flowness.vercel.app/cursos`,
          pending: `https://flowness.vercel.app/cursos`
        },
        auto_return: 'approved',
        external_reference: `${usuarioId}-${cursoId}`,
        notification_url: `${process.env.BACKEND_URL}/api/pagos/webhook`
      }
    })

    res.json({ init_point: resultado.init_point })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear preferencia de pago' })
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
        const [usuarioId, cursoId] = pagoInfo.external_reference.split('-')

        await prisma.compra.create({
          data: {
            usuarioId: parseInt(usuarioId),
            cursoId: parseInt(cursoId),
            monto: pagoInfo.transaction_amount,
            estado: 'aprobado'
          }
        })
      }
    }

    res.sendStatus(200)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

module.exports = { crearPreferencia, webhook }