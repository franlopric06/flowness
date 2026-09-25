import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Images, Film, Camera } from 'lucide-react'
import Medio from '../../compartido/componentes/Medio'
import VisorMedios from '../../compartido/componentes/VisorMedios'
import Carrusel from '../../compartido/componentes/Carrusel'
import CabeceraPagina from '../../compartido/componentes/CabeceraPagina'
import EstadoVacio from '../../compartido/componentes/EstadoVacio'
import { fadeUpScroll, fadeUpScrollDelay, listItem } from '../../compartido/utilidades/animaciones'
import { obtenerGaleria } from './galeria.servicio'

function TituloBloque({ icono: Icono, texto }) {
  return (
    <motion.h2 {...fadeUpScroll} className="flex items-center justify-center gap-3 titulo text-verde text-3xl md:text-4xl mb-8">
      <Icono size={24} className="text-terracota" /> {texto}
    </motion.h2>
  )
}

// Galería pública: primero las fotos (con visor a pantalla completa) y después los videos
function Galeria() {
  const [fotos, setFotos] = useState([])
  const [reels, setReels] = useState([])
  const [cargando, setCargando] = useState(true)
  const [fotoAbierta, setFotoAbierta] = useState(null) // índice en el visor
  const [videoAbierto, setVideoAbierto] = useState(null)

  useEffect(() => {
    obtenerGaleria()
      .then((datos) => {
        setFotos(datos?.fotos || [])
        setReels(datos?.reels || [])
      })
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [])

  return (
    <main className="min-h-screen pb-20">
      <CabeceraPagina etiqueta="Momentos" titulo="Galería" texto="Clases, encuentros y momentos de movimiento compartido." />

      <div className="contenedor">
        {cargando ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3" role="status" aria-label="Cargando">
            {[1, 2, 3, 4].map((i) => <div key={i} className="esqueleto mb-3 rounded-md aspect-[4/5]" />)}
          </div>
        ) : fotos.length === 0 && reels.length === 0 ? (
          <EstadoVacio icono={Camera} titulo="Muy pronto" texto="Muy pronto vas a encontrar fotos y videos acá." />
        ) : (
          <>
            {fotos.length > 0 && (
              <section className="mb-20">
                <TituloBloque icono={Images} texto="Fotos" />
                <Carrusel claseEscritorio="items-start md:mx-0 md:px-0 md:overflow-visible md:flex-wrap md:justify-center md:gap-6">
                  {fotos.map((f, i) => (
                    <motion.div key={f.id} {...listItem(i)}>
                      <Medio item={f} clase="foto" alAbrir={() => setFotoAbierta(i)} />
                    </motion.div>
                  ))}
                </Carrusel>
              </section>
            )}

            {reels.length > 0 && (
              <section className={fotos.length > 0 ? 'pt-16 border-t border-terracota/20' : ''}>
                <TituloBloque icono={Film} texto="Videos" />
                <Carrusel claseEscritorio="items-start md:mx-0 md:px-0 md:overflow-visible md:flex-wrap md:justify-center md:gap-6">
                  {reels.map((reel, i) => (
                    <motion.div key={reel.id} {...fadeUpScrollDelay((i % 4) * 0.08)}>
                      <Medio item={reel} clase="video" alAbrir={() => setVideoAbierto(i)} />
                    </motion.div>
                  ))}
                </Carrusel>
              </section>
            )}
          </>
        )}
      </div>

      <VisorMedios items={fotos} indice={fotoAbierta} alCambiar={setFotoAbierta} clase="foto" />
      <VisorMedios items={reels} indice={videoAbierto} alCambiar={setVideoAbierto} clase="video" />
    </main>
  )
}

export default Galeria
