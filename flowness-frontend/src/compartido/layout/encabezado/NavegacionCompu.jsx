import { Link, NavLink } from 'react-router-dom'
import { LogOut, LayoutDashboard, UserRound } from 'lucide-react'

// Estilo de cada link: el activo lleva una línea terracota debajo
const estiloLink = ({ isActive }) =>
  `relative py-1 whitespace-nowrap text-[0.68rem] font-medium tracking-[0.14em] xl:tracking-[0.18em] uppercase transition-colors ${
    isActive ? 'text-blanco' : 'text-blanco/75 hover:text-blanco'
  } after:absolute after:left-0 after:-bottom-1 after:h-px after:bg-terracota after:transition-all ${
    isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
  }`

// Links y botones de sesión del encabezado en la computadora
function NavegacionCompu({ links, token, esAdmin, alCerrarSesion }) {
  return (
    <>
      {/* Links (computadora) */}
      <ul className="hidden lg:flex items-center gap-5 xl:gap-7 mx-auto">
        {links.map(([ruta, texto]) => (
          <li key={ruta}><NavLink to={ruta} end={ruta === '/'} className={estiloLink}>{texto}</NavLink></li>
        ))}
      </ul>

      {/* Botones (computadora) */}
      <div className="hidden lg:flex items-center gap-2 shrink-0 whitespace-nowrap">
        {esAdmin && (
          <Link to="/admin" className="btn btn-chico btn-claro"><LayoutDashboard size={14} /> Panel</Link>
        )}
        {token ? (
          <button onClick={alCerrarSesion} className="btn btn-chico btn-contorno-claro"><LogOut size={14} /> Salir</button>
        ) : (
          <Link to="/ingresar" className="btn btn-chico btn-claro"><UserRound size={14} /> Ingresar</Link>
        )}
      </div>
    </>
  )
}

export default NavegacionCompu
