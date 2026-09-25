import { MercadoPagoConfig } from 'mercadopago'
import entorno from './entorno.js'

const clienteMP = new MercadoPagoConfig({
  accessToken: entorno.mpAccessToken,
})

export default clienteMP
