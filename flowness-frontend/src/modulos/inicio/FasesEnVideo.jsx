import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlayCircle, ChevronDown } from 'lucide-react'
import VideoMuestra from '../../compartido/componentes/VideoMuestra'
import Carrusel from '../../compartido/componentes/Carrusel'
import Modal from '../../compartido/componentes/Modal'
import ReproductorVideo from '../../compartido/componentes/ReproductorVideo'
import { listItem } from '../../compartido/utilidades/animaciones'

// Colores de fondo para las fases que todavía no tienen video
const FONDOS = [
  'from-verde to-verde-oscuro',
  'from-terracota to-verde',
  'from-verde-oscuro to-terracota',
  'from-piedra to-verde',
  'from-verde to-terracota',
  'from-terracota to-verde-oscuro',
]

// Tarjeta de una fase estilo reel: el video de fondo y el texto encima
function TarjetaFase({ fase, indice, alVerVideo }) {
  const [abierta, setAbierta] = useState(false)
  return (
    <motion.article {...listItem(indice)}
      className="relative w-[72vw] max-w-[300px] md:w-auto md:max-w-none aspect-[9/16] md:aspect-[3/4] rounded-xl overflow-hidden shadow-alta group">
      {fase.muestraUrl ? (
        <VideoMuestra src={fase.muestraUrl} ancho={600} className="transition-transform duration-700 group-hover:scale-105" />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${FONDOS[indice % FONDOS.length]}`}>
          <span className="absolute -right-4 -top-6 titulo text-blanco/15 text-[12rem] leading-none select-none">{fase.numero}</span>
        </div>
      )}
      {/* Velo para que se lea el texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

      <span className="absolute top-3 left-3 chip bg-blanco/90 text-verde">Fase {fase.numero}</span>
      {fase.videoUrl && (
        <button onClick={() => alVerVideo(fase)} aria-label={`Ver el video de ${fase.nombre}`}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-blanco/90 text-verde flex items-center justify-center shadow-suave hover:scale-110 transition-transform">
          <PlayCircle size={18} />
        </button>
      )}

      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-blanco">
        <h3 className="titulo text-2xl md:text-3xl leading-tight mb-2">{fase.nombre}</h3>
        {fase.descripcion && (
          <>
            <p className={`text-blanco/85 text-xs md:text-sm leading-relaxed whitespace-pre-line ${abierta ? '' : 'line-clamp-3'}`}>{fase.descripcion}</p>
            {fase.descripcion.length > 110 && (
              <button onClick={() => setAbierta((v) => !v)} className="mt-1 inline-flex items-center gap-1 text-[0.65rem] tracking-[0.14em] uppercase text-blanco/80 hover:text-blanco">
                {abierta ? 'Ver menos' : 'Ver más'} <ChevronDown size={12} className={`transition-transform ${abierta ? 'rotate-180' : ''}`} />
              </button>
            )}
          </>
        )}
      </div>
    </motion.article>
  )
}

// Las fases del método como tarjetas con video de fondo.
// Celular: se deslizan hacia el costado · Computadora: grilla de 3
function FasesEnVideo({ fases }) {
  const [faseVideo, setFaseVideo] = useState(null)
  return (
    <>
      <Carrusel claro claseEscritorio="md:mx-0 md:px-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-5">
        {fases.map((fase, i) => <TarjetaFase key={fase.id} fase={fase} indice={i} alVerVideo={setFaseVideo} />)}
      </Carrusel>
      <Modal abierto={!!faseVideo} alCerrar={() => setFaseVideo(null)} titulo={faseVideo?.nombre}>
        {faseVideo && <ReproductorVideo url={faseVideo.videoUrl} titulo={faseVideo.nombre} />}
      </Modal>
    </>
  )
}

export default FasesEnVideo
