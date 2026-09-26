import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import VideoMuestra from '../../../compartido/componentes/VideoMuestra'
import MediosDePago from '../../../compartido/componentes/MediosDePago'
import { fadeUp, fadeUpScroll } from '../../../compartido/utilidades/animaciones'
import { formatearPrecio } from '../../../compartido/utilidades/video'
import { imagenReducida } from '../../../compartido/utilidades/medios'
import CabeceraCurso from './CabeceraCurso'
import TemarioCurso from './TemarioCurso'
import TarjetaCompra from './TarjetaCompra'
import BotonCompra from './BotonCompra'

// Página de venta de un nivel (para quien todavía no lo compró)
function PaginaVenta({ curso }) {
  const faltan = Math.max((curso.totalVideos || 0) - curso.lecciones.length, 0)
  const cantidadVideos = curso.totalVideos || curso.lecciones.length
  const botonCompra = <BotonCompra curso={curso} />

  return (
    <main className="min-h-screen pb-28 lg:pb-20">
      <CabeceraCurso curso={curso} cantidadVideos={cantidadVideos} />
      <MediosDePago className="mb-10" />

      <div className="contenedor grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        <div>
          {(curso.muestraUrl || curso.portadaUrl) && (
            <motion.div {...fadeUp} className="relative w-full aspect-video rounded-xl overflow-hidden shadow-media mb-10 bg-arena">
              {curso.muestraUrl
                ? <VideoMuestra src={curso.muestraUrl} portada={curso.portadaUrl ? imagenReducida(curso.portadaUrl, 1100) : undefined} ancho={1100} />
                : <img src={imagenReducida(curso.portadaUrl, 1100)} alt={curso.nombre} className="absolute inset-0 w-full h-full object-cover" />}
            </motion.div>
          )}

          {curso.descripcion && (
            <motion.p {...fadeUpScroll} className="text-texto/85 text-base leading-relaxed whitespace-pre-line mb-10">{curso.descripcion}</motion.p>
          )}

          {curso.dirigidoA && (
            <motion.section {...fadeUpScroll} className="card-vidrio p-6 mb-10 flex gap-4">
              <span className="icono-caja bg-verde/15 text-verde"><Users size={20} /></span>
              <div>
                <h2 className="titulo text-verde text-2xl mb-2">¿A quién está dirigido?</h2>
                <p className="text-texto/80 text-sm leading-relaxed whitespace-pre-line">{curso.dirigidoA}</p>
              </div>
            </motion.section>
          )}

          <TemarioCurso lecciones={curso.lecciones} faltan={faltan} />
        </div>

        <TarjetaCompra curso={curso} cantidadVideos={cantidadVideos} botonCompra={botonCompra} />
      </div>

      {/* Barra de compra fija (celular) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-blanco/95 backdrop-blur border-t border-terracota/20 px-4 py-3 flex items-center gap-3 shadow-alta">
        <div className="shrink-0">
          <p className="text-piedra text-[0.6rem] tracking-[0.16em] uppercase">{curso.nombre}</p>
          <p className="text-texto font-semibold">{curso.disponibleParaComprar ? formatearPrecio(curso.precio) : 'Próximamente'}</p>
        </div>
        <div className="flex-1">{botonCompra}</div>
      </div>
    </main>
  )
}

export default PaginaVenta
