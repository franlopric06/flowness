import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Lock, PlayCircle, Sparkles } from 'lucide-react'
import MediaTarjeta from '../../../compartido/componentes/MediaTarjeta'
import TituloSeccion from '../../../compartido/componentes/TituloSeccion'
import { EsqueletoGrilla } from '../../../compartido/componentes/Esqueleto'
import { fadeUpScroll, fadeUpScrollDelay } from '../../../compartido/utilidades/animaciones'
import { formatearPrecio } from '../../../compartido/utilidades/video'
import PromedioChico from '../../../compartido/componentes/resenas/PromedioChico'
import { useResumenResenas } from '../../../compartido/hooks/useResumenResenas'

// Tarjeta de una clase en el Inicio (lleva a la página de Clases)
function TarjetaClase({ clase }) {
  const resumen = useResumenResenas().clases[clase.id]
  return (
    <Link to="/clases" className="card card-elevable group block h-full">
      <div className="relative aspect-video bg-gradient-to-br from-verde/25 to-terracota/25 flex items-center justify-center overflow-hidden">
        <MediaTarjeta muestraUrl={clase.muestraUrl} imagenUrl={clase.miniaturaUrl} alt={clase.nombre} ancho={640} />
        <span className={`chip absolute top-3 left-3 ${clase.esGratis ? 'chip-terracota' : 'chip-claro'}`}>
          {clase.esGratis ? <><Sparkles size={12} /> Gratis</> : <><Lock size={11} /> {formatearPrecio(clase.precio)}</>}
        </span>
        <span className="absolute inset-0 flex items-center justify-center bg-verde/0 group-hover:bg-verde/25 transition-colors">
          <PlayCircle size={46} className="text-blanco opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
        </span>
      </div>
      <div className="p-5">
        <h3 className="titulo text-verde text-xl mb-1">{clase.nombre}</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <PromedioChico resumen={resumen} />
          {clase.duracion && <p className="text-piedra text-xs flex items-center gap-1"><Clock size={12} /> {clase.duracion}</p>}
        </div>
      </div>
    </Link>
  )
}

// Clases destacadas (primero las gratis) e invitación a ver todas
function SeccionClases({ clases }) {
  const lista = clases || []
  const hayClaseGratis = lista.some((c) => c.esGratis)
  const destacadas = [...lista].sort((a, b) => Number(b.esGratis) - Number(a.esGratis)).slice(0, 3)

  return (
    <section className="bg-blanco py-20 md:py-28">
      <div className="contenedor">
        <TituloSeccion
          etiqueta="Para todo público"
          titulo="Clases"
          texto={`Clases grabadas para hacer cuando quieras, a tu ritmo. ${hayClaseGratis ? 'Registrate y mirá la primera gratis; ' : ''}las demás las comprás de a una y quedan en tu cuenta para siempre.`}
        />
        {clases === null ? (
          <EsqueletoGrilla cantidad={3} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" />
        ) : destacadas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {destacadas.map((clase, i) => (
              <motion.div key={clase.id} {...fadeUpScrollDelay(i * 0.1)}><TarjetaClase clase={clase} /></motion.div>
            ))}
          </div>
        )}
        <motion.div {...fadeUpScroll} className="text-center">
          <Link to="/clases" className="btn btn-primario">
            {hayClaseGratis ? 'Empezá gratis' : 'Ver todas las clases'} <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default SeccionClases
