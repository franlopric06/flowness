import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlayCircle } from 'lucide-react'
import { fadeUpScroll } from '../../../compartido/utilidades/animaciones'

// Última invitación del Inicio antes del pie de página
function Cierre({ hayClaseGratis }) {
  return (
    <section className="relative isolate overflow-hidden bg-arena/60 py-20 md:py-28 text-center">
      <span className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-terracota/30 blur-3xl animate-respirar -z-10" aria-hidden="true" />
      <span className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-verde/25 blur-3xl animate-respirar-lento -z-10" aria-hidden="true" />
      <motion.div {...fadeUpScroll} className="contenedor max-w-2xl">
        <img src="/logo.png" alt="" className="w-14 h-14 mx-auto mb-5" />
        <h2 className="titulo text-verde text-3xl md:text-5xl mb-4">Empezá a moverte con Flowness</h2>
        <p className="text-texto/75 text-sm md:text-base mb-9">
          {hayClaseGratis ? 'Creá tu cuenta gratis y hacé tu primera clase hoy.' : 'Conocé las clases y la formación.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xs sm:max-w-none mx-auto">
          <Link to="/clases" className="btn btn-primario btn-brillo">
            <PlayCircle size={16} /> {hayClaseGratis ? 'Probá una clase gratis' : 'Ver clases'}
          </Link>
          <Link to="/formacion" className="btn btn-secundario">Formación profesional</Link>
        </div>
      </motion.div>
    </section>
  )
}

export default Cierre
