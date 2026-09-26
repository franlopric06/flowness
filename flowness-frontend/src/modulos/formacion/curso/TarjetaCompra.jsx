import { motion } from 'framer-motion'
import { Clock, PlayCircle, FileText, PlusCircle, ShieldCheck } from 'lucide-react'
import SellosConfianza from '../../../compartido/componentes/SellosConfianza'
import PromedioChico from '../../../compartido/componentes/resenas/PromedioChico'
import { useResumenResenas } from '../../../compartido/hooks/useResumenResenas'
import { fadeUpDelay } from '../../../compartido/utilidades/animaciones'
import { formatearPrecio } from '../../../compartido/utilidades/video'

// Tarjeta lateral con el precio, qué incluye y el botón de compra (en la compu)
function TarjetaCompra({ curso, cantidadVideos, botonCompra }) {
  const resumen = useResumenResenas().cursos[curso.id]
  return (
    <motion.aside {...fadeUpDelay(0.2)} className="lg:sticky lg:top-28 h-fit card p-6 md:p-7 shadow-media">
      <p className="etiqueta mb-2">Inversión</p>
      <p className="text-texto text-4xl font-semibold mb-1">
        {curso.disponibleParaComprar ? formatearPrecio(curso.precio) : 'Próximamente'}
      </p>
      <p className="text-piedra text-xs mb-6">Pago único · acceso para siempre</p>
      <PromedioChico resumen={resumen} className="-mt-3 mb-6" />

      <ul className="text-sm text-texto/85 space-y-3 mb-7">
        {curso.duracion && <li className="flex gap-3"><Clock size={18} className="text-verde shrink-0" /> {curso.duracion}</li>}
        {cantidadVideos > 0 && <li className="flex gap-3"><PlayCircle size={18} className="text-verde shrink-0" /> {cantidadVideos} videos</li>}
        <li className="flex gap-3"><FileText size={18} className="text-verde shrink-0" /> Material en PDF de cada lección</li>
        <li className="flex gap-3"><PlusCircle size={18} className="text-verde shrink-0" /> Las lecciones nuevas se suman solas a tu cuenta</li>
      </ul>

      <div className="hidden lg:block">{botonCompra}</div>
      <p className="hidden lg:flex items-center justify-center gap-1.5 text-piedra text-[0.7rem] mt-3">
        <ShieldCheck size={13} /> Pagás de forma segura con Mercado Pago
      </p>
      <SellosConfianza compacto className="mt-5 pt-5 border-t border-terracota/15" />
    </motion.aside>
  )
}

export default TarjetaCompra
