import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { KeyRound, Loader2, LinkIcon } from 'lucide-react'
import { avisar } from '../../compartido/utilidades/avisos'
import MarcoAuth from './componentes/MarcoAuth'
import CampoClave from './componentes/CampoClave'
import MensajeError from './componentes/MensajeError'
import { restablecerClave, guardarSesion } from './auth.servicio'

const MINIMO = 6

// Pantalla a la que lleva el link del email: elegir la contraseña nueva
function RestablecerClave() {
  const [parametros] = useSearchParams()
  const codigo = parametros.get('codigo') || ''
  const [clave, setClave] = useState('')
  const [repetida, setRepetida] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    if (clave.length < MINIMO) return setError(`La contraseña tiene que tener al menos ${MINIMO} caracteres`)
    if (clave !== repetida) return setError('Las dos contraseñas no coinciden')
    setCargando(true)
    try {
      const datos = await restablecerClave(codigo, clave)
      guardarSesion(datos)
      avisar('¡Listo! Tu contraseña cambió y ya estás adentro.')
      navigate(datos.usuario.rol === 'ADMIN' ? '/admin' : '/clases')
    } catch (err) {
      setError(err.message)
      setCargando(false)
    }
  }

  if (!/^[a-f0-9]{64}$/.test(codigo)) {
    return (
      <MarcoAuth>
        <div className="text-center">
          <span className="w-14 h-14 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-4"><LinkIcon size={24} /></span>
          <h1 className="titulo text-verde text-3xl mb-3">El link no es válido</h1>
          <p className="text-texto/75 text-sm mb-6">Puede que esté incompleto. Pedí uno nuevo y usá el último email que te llegue.</p>
          <Link to="/recuperar-clave" className="btn btn-primario w-full">Pedir un link nuevo</Link>
        </div>
      </MarcoAuth>
    )
  }

  return (
    <MarcoAuth>
      <h1 className="titulo text-verde text-3xl text-center">Contraseña nueva</h1>
      <p className="text-texto/70 text-sm text-center mt-2 mb-7">Elegí una contraseña que recuerdes. Tiene que tener al menos {MINIMO} caracteres.</p>
      <form onSubmit={enviar} className="space-y-3">
        <CampoClave valor={clave} alCambiar={setClave} placeholder="Contraseña nueva" autoComplete="new-password" minimo={MINIMO} />
        <CampoClave valor={repetida} alCambiar={setRepetida} placeholder="Repetila" autoComplete="new-password" minimo={MINIMO} />
        <MensajeError texto={error} />
        {error.includes('venció') && (
          <Link to="/recuperar-clave" className="block text-center text-xs text-verde hover:underline">Pedir un link nuevo</Link>
        )}
        <button type="submit" disabled={cargando} className="btn btn-primario w-full !mt-5">
          {cargando ? <><Loader2 size={16} className="animate-spin" /> Guardando…</> : <><KeyRound size={16} /> Guardar contraseña</>}
        </button>
      </form>
    </MarcoAuth>
  )
}

export default RestablecerClave
