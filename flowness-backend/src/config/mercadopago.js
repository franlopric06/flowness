import { MercadoPagoConfig } from 'mercadopago'
import dotenv from 'dotenv'

dotenv.config()

const clienteMP = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
})

export default clienteMP
