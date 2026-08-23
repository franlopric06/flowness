import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVibrar } from '../hooks/useVibrar'
import { iniciarSesion, registrar } from '../servicios/api'

function Ingresar() {
  const [modo, setModo] = useState('login') // 'login' | 'registro'
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const vibrar = useVibrar()
  const navigate = useNavigate()

  const enviar = async () => {
    vibrar()
    setError('')
    setCargando(true)
    try {
      const datos = modo === 'login'
        ? await iniciarSesion({ email: form.email, password: form.password })
        : await registrar(form)
      localStorage.setItem('token', datos.token)
      localStorage.setItem('usuario', JSON.stringify(datos.usuario))
      window.dispatchEvent(new Event('storage'))
      navigate(datos.usuario.rol === 'ADMIN' ? '/admin' : '/clases')
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="pt-32 min-h-screen flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm border border-[#D8A48F]/20 shadow-sm">
        <h1 className="text-[#7B9B77] text-xl font-bold tracking-widest text-center mb-6">
          {modo === 'login' ? 'Ingresar' : 'Registrarse'}
        </h1>
        {modo === 'registro' && (
          <input
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
            className="w-full border border-[#D8A48F]/30 rounded-full px-5 py-3 text-sm mb-3 outline-none focus:border-[#7B9B77]"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full border border-[#D8A48F]/30 rounded-full px-5 py-3 text-sm mb-3 outline-none focus:border-[#7B9B77]"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="w-full border border-[#D8A48F]/30 rounded-full px-5 py-3 text-sm mb-4 outline-none focus:border-[#7B9B77]"
        />
        {error && <p className="text-red-400 text-xs text-center mb-3">{error}</p>}
        <button
          onClick={enviar}
          disabled={cargando}
          className="w-full bg-[#7B9B77] text-white text-xs tracking-widest uppercase py-3 rounded-full hover:bg-[#5a7a56] transition-colors disabled:opacity-50"
        >
          {cargando ? 'Cargando...' : modo === 'login' ? 'Ingresar' : 'Registrarse'}
        </button>
        <button
          onClick={() => { vibrar(); setModo(modo === 'login' ? 'registro' : 'login') }}
          className="w-full text-[#A9A9A2] text-xs tracking-widest uppercase mt-4 hover:text-[#7B9B77] transition-colors"
        >
          {modo === 'login' ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Ingresá'}
        </button>
      </div>
    </main>
  )
}

export default Ingresar
