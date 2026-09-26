import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { avisar } from '../utilidades/avisos'
import NavegacionCompu from './encabezado/NavegacionCompu'
import MenuCelular from './encabezado/MenuCelular'

const LINKS = [
  ['/', 'Inicio'],
  ['/clases', 'Clases'],
  ['/formacion', 'Formación'],
  ['/sobre-mi', 'Sobre mí'],
  ['/galeria', 'Galería'],
  ['/contacto', 'Contacto'],
]

const leerUsuario = () => JSON.parse(localStorage.getItem('usuario') || '{}')

// Encabezado verde (color principal del manual) con el logo en blanco.
// "Inteligente": al bajar se esconde, al subir vuelve a aparecer, y
// cuando no estás arriba de todo se vuelve más compacto y translúcido.
function Encabezado() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [usuario, setUsuario] = useState(leerUsuario)
  const [oculto, setOculto] = useState(false)
  const [compacto, setCompacto] = useState(false)
  const { scrollY } = useScroll()
  const ubicacion = useLocation()

  // Mostrar u ocultar según la dirección del scroll
  useMotionValueEvent(scrollY, 'change', (actual) => {
    const anterior = scrollY.getPrevious() ?? 0
    setCompacto(actual > 20)
    setOculto(actual > anterior && actual > 140 && !menuAbierto)
  })

  // Actualiza el encabezado cuando alguien inicia o cierra sesión
  useEffect(() => {
    const actualizar = () => {
      setToken(localStorage.getItem('token'))
      setUsuario(leerUsuario())
    }
    window.addEventListener('storage', actualizar)
    return () => window.removeEventListener('storage', actualizar)
  }, [])

  // Cierra el menú del celular al cambiar de página
  const [rutaAnterior, setRutaAnterior] = useState(ubicacion.pathname)
  if (rutaAnterior !== ubicacion.pathname) {
    setRutaAnterior(ubicacion.pathname)
    setMenuAbierto(false)
  }

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setToken(null)
    setUsuario({})
    avisar('Cerraste sesión. ¡Hasta pronto!')
    setTimeout(() => window.location.assign('/'), 600)
  }

  const esAdmin = usuario?.rol === 'ADMIN'
  const links = token && !esAdmin ? [...LINKS, ['/mi-cuenta', 'Mi cuenta']] : LINKS

  return (
    <motion.header
      animate={{ y: oculto ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        compacto || menuAbierto ? 'bg-verde/95 backdrop-blur-md shadow-media' : 'bg-verde'
      }`}
    >
      <nav className={`contenedor max-w-7xl flex gap-4 items-center justify-between transition-[height] duration-300 ${compacto ? 'h-16' : 'h-16 md:h-20'}`}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="Flowness, ir al inicio">
          <img src="/logo-blanco.png" alt="" className={`transition-all duration-300 ${compacto ? 'h-10 w-10' : 'h-11 w-11 md:h-14 md:w-14'}`} />
          <span className="flex flex-col leading-none">
            <span className="titulo text-blanco text-xl md:text-2xl">FLOWNESS</span>
            <span className="hidden sm:block lg:hidden text-blanco/70 text-[0.55rem] tracking-[0.2em] uppercase mt-1">Movilidad · Flexibilidad · Mindfulness</span>
          </span>
        </Link>

        {/* Links y botones (computadora) */}
        <NavegacionCompu links={links} token={token} esAdmin={esAdmin} alCerrarSesion={cerrarSesion} />

        {/* Botón del menú (celular) */}
        <button onClick={() => setMenuAbierto((v) => !v)} className="lg:hidden text-blanco p-2 -mr-2"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuAbierto}>
          {menuAbierto ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Menú desplegable (celular) */}
      <MenuCelular abierto={menuAbierto} links={links} token={token} esAdmin={esAdmin} alCerrarSesion={cerrarSesion} />
    </motion.header>
  )
}

export default Encabezado
