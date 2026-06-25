import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-[#2a2a2a] px-6 py-12 md:px-16">

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

        {/* Logo y descripcion */}
        <div>
          <p className="text-[#7B9B77] font-semibold text-lg tracking-widest uppercase mb-2">Flowness</p>
          <p className="text-[#D8A48F] text-[9px] tracking-widest uppercase mb-4">Movilidad · Flexibilidad · Mindfulness</p>
          <p className="text-white/40 text-xs leading-relaxed font-light">
            Método propio de bienestar registrado a nivel nacional. Tinogasta, Catamarca, Argentina.
          </p>
        </div>

        {/* Navegacion */}
        <div>
          <p className="text-white/60 text-[10px] tracking-widest uppercase mb-5 font-semibold">Navegación</p>
          <ul className="flex flex-col gap-3 list-none">
            <li><Link to="/" reloadDocument className="text-white/35 text-sm font-light hover:text-[#D8A48F] transition-colors">Inicio</Link></li>
            <li><Link to="/clases"  className="text-white/35 text-sm font-light hover:text-[#D8A48F] transition-colors">Clases Online</Link></li>
            <li><Link to="/formacion" className="text-white/35 text-sm font-light hover:text-[#D8A48F] transition-colors">Formación</Link></li>
            <li><Link to="/sobre-mi" className="text-white/35 text-sm font-light hover:text-[#D8A48F] transition-colors">Sobre mí</Link></li>
            <li><Link to="/galeria" className="text-white/35 text-sm font-light hover:text-[#D8A48F] transition-colors">Galería</Link></li>
            <li><Link to="/contacto" className="text-white/35 text-sm font-light hover:text-[#D8A48F] transition-colors">Contacto</Link></li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <p className="text-white/60 text-[10px] tracking-widest uppercase mb-5 font-semibold">Contacto</p>
          <ul className="flex flex-col gap-3 list-none">
            <li>
              <a href="https://instagram.com/flownessargentina" target="_blank" rel="noreferrer" className="text-white/35 text-sm font-light hover:text-[#D8A48F] transition-colors">
                @flownessargentina
              </a>
            </li>
            <li><p className="text-white/35 text-sm font-light">Hipólito Irigoyen 383</p></li>
            <li><p className="text-white/35 text-sm font-light">Tinogasta, Catamarca</p></li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 mt-10 pt-6 flex flex-col gap-2 md:flex-row md:justify-between">
        <p className="text-white/25 text-xs">© 2026 Flowness — Todos los derechos reservados</p>
        <p className="text-white/25 text-xs">Marca registrada · Argentina</p>
      </div>

    </footer>
  )
}

export default Footer