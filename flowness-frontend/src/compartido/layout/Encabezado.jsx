import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X, LogOut, LayoutDashboard, UserRound } from 'lucide-react'
import { dropdown } from '../utilidades/animaciones'
import { avisar } from '../utilidades/avisos'

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

  const estiloLink = ({ isActive }) =>
    `relative py-1 text-[0.7rem] font-medium tracking-[0.18em] uppercase transition-colors ${
      isActive ? 'text-blanco' : 'text-blanco/75 hover:text-blanco'
    } after:absolute after:left-0 after:-bottom-1 after:h-px after:bg-terracota after:transition-all ${
      isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
    }`

  return (
    <motion.header
      animate={{ y: oculto ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        compacto || menuAbierto ? 'bg-verde/95 backdrop-blur-md shadow-media' : 'bg-verde'
      }`}
    >
      <nav className={`contenedor flex items-center justify-between transition-[height] duration-300 ${compacto ? 'h-16' : 'h-16 md:h-20'}`}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3" aria-label="Flowness, ir al inicio">
          <img src="/logo-blanco.png" alt="" className={`transition-all duration-300 ${compacto ? 'h-10 w-10' : 'h-11 w-11 md:h-14 md:w-14'}`} />
          <span className="flex flex-col leading-none">
            <span className="titulo text-blanco text-xl md:text-2xl">FLOWNESS</span>
            <span className="hidden sm:block lg:hidden xl:block text-blanco/70 text-[0.55rem] tracking-[0.2em] uppercase mt-1">Movilidad · Flexibilidad · Mindfulness</span>
          </span>
        </Link>

        {/* Links (computadora) */}
        <ul className="hidden lg:flex items-center gap-5 xl:gap-7">
          {links.map(([ruta, texto]) => (
            <li key={ruta}><NavLink to={ruta} end={ruta === '/'} className={estiloLink}>{texto}</NavLink></li>
          ))}
        </ul>

        {/* Botones (computadora) */}
        <div className="hidden lg:flex items-center gap-3">
          {esAdmin && (
            <Link to="/admin" className="btn btn-chico btn-claro"><LayoutDashboard size={14} /> Panel</Link>
          )}
          {token ? (
            <button onClick={cerrarSesion} className="btn btn-chico btn-contorno-claro"><LogOut size={14} /> Salir</button>
          ) : (
            <Link to="/ingresar" className="btn btn-chico btn-claro"><UserRound size={14} /> Ingresar</Link>
          )}
        </div>

        {/* Botón del menú (celular) */}
        <button onClick={() => setMenuAbierto((v) => !v)} className="lg:hidden text-blanco p-2 -mr-2"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuAbierto}>
          {menuAbierto ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Menú desplegable (celular) */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.div {...dropdown} transition={{ duration: 0.25 }} className="lg:hidden border-t border-blanco/15">
            <ul className="contenedor py-4 flex flex-col">
              {links.map(([ruta, texto], i) => (
                <motion.li key={ruta} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                  <NavLink to={ruta} end={ruta === '/'}
                    className={({ isActive }) => `block py-3 text-sm tracking-[0.18em] uppercase border-b border-blanco/10 ${isActive ? 'text-blanco font-semibold' : 'text-blanco/80'}`}>
                    {texto}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            <div className="contenedor pb-6 flex flex-col gap-3">
              {esAdmin && <Link to="/admin" className="btn btn-claro w-full"><LayoutDashboard size={16} /> Panel admin</Link>}
              {token ? (
                <button onClick={cerrarSesion} className="btn btn-contorno-claro w-full"><LogOut size={16} /> Cerrar sesión</button>
              ) : (
                <Link to="/ingresar" className="btn btn-claro w-full"><UserRound size={16} /> Ingresar</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Encabezado
