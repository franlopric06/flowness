import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { XCircle, RotateCcw, MessageCircleQuestion } from 'lucide-react'
import ResultadoPago from './ResultadoPago'
import { avisar } from '../../compartido/utilidades/avisos'

function PagoFallido() {
  useEffect(() => {
    avisar('El pago no se completó.', 'error')
  }, [])

  return (
    <ResultadoPago icono={XCircle} color="bg-terracota text-blanco" titulo="Pago no completado"
      texto="No se realizó ningún cobro. Podés intentarlo nuevamente cuando quieras.">
      <Link to="/clases" className="btn btn-primario"><RotateCcw size={16} /> Volver a intentar</Link>
      <Link to="/contacto" className="btn btn-secundario"><MessageCircleQuestion size={16} /> Necesito ayuda</Link>
    </ResultadoPago>
  )
}

export default PagoFallido
