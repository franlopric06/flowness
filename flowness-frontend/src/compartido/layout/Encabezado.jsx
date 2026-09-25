import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useVibrar } from '../hooks/useVibrar'

function Encabezado() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('usuario') || '{}'))
  const vibrar = useVibrar()

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('token'))
      setUsuario(JSON.parse(localStorage.getItem('usuario') || '{}'))
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const cerrarSesion = () => {
    vibrar()
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setToken(null)
    setUsuario({})
    window.location.href = '/'
  }

  const esAdmin = usuario?.rol === 'ADMIN'

  return (
    <header className="fixed top-0 w-full bg-[#F5F0EB] border-b border-[#D8A48F]/20 z-50">
      <nav className="relative mx-auto px-5 py-3 flex justify-between items-center md:px-8 md:py-4 lg:px-16">

        <div className="w-6 md:hidden"></div>

        <div className="absolute left-1/2 -translate-x-1/2 md:static md:left-auto md:translate-x-0 flex flex-col items-center md:items-start">
          <Link to="/" onClick={vibrar}>
            <span className="text-[#7B9B77] font-bold text-2xl tracking-widest">FLOWNESS</span>
          </Link>
          <span className="text-[#D8A48F] text-[9px] tracking-widest uppercase hidden md:block mt-1">
            Movilidad · Flexibilidad · Mindfulness
          </span>
        </div>

        <ul className="hidden md:flex gap-8 list-none">
          {[['/', 'Inicio'], ['/clases', 'Clases'], ['/sobre-mi', 'Sobre mí'], ['/galeria', 'Galería'], ['/contacto', 'Contacto']].map(([ruta, label]) => (
            <li key={ruta}>
              <Link to={ruta} onClick={vibrar} className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">
                {label}
              </Link>
            </li>
          ))}
          {token && !esAdmin && (
            <li><Link to="/mi-cuenta" onClick={vibrar} className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Mi cuenta</Link></li>
          )}
        </ul>

        {esAdmin ? (
          <Link to="/admin" onClick={vibrar} className="hidden md:block bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-6 py-3 rounded-full hover:bg-[#5a7a56] transition-colors">
            Panel Admin
          </Link>
        ) : token ? (
          <button onClick={cerrarSesion} className="hidden md:block bg-[#D8A48F] text-white text-xs tracking-widest uppercase px-6 py-3 rounded-full hover:opacity-80 transition-colors">
            Cerrar sesión
          </button>
        ) : (
          <Link to="/ingresar" onClick={vibrar} className="hidden md:block bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-6 py-3 rounded-full hover:bg-[#5a7a56] transition-colors">
            Ingresar
          </Link>
        )}

        <button className="flex flex-col gap-1.5 md:hidden" onClick={() => { vibrar(); setMenuAbierto(!menuAbierto) }}>
          <span className="block w-6 h-0.5 bg-[#7B9B77]"></span>
          <span className="block w-6 h-0.5 bg-[#7B9B77]"></span>
          <span className="block w-6 h-0.5 bg-[#7B9B77]"></span>
        </button>
      </nav>

      {menuAbierto && (
        <ul className="md:hidden bg-[#F5F0EB] flex flex-col items-center gap-6 py-6 list-none border-t border-[#D8A48F]/20">
          {[['/', 'Inicio'], ['/clases', 'Clases'], ['/sobre-mi', 'Sobre mí'], ['/galeria', 'Galería'], ['/contacto', 'Contacto']].map(([ruta, label]) => (
            <li key={ruta}>
              <Link to={ruta} onClick={() => { vibrar(); setMenuAbierto(false) }} className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77]">
                {label}
              </Link>
            </li>
          ))}
          {token && !esAdmin && (
            <li><Link to="/mi-cuenta" onClick={() => { vibrar(); setMenuAbierto(false) }} className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77]">Mi cuenta</Link></li>
          )}
          {esAdmin ? (
            <li><Link to="/admin" onClick={() => { vibrar(); setMenuAbierto(false) }} className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-6 py-3 rounded-full">Panel Admin</Link></li>
          ) : token ? (
            <li><button onClick={cerrarSesion} className="bg-[#D8A48F] text-white text-xs tracking-widest uppercase px-6 py-3 rounded-full">Cerrar sesión</button></li>
          ) : (
            <li><Link to="/ingresar" onClick={() => { vibrar(); setMenuAbierto(false) }} className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-6 py-3 rounded-full">Ingresar</Link></li>
          )}
        </ul>
      )}
    </header>
  )
}

export default Encabezado
