import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import IconoWhatsapp from '../componentes/IconoWhatsapp'
import IconoInstagram from '../componentes/IconoInstagram'
import { useConfiguracion } from '../hooks/useConfiguracion'

const LINKS = [
  ['/', 'Inicio'],
  ['/clases', 'Clases'],
  ['/formacion', 'Formación'],
  ['/sobre-mi', 'Sobre mí'],
  ['/galeria', 'Galería'],
  ['/contacto', 'Contacto'],
]

// Pie de página verde (manual) con el patrón decorativo de la marca en terracota
function PiePagina() {
  const config = useConfiguracion()

  const instagram = config.instagram_url || 'https://instagram.com/flownessargentina'
  const whatsapp = config.whatsapp_numero ? `https://wa.me/${config.whatsapp_numero}` : null

  return (
    <footer className="patron-marca bg-verde text-blanco">
      <div className="contenedor py-12 md:py-16 grid gap-10 md:grid-cols-3 md:gap-8">
        {/* Marca */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <img src="/logo-blanco.png" alt="" className="h-16 w-16 mb-3" />
          <p className="titulo text-2xl">FLOWNESS</p>
          <p className="text-blanco/80 text-[0.62rem] tracking-[0.2em] uppercase mt-1">Movilidad · Flexibilidad · Mindfulness</p>
          <p className="text-blanco/80 text-sm italic mt-4">"Armonía entre cuerpo y mente."</p>
        </div>

        {/* Navegación */}
        <nav aria-label="Pie de página" className="text-center md:text-left">
          <p className="text-blanco text-[0.65rem] font-semibold tracking-[0.2em] uppercase mb-4 pb-2 inline-block border-b-2 border-terracota">Navegación</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 max-w-xs mx-auto md:mx-0">
            {LINKS.map(([ruta, texto]) => (
              <li key={ruta}>
                <Link to={ruta} className="text-blanco/85 text-xs tracking-[0.15em] uppercase hover:text-blanco transition-colors">{texto}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contacto */}
        <div className="text-center md:text-left">
          <p className="text-blanco text-[0.65rem] font-semibold tracking-[0.2em] uppercase mb-4 pb-2 inline-block border-b-2 border-terracota">Contacto</p>
          <ul className="space-y-3 text-sm text-blanco/85">
            <li className="flex items-center justify-center md:justify-start gap-2">
              <MapPin size={16} className="shrink-0" /> Tinogasta, Catamarca
            </li>
            <li>
              <a href={instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-blanco">
                <IconoInstagram size={16} /> Instagram
              </a>
            </li>
            {whatsapp && (
              <li>
                <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-blanco">
                  <IconoWhatsapp size={16} /> WhatsApp
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-blanco/15">
        <p className="contenedor py-5 text-center text-blanco/70 text-[0.7rem] tracking-wider">
          © {new Date().getFullYear()} Flowness · Marca registrada
        </p>
      </div>
    </footer>
  )
}

export default PiePagina
