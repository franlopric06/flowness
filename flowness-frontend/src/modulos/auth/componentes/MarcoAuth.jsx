import { motion } from 'framer-motion'
import { scaleIn } from '../../../compartido/utilidades/animaciones'

// Fondo y tarjeta de las pantallas de cuenta (ingresar, recuperar y cambiar contraseña)
function MarcoAuth({ children }) {
  return (
    <main className="relative isolate overflow-hidden min-h-screen flex items-center justify-center px-5 pt-24 pb-16">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <span className="absolute top-10 -left-24 w-80 h-80 rounded-full bg-verde/25 blur-3xl animate-respirar" />
        <span className="absolute bottom-0 -right-24 w-80 h-80 rounded-full bg-terracota/30 blur-3xl animate-respirar-lento" />
      </div>
      <motion.div {...scaleIn} className="card-vidrio shadow-alta w-full max-w-sm p-7 md:p-9">
        <img src="/logo.png" alt="" className="w-14 h-14 mx-auto mb-4" />
        {children}
      </motion.div>
    </main>
  )
}

export default MarcoAuth
