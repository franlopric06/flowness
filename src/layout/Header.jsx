function Header() {
  return (
    <header className="fixed top-0 w-full bg-[#F5F0EB] border-b border-[#D8A48F]/20 z-50">
      <nav className="mx-auto px-4 py-3 flex justify-between items-center md:px-8 md:py-4 lg:px-16">
        
        {/* Logo */}
        <div className="flex flex-col">
          <span className="text-[#7B9B77] font-semibold text-lg tracking-widest uppercase md:text-xl">
            Flowness
          </span>
          <span className="text-[#D8A48F] text-[9px] tracking-widest uppercase hidden md:block">
            Movilidad · Flexibilidad · Mindfulness
          </span>
        </div>

        {/* Links — ocultos en mobile */}
        <ul className="hidden md:flex gap-8 list-none">
          <li><a href="/" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Inicio</a></li>
          <li><a href="/metodo" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">El Método</a></li>
          <li><a href="/cursos" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Cursos</a></li>
          <li><a href="/clases" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Clases Online</a></li>
          <li><a href="/contacto" className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">Contacto</a></li>
        </ul>

        {/* Boton ingresar — oculto en mobile */}
        <a href="/ingresar" className="hidden md:block bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-6 py-3 rounded-full hover:bg-[#5a7a56] transition-colors">
          Ingresar
        </a>

        {/* Hamburger — solo mobile */}
        <button className="flex flex-col gap-1.5 md:hidden">
          <span className="block w-6 h-0.5 bg-[#7B9B77]"></span>
          <span className="block w-6 h-0.5 bg-[#7B9B77]"></span>
          <span className="block w-6 h-0.5 bg-[#7B9B77]"></span>
        </button>

      </nav>
    </header>
  )
}

export default Header