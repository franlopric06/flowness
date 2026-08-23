import { Link } from 'react-router-dom'
import { useVibrar } from '../hooks/useVibrar'

function PiePagina() {
  const vibrar = useVibrar()
  return (
    <footer className="bg-[#F5F0EB] border-t border-[#D8A48F]/20 px-6 py-10 md:px-16">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-[#7B9B77] font-bold text-xl tracking-widest">FLOWNESS</span>
          <p className="text-[#A9A9A2] text-xs tracking-widest uppercase mt-1">Movilidad · Flexibilidad · Mindfulness</p>
        </div>
        <ul className="flex gap-6 list-none flex-wrap justify-center">
          {[['/', 'Inicio'], ['/clases', 'Clases'], ['/sobre-mi', 'Sobre mí'], ['/galeria', 'Galería'], ['/contacto', 'Contacto']].map(([ruta, label]) => (
            <li key={ruta}>
              <Link to={ruta} onClick={vibrar} className="text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors">
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-[#A9A9A2] text-xs">© {new Date().getFullYear()} Flowness</p>
      </div>
    </footer>
  )
}

export default PiePagina
