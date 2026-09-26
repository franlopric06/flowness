import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, UserRound, Loader2, LogIn, UserPlus } from 'lucide-react'
import { avisar } from '../../compartido/utilidades/avisos'
import MarcoAuth from './componentes/MarcoAuth'
import Campo from './componentes/Campo'
import CampoClave from './componentes/CampoClave'
import MensajeError from './componentes/MensajeError'
import { useRecuperacionDisponible } from './componentes/useRecuperacionDisponible'
import { iniciarSesion, registrar, guardarSesion } from './auth.servicio'

// Ingresar o crear cuenta (se cambia de uno a otro sin salir de la página)
function Ingresar() {
  const [parametros] = useSearchParams()
  const [modo, setModo] = useState(parametros.get('modo') === 'registro' ? 'registro' : 'login') // 'login' | 'registro'
  // A dónde volver después de ingresar (solo rutas internas del sitio)
  const volver = parametros.get('volver')
  const destinoSeguro = volver && volver.startsWith('/') && !volver.startsWith('//') ? volver : null
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const puedeRecuperar = useRecuperacionDisponible()
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
      guardarSesion(datos)
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
    <MarcoAuth>
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
        <CampoClave valor={form.password} alCambiar={(password) => setForm({ ...form, password })}
          autoComplete={esLogin ? 'current-password' : 'new-password'} minimo={esLogin ? undefined : 6}
          placeholder={esLogin ? 'Contraseña' : 'Contraseña (mínimo 6 caracteres)'} />

        {esLogin && puedeRecuperar && (
          <p className="text-right">
            <Link to={`/recuperar-clave${form.email ? `?email=${encodeURIComponent(form.email)}` : ''}`} className="text-xs text-verde hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        )}

        <MensajeError texto={error} />

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
    </MarcoAuth>
  )
}

export default Ingresar
