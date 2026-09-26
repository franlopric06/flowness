import { motion } from 'framer-motion'
import { fadeUpScrollDelay } from '../../../compartido/utilidades/animaciones'
import { useConfiguracion } from '../../../compartido/hooks/useConfiguracion'
import TarjetaAviso from './novedades/TarjetaAviso'

// Avisos cargados en el panel (novedades, clases gratis y promos), debajo de la portada.
// En el celular, si hay varios, se deslizan de costado.
function Novedades({ avisos }) {
  const { whatsapp_numero: whatsapp } = useConfiguracion()
  if (!avisos.length) return null

  const varios = avisos.length > 1
  const grilla = avisos.length >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'

  return (
    <section className="contenedor pt-10 pb-4" aria-label="Novedades">
      <div className={varios
        ? `flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-5 px-5 pb-2 md:grid md:overflow-visible md:mx-0 md:px-0 md:pb-0 ${grilla}`
        : 'max-w-2xl mx-auto'}>
        {avisos.map((aviso, i) => (
          <motion.div key={aviso.id} {...fadeUpScrollDelay(i * 0.08)}
            className={varios ? 'snap-start shrink-0 w-[85%] sm:w-[60%] md:w-auto' : ''}>
            <TarjetaAviso aviso={aviso} whatsapp={whatsapp} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Novedades
