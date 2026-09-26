import { useNavigate } from 'react-router-dom'
import { PlayCircle, ShoppingBag, UserPlus } from 'lucide-react'
import { avisar } from '../../../compartido/utilidades/avisos'
import { formatearPrecio } from '../../../compartido/utilidades/video'

// Botón principal de una clase según el caso:
// - ya tiene acceso → "Ver clase"
// - es gratis → registrarse para verla
// - es paga → comprar (lleva a la página de pago)
function AccionClase({ clase, alVer }) {
  const navigate = useNavigate()
  const hayUsuario = !!localStorage.getItem('token')

  if (clase.tieneAcceso) {
    return <button onClick={alVer} className="btn btn-primario w-full"><PlayCircle size={16} /> Ver clase</button>
  }
  if (clase.esGratis) {
    return (
      <button onClick={() => navigate('/ingresar?modo=registro&volver=/clases')} className="btn btn-acento btn-brillo w-full">
        <UserPlus size={16} /> Registrate y mirala gratis
      </button>
    )
  }

  const comprar = () => {
    const destino = `/pagar?clase=${clase.id}`
    if (!hayUsuario) {
      avisar('Creá tu cuenta o ingresá para comprar la clase.', 'info')
      return navigate(`/ingresar?modo=registro&volver=${encodeURIComponent(destino)}`)
    }
    navigate(destino)
  }

  return (
    <button onClick={comprar} className="btn btn-secundario w-full">
      <ShoppingBag size={16} /> Comprar · {formatearPrecio(clase.precio)}
    </button>
  )
}

export default AccionClase
