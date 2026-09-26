import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sprout, TrendingUp, Award } from 'lucide-react'
import MediaTarjeta from '../../../compartido/componentes/MediaTarjeta'
import TituloSeccion from '../../../compartido/componentes/TituloSeccion'
import { EsqueletoGrilla } from '../../../compartido/componentes/Esqueleto'
import { fadeUpScroll, fadeUpScrollDelay } from '../../../compartido/utilidades/animaciones'
import { formatearPrecio } from '../../../compartido/utilidades/video'

const ICONOS_NIVEL = [Sprout, TrendingUp, Award]

// Tarjeta de un nivel de la formación (video o portada arriba, datos abajo)
function TarjetaNivel({ curso, indice }) {
  const Icono = ICONOS_NIVEL[indice % ICONOS_NIVEL.length]
  return (
    <Link to={`/formacion/${curso.slug}`} className="card card-elevable group flex flex-col h-full">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-verde/35 to-terracota/35">
        <MediaTarjeta muestraUrl={curso.muestraUrl} imagenUrl={curso.portadaUrl} alt={curso.nombre} ancho={640}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-16 h-16 rounded-full bg-blanco/80 text-verde flex items-center justify-center zoom"><Icono size={28} /></span>
          </div>
        </MediaTarjeta>
        <span className="absolute top-3 right-3 titulo text-4xl text-blanco drop-shadow leading-none">0{indice + 1}</span>
      </div>
      <div className="p-6 md:p-7 flex flex-col flex-1">
        <p className="etiqueta mb-1">{curso.subtitulo || `Nivel ${indice + 1}`}</p>
        <h3 className="titulo text-verde text-3xl mb-3">{curso.nombre}</h3>
        {curso.descripcion && <p className="text-texto/75 text-sm leading-relaxed mb-5 line-clamp-3 flex-1">{curso.descripcion}</p>}
        <div className="flex items-center justify-between pt-4 border-t border-terracota/15 mt-auto">
          <p className="font-semibold text-texto">{curso.disponibleParaComprar ? formatearPrecio(curso.precio) : 'Próximamente'}</p>
          <ArrowRight size={18} className="text-verde transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}

// Los niveles de la formación profesional
function SeccionFormacion({ cursos }) {
  if (cursos !== null && cursos.length === 0) return null
  return (
    <section className="contenedor py-20 md:py-28">
      <TituloSeccion
        etiqueta="Para profesionales"
        titulo="Formación Flowness"
        texto="Tres niveles para profesores de educación física, entrenadores y profesionales del movimiento. Método con marca registrada a nivel nacional."
      />
      {cursos === null ? (
        <EsqueletoGrilla cantidad={3} imagen="aspect-[16/10]" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {cursos.map((curso, i) => (
            <motion.div key={curso.id} {...fadeUpScrollDelay(i * 0.12)}><TarjetaNivel curso={curso} indice={i} /></motion.div>
          ))}
        </div>
      )}
      <motion.div {...fadeUpScroll} className="text-center">
        <Link to="/formacion" className="btn btn-secundario">Conocé la formación <ArrowRight size={16} /></Link>
      </motion.div>
    </section>
  )
}

export default SeccionFormacion
