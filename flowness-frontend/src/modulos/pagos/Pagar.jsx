import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Lock, XCircle } from 'lucide-react'
import { avisar } from '../../compartido/utilidades/avisos'
import FormularioPago from './pagar/FormularioPago'
import ResumenCompra from './pagar/ResumenCompra'
import ResultadoPagoPropio from './pagar/ResultadoPagoPropio'
import { prepararPago, procesarPago } from './pagos.servicio'

// Página de pago: resumen de la compra + formulario de Mercado Pago dentro de la página.
// /pagar?clase=ID  o  /pagar?curso=ID
function Pagar() {
  const [parametros] = useSearchParams()
  const claseId = parametros.get('clase')
  const cursoId = parametros.get('curso')
  const navigate = useNavigate()
  const hayUsuario = !!localStorage.getItem('token')
  const [compra, setCompra] = useState(null) // { compraId, preferenceId, titulo, precio, volver, init_point }
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState(null) // respuesta de /procesar

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
          <ResultadoPagoPropio resultado={resultado} compra={compra} esCurso={esCurso} />
        ) : (
          <div className="grid md:grid-cols-[1fr_360px] gap-6 items-start">
            <FormularioPago compra={compra} alEnviar={alEnviar} />
            <ResumenCompra compra={compra} esCurso={esCurso} />
          </div>
        )}
      </div>
    </main>
  )
}

export default Pagar
