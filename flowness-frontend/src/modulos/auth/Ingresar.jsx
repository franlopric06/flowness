import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Lock, UserRound, Eye, EyeOff, Loader2, LogIn, UserPlus, AlertCircle } from 'lucide-react'
import { scaleIn } from '../../compartido/utilidades/animaciones'
import { avisar } from '../../compartido/utilidades/avisos'
import { iniciarSesion, registrar } from './auth.servicio'

// Campo con ícono a la izquierda
function Campo({ icono: Icono, children }) {
  return (
    <label className="relative block">
      <Icono size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-piedra pointer-events-none" />
      {children}
    </label>
  )
}

function Ingresar() {
  const [parametros] = useSearchParams()
  const [modo, setModo] = useState(parametros.get('modo') === 'registro' ? 'registro' : 'login') // 'login' | 'registro'
  // A dónde volver después de ingresar (solo rutas internas del sitio)
  const volver = parametros.get('volver')
  const destinoSeguro = volver && volver.startsWith('/') && !volver.startsWith('//') ? volver : null
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [verClave, setVerClave] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()
  const esLogin = modo === 'login'

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const datos = esLogin
        ? await iniciarSesion({ email: form.email, password: form.password })
        : await registrar(form)
      localStorage.setItem('token', datos.token)
      localStorage.setItem('usuario', JSON.stringify(datos.usuario))
      window.dispatchEvent(new Event('storage'))
      const nombre = datos.usuario?.nombre?.split(' ')[0] || ''
      avisar(esLogin ? `¡Hola${nombre ? `, ${nombre}` : ''}! Qué bueno verte.` : `¡Bienvenida/o${nombre ? `, ${nombre}` : ''}! Tu cuenta está lista.`)
      navigate(destinoSeguro || (datos.usuario.rol === 'ADMIN' ? '/admin' : '/clases'))
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  const cambiarModo = () => {
    setError('')
    setModo(esLogin ? 'registro' : 'login')
  }

  return (
    <main className="relative isolate overflow-hidden min-h-screen flex items-center justify-center px-5 pt-24 pb-16">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <span className="absolute top-10 -left-24 w-80 h-80 rounded-full bg-verde/25 blur-3xl animate-respirar" />
        <span className="absolute bottom-0 -right-24 w-80 h-80 rounded-full bg-terracota/30 blur-3xl animate-respirar-lento" />
      </div>

      <motion.div {...scaleIn} className="card-vidrio shadow-alta w-full max-w-sm p-7 md:p-9">
        <img src="/logo.png" alt="" className="w-14 h-14 mx-auto mb-4" />
        <AnimatePresence mode="wait">
          <motion.div key={modo} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <h1 className="titulo text-verde text-4xl text-center">{esLogin ? 'Ingresar' : 'Crear cuenta'}</h1>
            <p className="text-texto/70 text-sm text-center mt-2 mb-7">
              {esLogin ? 'Entrá para ver tus clases y cursos.' : 'Registrate gratis y empezá a moverte.'}
            </p>
          </motion.div>
        </AnimatePresence>

        <form onSubmit={enviar} className="space-y-3">
          <AnimatePresence initial={false}>
            {!esLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Campo icono={UserRound}>
                  <input type="text" placeholder="Nombre" autoComplete="name" required value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="input pl-11" />
                </Campo>
              </motion.div>
            )}
          </AnimatePresence>
          <Campo icono={Mail}>
            <input type="email" placeholder="Email" autoComplete="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} className="input pl-11" />
          </Campo>
          <Campo icono={Lock}>
            <input type={verClave ? 'text' : 'password'} placeholder="Contraseña" required
              autoComplete={esLogin ? 'current-password' : 'new-password'} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} className="input pl-11 pr-11" />
            <button type="button" onClick={() => setVerClave((v) => !v)} aria-label={verClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-piedra hover:text-verde">
              {verClave ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </Campo>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-error text-xs bg-error/5 rounded-md px-3 py-2">
                <AlertCircle size={14} className="shrink-0" /> {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button type="submit" disabled={cargando} className="btn btn-primario w-full !mt-5">
            {cargando
              ? <><Loader2 size={16} className="animate-spin" /> Un momento…</>
              : esLogin ? <><LogIn size={16} /> Ingresar</> : <><UserPlus size={16} /> Crear cuenta</>}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6" aria-hidden="true">
          <span className="h-px flex-1 bg-terracota/25" /><span className="text-piedra text-[0.65rem] tracking-widest uppercase">o</span><span className="h-px flex-1 bg-terracota/25" />
        </div>

        <button onClick={cambiarModo} className="w-full text-texto/70 text-sm hover:text-verde transition-colors">
          {esLogin ? <>¿No tenés cuenta? <span className="text-verde font-semibold">Registrate</span></> : <>¿Ya tenés cuenta? <span className="text-verde font-semibold">Ingresá</span></>}
        </button>
      </motion.div>
    </main>
  )
}

export default Ingresar
