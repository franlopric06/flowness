import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, LayoutDashboard, UserRound } from 'lucide-react'
import { dropdown } from '../../utilidades/animaciones'

// Menú desplegable del encabezado en el celular: links y botones de sesión
function MenuCelular({ abierto, links, token, esAdmin, alCerrarSesion }) {
  return (
    <AnimatePresence>
      {abierto && (
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
              <button onClick={alCerrarSesion} className="btn btn-contorno-claro w-full"><LogOut size={16} /> Cerrar sesión</button>
            ) : (
              <Link to="/ingresar" className="btn btn-claro w-full"><UserRound size={16} /> Ingresar</Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MenuCelular
