import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { destinoDePromo } from '../../utilidades/promociones'

const CADA = 6000 // milisegundos que se ve cada promo cuando hay varias

// Botón de la promo: a una página del sitio o a un link de afuera
function BotonPromo({ promo, whatsapp }) {
  const destino = destinoDePromo(promo, whatsapp)
  if (!destino) return null
  const clase = 'inline-flex items-center gap-1 font-semibold underline underline-offset-4 decoration-blanco/50 hover:decoration-blanco whitespace-nowrap'
  const texto = promo.destino === 'whatsapp' ? 'Consultar' : 'Ver más'
  return destino.interno
    ? <Link to={destino.interno} className={clase}>{texto} <ArrowRight size={14} /></Link>
    : <a href={destino.externo} target="_blank" rel="noreferrer" className={clase}>{texto} <ArrowRight size={14} /></a>
}

// Barra verde con las promociones vigentes. Si hay varias, van rotando.
function BarraPromos({ promos, whatsapp }) {
  const [actual, setActual] = useState(0)

  useEffect(() => {
    if (promos.length < 2) return
    const intervalo = setInterval(() => setActual((i) => (i + 1) % promos.length), CADA)
    return () => clearInterval(intervalo)
  }, [promos.length])

  if (promos.length === 0) return null
  const promo = promos[actual % promos.length]

  return (
    <div className="bg-verde-oscuro text-blanco" role="region" aria-label="Promociones">
      <div className="contenedor min-h-12 py-2.5 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p key={promo.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-sm">
            <span className="inline-flex items-center gap-2 font-medium">
              <Sparkles size={15} className="text-arena shrink-0" /> {promo.texto}
            </span>
            <BotonPromo promo={promo} whatsapp={whatsapp} />
          </motion.p>
        </AnimatePresence>
        {promos.length > 1 && (
          <span className="hidden sm:flex gap-1.5 ml-4" aria-hidden="true">
            {promos.map((p, i) => (
              <span key={p.id} className={`w-1.5 h-1.5 rounded-full ${i === actual % promos.length ? 'bg-blanco' : 'bg-blanco/35'}`} />
            ))}
          </span>
        )}
      </div>
    </div>
  )
}

export default BarraPromos
