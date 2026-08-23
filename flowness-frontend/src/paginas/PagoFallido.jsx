import { Link } from 'react-router-dom'
import { useVibrar } from '../hooks/useVibrar'

function PagoFallido() {
  const vibrar = useVibrar()
  return (
    <main className="pt-32 min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-6">❌</div>
      <h1 className="text-[#D8A48F] text-3xl font-bold tracking-widest mb-4">Pago no completado</h1>
      <p className="text-[#A9A9A2] text-sm mb-8">Podés intentarlo nuevamente cuando quieras.</p>
      <Link to="/clases" onClick={vibrar} className="bg-[#D8A48F] text-white text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:opacity-80 transition-colors">
        Volver a clases
      </Link>
    </main>
  )
}

export default PagoFallido
