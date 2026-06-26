import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, registro } from '../services/api'
import SEO from '../components/SEO'

function Login() {
  const [modo, setModo] = useState('login')
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')

    try {
      const datos = modo === 'login'
        ? { email: form.email, password: form.password }
        : { nombre: form.nombre, email: form.email, password: form.password }

      const res = modo === 'login'
        ? await login(datos)
        : await registro(datos)

      if (res.error) {
        setError(res.error)
        setCargando(false)
        return
      }

      localStorage.setItem('token', res.token)
      localStorage.setItem('usuario', JSON.stringify(res.usuario))
      if (res.usuario.rol === 'admin') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/'
      }

    } catch (err) {
      setError('Error al conectar con el servidor')
      setCargando(false)
    }
  }

  return (
    <>
      <SEO
        titulo="Ingresar"
        descripcion="Iniciá sesión o creá tu cuenta en Flowness para acceder a tus cursos y clases online."
        url="/ingresar"
      />
      <main className="min-h-screen bg-[#F5F0EB] flex items-center justify-center px-6 pt-24 pb-10 md:pt-28">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md overflow-hidden">

          {/* Tabs */}
          <div className="flex">
            <button
              onClick={() => setModo('login')}
              className={`flex-1 py-4 text-xs tracking-widest uppercase transition-colors ${
                modo === 'login'
                  ? 'bg-[#7B9B77] text-white'
                  : 'bg-[#F5F0EB] text-[#A9A9A2] hover:text-[#7B9B77]'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setModo('registro')}
              className={`flex-1 py-4 text-xs tracking-widest uppercase transition-colors ${
                modo === 'registro'
                  ? 'bg-[#7B9B77] text-white'
                  : 'bg-[#F5F0EB] text-[#A9A9A2] hover:text-[#7B9B77]'
              }`}
            >
              Registrarse
            </button>
          </div>

          <div className="p-8">
            {modo === 'login' ? (
              <>
                <h2 className="text-2xl font-light text-gray-700 mb-2">Bienvenido de nuevo</h2>
                <p className="text-[#A9A9A2] text-xs tracking-widest uppercase mb-8">
                  Ingresá tus datos para continuar
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-light text-gray-700 mb-2">Crear cuenta</h2>
                <p className="text-[#A9A9A2] text-xs tracking-widest uppercase mb-8">
                  Completá tus datos para registrarte
                </p>
              </>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {modo === 'registro' && (
                <div className="flex flex-col gap-1">
                  <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Nombre completo</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#7B9B77] transition-colors"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#7B9B77] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#7B9B77] transition-colors"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-[#7B9B77] text-white text-xs tracking-widest uppercase py-4 rounded-full hover:bg-[#5a7a56] transition-colors mt-2 disabled:opacity-50"
              >
                {cargando ? 'Cargando...' : modo === 'login' ? 'Ingresar' : 'Crear cuenta'}
              </button>

            </form>

            <div className="mt-6 pt-6 border-t border-[#D8A48F]/20 text-center">
              <Link to="/" className="text-[#A9A9A2] text-xs hover:text-[#D8A48F] transition-colors">
                ← Volver al inicio
              </Link>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}

export default Login