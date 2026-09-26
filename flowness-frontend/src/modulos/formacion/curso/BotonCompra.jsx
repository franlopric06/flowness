import { useNavigate } from 'react-router-dom'
import { ShoppingBag, UserPlus, Hourglass } from 'lucide-react'
import { avisar } from '../../../compartido/utilidades/avisos'

// Botón "Comprar" (lleva a la página de pago; si no ingresó, primero a registrarse)
function BotonCompra({ curso }) {
  const navigate = useNavigate()
  const hayUsuario = !!localStorage.getItem('token')

  if (!curso.disponibleParaComprar) {
    return (
      <p className="flex items-center justify-center gap-2 text-piedra text-xs tracking-[0.16em] uppercase py-3.5 border border-piedra/40 rounded-full">
        <Hourglass size={14} /> Disponible próximamente
      </p>
    )
  }

  const comprar = () => {
    const destino = `/pagar?curso=${curso.id}`
    if (!hayUsuario) {
      avisar('Creá tu cuenta o ingresá para comprar el curso.', 'info')
      return navigate(`/ingresar?modo=registro&volver=${encodeURIComponent(destino)}`)
    }
    navigate(destino)
  }

  return (
    <button onClick={comprar} className="btn btn-primario btn-brillo w-full">
      {hayUsuario ? <><ShoppingBag size={16} /> Comprar</> : <><UserPlus size={16} /> Registrate para comprar</>}
    </button>
  )
}

export default BotonCompra
