import { useState } from 'react'
import { Link } from 'react-router-dom'

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="fixed top-0 w-full bg-[#F5F0EB] border-b border-[#D8A48F]/20 z-50">
      <nav className="mx-auto px-4 py-3 flex justify-between items-center md:px-8 md:py-4 lg:px-16">
        
        {/* Logo */}
        <div className="flex flex-col">
          <Link to="/">
            <span className="text-[#7B9B77] font-semibold text-lg tracking-widest uppercase md:text-xl">
              Flowness
            </span>
          </Link>
          <span className="text-[#D8A48F] text-[9px] tracking-widest uppercase hidden md:block">
            Movilidad · Flexibilidad · Mindfulness
          </span>
        </div>

        {/* Links — ocultos en mobile */}
        <ul className="hidden md:flex gap-8 list-none">
          <li><Link to="/" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Inicio</Link></li>
          <li><Link to="/clases" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Clases Online</Link></li>
          <li><Link to="/sobre-mi" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Sobre mí</Link></li>
          <li><Link to="/cursos" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Cursos</Link></li>
          <li><Link to="/galeria" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Galería</Link></li>
          <li><Link to="/contacto" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Contacto</Link></li>
        </ul>

        {/* Boton ingresar — oculto en mobile */}
        <Link to="/ingresar" className="hidden md:block bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-6 py-3 rounded-full hover:bg-[#5a7a56] transition-colors">
          Ingresar
        </Link>

        {/* Hamburger — solo mobile */}
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
        <ul className="md:hidden flex flex-col items-center gap-6 py-6 list-none border-t border-[#D8A48F]/20">
          <li><Link to="/" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77]" onClick={() => setMenuAbierto(false)}>Inicio</Link></li>
          <li><Link to="/clases" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77]" onClick={() => setMenuAbierto(false)}>Clases Online</Link></li>
          <li><Link to="/sobre-mi" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77]" onClick={() => setMenuAbierto(false)}>Sobre mí</Link></li>
          <li><Link to="/cursos" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77]" onClick={() => setMenuAbierto(false)}>Cursos</Link></li>
          <li><Link to="/galeria" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77]" onClick={() => setMenuAbierto(false)}>Galería</Link></li>
          <li><Link to="/contacto" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77]" onClick={() => setMenuAbierto(false)}>Contacto</Link></li>
          <li><Link to="/ingresar" className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-6 py-3 rounded-full" onClick={() => setMenuAbierto(false)}>Ingresar</Link></li>
        </ul>
      )}
    </header>
  )
}

export default Header