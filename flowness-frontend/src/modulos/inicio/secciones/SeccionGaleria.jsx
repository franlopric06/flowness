import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Images, Film } from 'lucide-react'
import Medio from '../../../compartido/componentes/Medio'
import VisorMedios from '../../../compartido/componentes/VisorMedios'
import TituloSeccion from '../../../compartido/componentes/TituloSeccion'
import Carrusel from '../../../compartido/componentes/Carrusel'
import { fadeUpScrollDelay, listItem } from '../../../compartido/utilidades/animaciones'

const ESCRITORIO = 'items-start md:mx-0 md:px-0 md:overflow-visible md:flex-wrap md:justify-center md:gap-6'

// Subtítulo con ícono ("Fotos", "Videos")
function Subtitulo({ icono: Icono, children }) {
  return <p className="flex items-center justify-center gap-2 text-verde text-xs font-semibold tracking-[0.2em] uppercase mb-5"><Icono size={16} /> {children}</p>
}

// Algunas fotos y videos de la galería (8 en el celular, 4 en la compu), con visor
function SeccionGaleria({ galeria }) {
  const [fotoAbierta, setFotoAbierta] = useState(null)
  const [videoAbierto, setVideoAbierto] = useState(null)
  const fotos = galeria.fotos.slice(0, 8)
  const reels = galeria.reels.slice(0, 8)
  if (!fotos.length && !reels.length) return null

  return (
    <section className="contenedor py-20 md:py-28">
      <TituloSeccion etiqueta="Galería" titulo="Momentos Flowness" />

      {fotos.length > 0 && (
        <div className="mb-14">
          <Subtitulo icono={Images}>Fotos</Subtitulo>
          <Carrusel claseEscritorio={ESCRITORIO}>
            {fotos.map((foto, i) => (
              <motion.div key={foto.id} {...listItem(i)} className={i >= 4 ? 'md:hidden' : ''}>
                <Medio item={{ ...foto, descripcion: null }} clase="foto" alAbrir={() => setFotoAbierta(i)} />
              </motion.div>
            ))}
          </Carrusel>
        </div>
      )}

      {reels.length > 0 && (
        <div className="mb-14">
          <Subtitulo icono={Film}>Videos</Subtitulo>
          <Carrusel claseEscritorio={ESCRITORIO}>
            {reels.map((reel, i) => (
              <motion.div key={reel.id} {...fadeUpScrollDelay((i % 4) * 0.1)} className={i >= 4 ? 'md:hidden' : ''}>
                <Medio item={reel} clase="video" alAbrir={() => setVideoAbierto(i)} />
              </motion.div>
            ))}
          </Carrusel>
        </div>
      )}

      <div className="text-center">
        <Link to="/galeria" className="btn btn-secundario">Ver galería completa <ArrowRight size={16} /></Link>
      </div>

      <VisorMedios items={fotos} indice={fotoAbierta} alCambiar={setFotoAbierta} clase="foto" />
      <VisorMedios items={reels} indice={videoAbierto} alCambiar={setVideoAbierto} clase="video" />
    </section>
  )
}

export default SeccionGaleria
