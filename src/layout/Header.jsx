import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'


function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('usuario') || '{}'))

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('token'))
      setUsuario(JSON.parse(localStorage.getItem('usuario') || '{}'))
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setToken(null)
    setUsuario({})
    window.location.href = '/'
  }

  return (
    <header className="fixed top-0 w-full bg-[#F5F0EB] border-b border-[#D8A48F]/20 z-50 py-4">
      <nav className="relative mx-auto px-5 py-3 flex justify-between items-center md:px-8 md:py-4 lg:px-16">

        {/* Espacio izquierdo para balancear — solo mobile */}
        <div className="w-6 md:hidden"></div>

        {/* Logo — centrado en mobile, izquierda en desktop */}
        <div className="absolute left-1/2 -translate-x-1/2 md:static md:left-auto md:translate-x-0 flex flex-col items-center md:items-start">
          <Link to="/">
            <img src={logo} alt="Flowness" className="h-12 md:h-14" />
          </Link>
          <span className="text-[#D8A48F] text-[9px] tracking-widest uppercase hidden md:block mt-1">
            Movilidad · Flexibilidad · Mindfulness
          </span>
        </div>

        {/* Links — ocultos en mobile */}
        <ul className="hidden md:flex gap-8 list-none">
          <li><Link to="/" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Inicio</Link></li>
          <li><Link to="/clases" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Clases Online</Link></li>
          <li><Link to="/formacion" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Formación</Link></li>
          <li><Link to="/sobre-mi" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Sobre mí</Link></li>
          <li><Link to="/galeria" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Galería</Link></li>
          <li><Link to="/contacto" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Contacto</Link></li>
          {token && usuario.rol !== 'admin' && (
            <li><Link to="/mi-cuenta" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Mi cuenta</Link></li>
          )}
        </ul>

        {/* Boton derecho — oculto en mobile */}
        {token && usuario.rol === 'admin' ? (
          <Link to="/admin" className="hidden md:block bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-6 py-3 rounded-full hover:bg-[#5a7a56] transition-colors">
            Panel Admin
          </Link>
        ) : token ? (
          <button onClick={cerrarSesion} className="hidden md:block bg-[#D8A48F] text-white text-xs tracking-widest uppercase px-6 py-3 rounded-full hover:opacity-80 transition-colors">
            Cerrar sesión
          </button>
        ) : (
          <Link to="/ingresar" className="hidden md:block bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-6 py-3 rounded-full hover:bg-[#5a7a56] transition-colors">
            Ingresar
          </Link>
        )}

        {/* Hamburger — solo mobile, derecha */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className="block w-6 h-0.5 bg-[#7B9B77]"></span>
          <span className="block w-6 h-0.5 bg-[#7B9B77]"></span>
          <span className="block w-6 h-0.5 bg-[#7B9B77]"></span>
        </button>

      </nav>

      {/* Menu desplegable — solo mobile */}
      {menuAbierto && (
        <ul className="md:hidden bg-[#F5F0EB] flex flex-col items-center gap-6 py-6 list-none border-t border-[#D8A48F]/20 mt-4">
          <li><Link to="/" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77]" onClick={() => setMenuAbierto(false)}>Inicio</Link></li>
          <li><Link to="/clases" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77]" onClick={() => setMenuAbierto(false)}>Clases Online</Link></li>
          <li><Link to="/formacion" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77]" onClick={() => setMenuAbierto(false)}>Formación</Link></li>
          <li><Link to="/sobre-mi" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77]" onClick={() => setMenuAbierto(false)}>Sobre mí</Link></li>
          <li><Link to="/galeria" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77]" onClick={() => setMenuAbierto(false)}>Galería</Link></li>
          <li><Link to="/contacto" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77]" onClick={() => setMenuAbierto(false)}>Contacto</Link></li>
          {token && usuario.rol !== 'admin' && (
            <li><Link to="/mi-cuenta" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77]" onClick={() => setMenuAbierto(false)}>Mi cuenta</Link></li>
          )}
          {token && usuario.rol === 'admin' ? (
            <li><Link to="/admin" className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-6 py-3 rounded-full" onClick={() => setMenuAbierto(false)}>Panel Admin</Link></li>
          ) : token ? (
            <li><button onClick={cerrarSesion} className="bg-[#D8A48F] text-white text-xs tracking-widest uppercase px-6 py-3 rounded-full">Cerrar sesión</button></li>
          ) : (
            <li><Link to="/ingresar" className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-6 py-3 rounded-full" onClick={() => setMenuAbierto(false)}>Ingresar</Link></li>
          )}
        </ul>
      )}
    </header>
  )
}

export default Header