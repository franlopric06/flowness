import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { initMercadoPago, Payment } from '@mercadopago/sdk-react'
import {
  ArrowLeft, Lock, ShieldCheck, CheckCircle2, Hourglass, XCircle, Loader2, FileText, PlayCircle, GraduationCap, ExternalLink,
} from 'lucide-react'
import SellosConfianza from '../../compartido/componentes/SellosConfianza'
import { fadeUp } from '../../compartido/utilidades/animaciones'
import { avisar } from '../../compartido/utilidades/avisos'
import { formatearPrecio } from '../../compartido/utilidades/video'
import { prepararPago, procesarPago } from './pagos.servicio'

// Clave pública de Mercado Pago (se carga en Vercel como VITE_MP_PUBLIC_KEY).
// Es pública: sirve solo para mostrar el formulario, no para cobrar.
const CLAVE_PUBLICA = import.meta.env.VITE_MP_PUBLIC_KEY
if (CLAVE_PUBLICA) initMercadoPago(CLAVE_PUBLICA, { locale: 'es-AR' })

// Colores del manual aplicados al formulario de Mercado Pago
const ESTILO_FORMULARIO = {
  theme: 'default',
  customVariables: {
    baseColor: '#7B9B77',
    baseColorFirstVariant: '#5F7C5B',
    baseColorSecondVariant: '#D8A48F',
    textPrimaryColor: '#4A4A45',
    textSecondaryColor: '#A9A9A2',
    outlinePrimaryColor: '#D8A48F',
    formBackgroundColor: '#FEFEFE',
    inputBackgroundColor: '#FEFEFE',
    borderRadiusSmall: '6px',
    borderRadiusMedium: '10px',
    borderRadiusLarge: '14px',
    borderRadiusFull: '9999px',
  },
}

