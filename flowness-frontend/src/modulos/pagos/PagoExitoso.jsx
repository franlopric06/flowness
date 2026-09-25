import { Link, useSearchParams } from 'react-router-dom'
import { useVibrar } from '../../compartido/hooks/useVibrar'

// Mercado Pago vuelve acá después de pagar. "volver" indica qué se compró:
// /clases para una clase, /formacion/<nivel> para un curso.
function PagoExitoso() {
  const vibrar = useVibrar()
  const [parametros] = useSearchParams()
  const volver = parametros.get('volver')
  const destino = volver && volver.startsWith('/') && !volver.startsWith('//') ? volver : '/mi-cuenta'
  const esCurso = destino.startsWith('/formacion')
  const pendiente = parametros.get('status') === 'pending' || parametros.get('collection_status') === 'pending'

  return (
    <main className="pt-32 min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-6">{pendiente ? '⏳' : '✅'}</div>
      <h1 className="text-[#7B9B77] text-3xl font-bold tracking-widest mb-4">
        {pendiente ? 'Pago en proceso' : '¡Pago exitoso!'}
      </h1>
      <p className="text-[#A9A9A2] text-sm mb-8 max-w-md">
        {pendiente
          ? 'Mercado Pago está procesando tu pago. Apenas se acredite, se habilita en tu cuenta automáticamente.'
          : `Tu ${esCurso ? 'curso' : 'clase'} ya está disponible. Si todavía no lo ves, esperá unos segundos y recargá la página.`}
      </p>
      <Link to={destino} onClick={vibrar} className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-[#5a7a56] transition-colors">
        {esCurso ? 'Ir al curso' : 'Ver mis clases'}
      </Link>
    </main>
  )
}

export default PagoExitoso
