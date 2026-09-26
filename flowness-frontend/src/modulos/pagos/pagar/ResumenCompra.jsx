import { motion } from 'framer-motion'
import { CheckCircle2, ShieldCheck, PlayCircle, GraduationCap } from 'lucide-react'
import SellosConfianza from '../../../compartido/componentes/SellosConfianza'
import { fadeUp } from '../../../compartido/utilidades/animaciones'
import { formatearPrecio } from '../../../compartido/utilidades/video'

// Tarjeta "Tu compra": qué se compra, el total y los sellos de confianza
function ResumenCompra({ compra, esCurso }) {
  const IconoProducto = esCurso ? GraduationCap : PlayCircle
  return (
    <motion.aside {...fadeUp} className="card p-5 md:p-6 order-1 md:order-2 md:sticky md:top-28">
      <p className="etiqueta mb-3">Tu compra</p>
      <div className="flex items-start gap-3 pb-4 border-b border-terracota/15">
        <span className="icono-caja bg-verde/15 text-verde"><IconoProducto size={20} /></span>
        <div>
          <p className="titulo text-verde text-2xl leading-tight">{compra.titulo}</p>
          <p className="text-piedra text-xs">{esCurso ? 'Formación Flowness' : 'Clase grabada'}</p>
        </div>
      </div>
      <div className="flex items-end justify-between py-4 border-b border-terracota/15">
        <span className="text-texto/70 text-sm">Total</span>
        <span className="text-texto text-3xl font-semibold">{formatearPrecio(compra.precio)}</span>
      </div>
      <ul className="text-xs text-texto/75 space-y-2 py-4">
        <li className="flex gap-2"><CheckCircle2 size={14} className="text-verde shrink-0" /> Pago único, sin suscripciones</li>
        <li className="flex gap-2"><CheckCircle2 size={14} className="text-verde shrink-0" /> Acceso inmediato y para siempre</li>
        {esCurso && <li className="flex gap-2"><CheckCircle2 size={14} className="text-verde shrink-0" /> Las lecciones nuevas se suman solas</li>}
      </ul>
      <SellosConfianza compacto className="pt-4 border-t border-terracota/15" />
      <p className="flex items-center gap-1.5 text-piedra text-[0.68rem] mt-4">
        <ShieldCheck size={13} /> Flowness nunca ve ni guarda los datos de tu tarjeta.
      </p>
    </motion.aside>
  )
}

export default ResumenCompra
