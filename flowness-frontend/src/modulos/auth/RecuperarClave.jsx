import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Mail, MailCheck, Loader2, Send } from 'lucide-react'
import MarcoAuth from './componentes/MarcoAuth'
import Campo from './componentes/Campo'
import MensajeError from './componentes/MensajeError'
import { olvideClave } from './auth.servicio'

// "¿Olvidaste tu contraseña?": pide el email y manda el link para crear una nueva
function RecuperarClave() {
  const [parametros] = useSearchParams()
  const [email, setEmail] = useState(parametros.get('email') || '')
  const [enviado, setEnviado] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const { mensaje } = await olvideClave(email)
      setEnviado(mensaje)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <MarcoAuth>
      {enviado ? (
        <div className="text-center">
          <span className="w-14 h-14 rounded-full bg-verde/15 text-verde flex items-center justify-center mx-auto mb-4"><MailCheck size={26} /></span>
          <h1 className="titulo text-verde text-3xl mb-3">Revisá tu email</h1>
          <p className="text-texto/75 text-sm leading-relaxed mb-6">{enviado}</p>
          <p className="text-piedra text-xs mb-6">El link vence en 1 hora.</p>
          <Link to="/ingresar" className="btn btn-secundario w-full"><ArrowLeft size={16} /> Volver a ingresar</Link>
        </div>
      ) : (
        <>
          <h1 className="titulo text-verde text-3xl text-center">¿Olvidaste tu contraseña?</h1>
          <p className="text-texto/70 text-sm text-center mt-2 mb-7">Escribí el email de tu cuenta y te mandamos un link para crear una nueva.</p>
          <form onSubmit={enviar} className="space-y-3">
            <Campo icono={Mail}>
              <input type="email" placeholder="Email" autoComplete="email" required autoFocus value={email}
                onChange={(e) => setEmail(e.target.value)} className="input pl-11" />
            </Campo>
            <MensajeError texto={error} />
            <button type="submit" disabled={cargando} className="btn btn-primario w-full !mt-5">
              {cargando ? <><Loader2 size={16} className="animate-spin" /> Enviando…</> : <><Send size={16} /> Mandarme el link</>}
            </button>
          </form>
          <Link to="/ingresar" className="flex items-center justify-center gap-1.5 mt-6 text-texto/70 text-sm hover:text-verde">
            <ArrowLeft size={15} /> Volver a ingresar
          </Link>
        </>
      )}
    </MarcoAuth>
  )
}

export default RecuperarClave