// Página de pago: resumen de la compra + formulario de Mercado Pago dentro de la página.
// /pagar?clase=ID  o  /pagar?curso=ID
function Pagar() {
  const [parametros] = useSearchParams()
  const claseId = parametros.get('clase')
  const cursoId = parametros.get('curso')
  const navigate = useNavigate()
  const hayUsuario = !!localStorage.getItem('token')
  const [compra, setCompra] = useState(null)   // { compraId, preferenceId, titulo, precio, volver, init_point }
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState(null) // respuesta de /procesar
  const [formularioListo, setFormularioListo] = useState(false)

  useEffect(() => {
    if (!hayUsuario || (!claseId && !cursoId)) return
    prepararPago({ claseId, cursoId })
      .then(setCompra)
      .catch((err) => setError(err.message || 'No se pudo preparar el pago'))
  }, [hayUsuario, claseId, cursoId])

  if (!claseId && !cursoId) return <Navigate to="/" replace />
  if (!hayUsuario) {
    const volver = `/pagar?${claseId ? `clase=${claseId}` : `curso=${cursoId}`}`
    return <Navigate to={`/ingresar?modo=registro&volver=${encodeURIComponent(volver)}`} replace />
  }

  // Lo llama el formulario de Mercado Pago al tocar "Pagar"
  const alEnviar = async ({ selectedPaymentMethod, formData }) => {
    // Pagar con la cuenta de Mercado Pago: el formulario lleva solo a su sitio
    if (selectedPaymentMethod === 'wallet_purchase') return
    // Si falla, el cliente de la API muestra el aviso y el formulario queda para reintentar
    const respuesta = await procesarPago(compra.compraId, formData)
    setResultado(respuesta)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (respuesta.status === 'approved') avisar('¡Pago aprobado! Ya tenés acceso.')
  }

  const esCurso = !!cursoId
  const IconoProducto = esCurso ? GraduationCap : PlayCircle

  return (
    <main className="min-h-screen pt-24 md:pt-28 pb-20">
      <div className="contenedor max-w-5xl">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-piedra text-[0.7rem] tracking-[0.18em] uppercase hover:text-verde transition-colors">
          <ArrowLeft size={14} /> Volver
        </button>

        <div className="flex items-center gap-3 mt-4 mb-8">
          <span className="icono-caja bg-verde text-blanco"><Lock size={18} /></span>
          <div>
            <h1 className="titulo text-verde text-3xl md:text-4xl leading-none">Pago seguro</h1>
            <p className="text-piedra text-xs mt-1">Tus datos viajan cifrados y los procesa Mercado Pago</p>
          </div>
        </div>

        {error ? (
          <div className="card p-8 text-center max-w-lg mx-auto">
            <XCircle size={40} className="text-error mx-auto mb-3" />
            <p className="text-texto mb-6">{error}</p>
            <Link to={esCurso ? '/formacion' : '/clases'} className="btn btn-secundario">Volver</Link>
          </div>
        ) : !compra ? (
          <div className="grid md:grid-cols-[1fr_360px] gap-6" role="status" aria-label="Cargando">
            <div className="esqueleto h-96 rounded-xl" />
            <div className="esqueleto h-64 rounded-xl" />
          </div>
        ) : resultado ? (
          <Resultado resultado={resultado} compra={compra} esCurso={esCurso} />
        ) : (
          <div className="grid md:grid-cols-[1fr_360px] gap-6 items-start">
            {/* Formulario de pago */}
            <motion.section {...fadeUp} className="card p-4 md:p-6 order-2 md:order-1">
              <p className="text-sm font-semibold text-texto mb-4">Elegí cómo pagar</p>
              {CLAVE_PUBLICA ? (
                <>
                  {!formularioListo && (
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
                    onReady={() => setFormularioListo(true)}
                    onError={(e) => console.error('Formulario de pago:', e)}
                  />
                </>
              ) : (
                // Si todavía no se cargó la clave pública, se paga en el sitio de Mercado Pago
                <div className="text-center py-8">
                  <p className="text-texto/80 text-sm mb-6">Vas a completar el pago en el sitio seguro de Mercado Pago.</p>
                  <a href={compra.init_point} className="btn btn-primario btn-brillo"><Lock size={16} /> Pagar con Mercado Pago</a>
                </div>
              )}
            </motion.section>

            {/* Resumen */}
            <motion.aside {...fadeUp} className="card p-5 md:p-6 order-1 md:order-2 md:sticky md:top-28">
              <p className="etiqueta mb-3">Tu compra</p>
              <div className="flex items-start gap-3 pb-4 border-b border-terracota/15">
                <span className="icono-caja bg-verde/15 text-verde"><IconoProducto size={20} /></span>
                <div>
                  <p className="titulo text-verde text-2xl leading-tight">{compra.titulo}</p>
                  <p className="text-piedra text-xs">{esCurso ? 'Formación Flowness' : 'Clase grabada'}</p>
                </div>
              </div>
              <div className="flex items-end justify-between py-4 border-b border-terracota/15">
                <span className="text-texto/70 text-sm">Total</span>
                <span className="text-texto text-3xl font-semibold">{formatearPrecio(compra.precio)}</span>
              </div>
              <ul className="text-xs text-texto/75 space-y-2 py-4">
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-verde shrink-0" /> Pago único, sin suscripciones</li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-verde shrink-0" /> Acceso inmediato y para siempre</li>
                {esCurso && <li className="flex gap-2"><CheckCircle2 size={14} className="text-verde shrink-0" /> Las lecciones nuevas se suman solas</li>}
              </ul>
              <SellosConfianza compacto className="pt-4 border-t border-terracota/15" />
              <p className="flex items-center gap-1.5 text-piedra text-[0.68rem] mt-4">
                <ShieldCheck size={13} /> Flowness nunca ve ni guarda los datos de tu tarjeta.
              </p>
            </motion.aside>
          </div>
        )}
      </div>
    </main>
  )
}

// Pantalla después de pagar
function Resultado({ resultado, compra, esCurso }) {
  const { status, boleta } = resultado
  const aprobado = status === 'approved'
  const rechazado = status === 'rejected'
  const Icono = aprobado ? CheckCircle2 : rechazado ? XCircle : Hourglass
  const color = aprobado ? 'bg-verde text-blanco' : rechazado ? 'bg-terracota text-blanco' : 'bg-arena text-texto'

  return (
    <motion.div {...fadeUp} className="card p-8 md:p-12 text-center max-w-xl mx-auto">
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        className={`mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center ${color}`}>
        <Icono size={38} strokeWidth={1.8} />
      </motion.span>
      <h2 className="titulo text-verde text-4xl mb-3">
        {aprobado ? '¡Pago aprobado!' : rechazado ? 'El pago no se aprobó' : boleta ? 'Te falta pagar la boleta' : 'Pago en revisión'}
      </h2>
      <p className="text-texto/75 text-sm leading-relaxed mb-8">
        {aprobado
          ? `Ya tenés acceso a ${compra.titulo}. ¡Que lo disfrutes!`
          : rechazado
            ? 'No se hizo ningún cobro. Revisá los datos de la tarjeta o probá con otro medio de pago.'
            : boleta
              ? 'Imprimí o mostrá la boleta en Rapipago o Pago Fácil. Cuando se acredite, se habilita solo en tu cuenta.'
              : 'Mercado Pago está revisando el pago. Apenas se apruebe, se habilita solo en tu cuenta.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {aprobado && (
          <Link to={compra.volver || '/mi-cuenta'} className="btn btn-primario btn-brillo">
            {esCurso ? <><GraduationCap size={16} /> Ir al curso</> : <><PlayCircle size={16} /> Ver la clase</>}
          </Link>
        )}
        {boleta && (
          <a href={boleta} target="_blank" rel="noreferrer" className="btn btn-primario"><FileText size={16} /> Ver boleta <ExternalLink size={13} /></a>
        )}
        {rechazado && (
          <button onClick={() => window.location.reload()} className="btn btn-primario">Probar de nuevo</button>
        )}
        <Link to="/mi-cuenta" className="btn btn-secundario">Mi cuenta</Link>
      </div>
    </motion.div>
  )
}

export default Pagar
