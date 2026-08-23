import { Link } from 'react-router-dom'
import { useVibrar } from '../hooks/useVibrar'

function PagoExitoso() {
  const vibrar = useVibrar()
  return (
    <main className="pt-32 min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-[#7B9B77] text-3xl font-bold tracking-widest mb-4">¡Pago exitoso!</h1>
      <p className="text-[#A9A9A2] text-sm mb-8">Tu clase ya está disponible en tu cuenta.</p>
      <Link to="/clases" onClick={vibrar} className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-[#5a7a56] transition-colors">
        Ver mis clases
      </Link>
    </main>
  )
}

export default PagoExitoso
