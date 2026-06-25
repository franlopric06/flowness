import { useState } from 'react'
import { Link } from 'react-router-dom'

function Login() {
  const [modo, setModo] = useState('login') // 'login' o 'registro'

  return (
      <main className="min-h-screen bg-[#F5F0EB] flex items-center justify-center px-6 pt-22 pb-10 md:pt-36">
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

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Email</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#7B9B77] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Contraseña</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#7B9B77] transition-colors"
                  />
                </div>
                <p className="text-right text-xs text-[#A9A9A2] hover:text-[#D8A48F] cursor-pointer transition-colors">
                  ¿Olvidaste tu contraseña?
                </p>
                <button className="w-full bg-[#7B9B77] text-white text-xs tracking-widest uppercase py-4 rounded-full hover:bg-[#5a7a56] transition-colors mt-2">
                  Ingresar
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-light text-gray-700 mb-2">Crear cuenta</h2>
              <p className="text-[#A9A9A2] text-xs tracking-widest uppercase mb-8">
                Completá tus datos para registrarte
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Nombre completo</label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#7B9B77] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Email</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#7B9B77] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Contraseña</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#7B9B77] transition-colors"
                  />
                </div>
                <button className="w-full bg-[#7B9B77] text-white text-xs tracking-widest uppercase py-4 rounded-full hover:bg-[#5a7a56] transition-colors mt-2">
                  Crear cuenta
                </button>
              </div>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-[#D8A48F]/20 text-center">
            <Link to="/" className="text-[#A9A9A2] text-xs hover:text-[#D8A48F] transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}

export default Login