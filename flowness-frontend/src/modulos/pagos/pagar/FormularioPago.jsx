import { useState } from 'react'
import { motion } from 'framer-motion'
import { initMercadoPago, Payment } from '@mercadopago/sdk-react'
import { Lock, Loader2 } from 'lucide-react'
import { fadeUp } from '../../../compartido/utilidades/animaciones'
import { ESTILO_FORMULARIO } from './estiloFormulario'

// Clave pública de Mercado Pago (se carga en Vercel como VITE_MP_PUBLIC_KEY).
// Es pública: sirve solo para mostrar el formulario, no para cobrar.
const CLAVE_PUBLICA = import.meta.env.VITE_MP_PUBLIC_KEY
if (CLAVE_PUBLICA) initMercadoPago(CLAVE_PUBLICA, { locale: 'es-AR' })

// Formulario de Mercado Pago dentro de la página. Si todavía no hay clave
// pública cargada, muestra un botón que lleva al sitio de Mercado Pago.
function FormularioPago({ compra, alEnviar }) {
  const [listo, setListo] = useState(false)

  return (
    <motion.section {...fadeUp} className="card p-4 md:p-6 order-2 md:order-1">
      <p className="text-sm font-semibold text-texto mb-4">Elegí cómo pagar</p>
      {CLAVE_PUBLICA ? (
        <>
          {!listo && (
            <div className="flex items-center justify-center gap-2 text-piedra text-sm py-16">
              <Loader2 size={18} className="animate-spin" /> Cargando formulario seguro…
            </div>
          )}
          <Payment
            initialization={{ amount: compra.precio, preferenceId: compra.preferenceId }}
            customization={{
              paymentMethods: { creditCard: 'all', debitCard: 'all', ticket: 'all', mercadoPago: 'all' },
              visual: { style: ESTILO_FORMULARIO },
            }}
            locale="es-AR"
            onSubmit={alEnviar}
            onReady={() => setListo(true)}
            onError={(e) => console.error('Formulario de pago:', e)}
          />
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-texto/80 text-sm mb-6">Vas a completar el pago en el sitio seguro de Mercado Pago.</p>
          <a href={compra.init_point} className="btn btn-primario btn-brillo"><Lock size={16} /> Pagar con Mercado Pago</a>
        </div>
      )}
    </motion.section>
  )
}

export default FormularioPago
