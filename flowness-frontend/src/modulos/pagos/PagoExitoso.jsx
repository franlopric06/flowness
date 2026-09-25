import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Hourglass, PlayCircle, GraduationCap } from 'lucide-react'
import ResultadoPago from './ResultadoPago'
import { avisar } from '../../compartido/utilidades/avisos'

// Mercado Pago vuelve acá después de pagar. "volver" indica qué se compró:
// /clases para una clase, /formacion/<nivel> para un curso.
function PagoExitoso() {
  const [parametros] = useSearchParams()
  const volver = parametros.get('volver')
  const destino = volver && volver.startsWith('/') && !volver.startsWith('//') ? volver : '/mi-cuenta'
  const esCurso = destino.startsWith('/formacion')
  const pendiente = parametros.get('status') === 'pending' || parametros.get('collection_status') === 'pending'

  useEffect(() => {
    avisar(pendiente ? 'Tu pago está en proceso.' : '¡Pago aprobado! Gracias por tu compra.', pendiente ? 'alerta' : 'exito')
  }, [pendiente])

  return (
    <ResultadoPago
      icono={pendiente ? Hourglass : CheckCircle2}
      color={pendiente ? 'bg-arena text-texto' : 'bg-verde text-blanco'}
      titulo={pendiente ? 'Pago en proceso' : '¡Pago exitoso!'}
      texto={pendiente
        ? 'Mercado Pago está procesando tu pago. Apenas se acredite, se habilita en tu cuenta automáticamente.'
        : `Tu ${esCurso ? 'curso' : 'clase'} ya está disponible. Si todavía no lo ves, esperá unos segundos y recargá la página.`}>
      <Link to={destino} className="btn btn-primario btn-brillo">
        {esCurso ? <><GraduationCap size={16} /> Ir al curso</> : <><PlayCircle size={16} /> Ver mis clases</>}
      </Link>
    </ResultadoPago>
  )
}

export default PagoExitoso
