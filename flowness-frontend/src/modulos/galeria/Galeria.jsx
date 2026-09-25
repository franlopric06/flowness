import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Images, Film, Camera } from 'lucide-react'
import Medio from '../../compartido/componentes/Medio'
import IconoInstagram from '../../compartido/componentes/IconoInstagram'
import { usePerfilInstagram } from '../../compartido/hooks/usePerfilInstagram'
import Carrusel from '../../compartido/componentes/Carrusel'
import CabeceraPagina from '../../compartido/componentes/CabeceraPagina'
import EstadoVacio from '../../compartido/componentes/EstadoVacio'
import { fadeUpScroll, fadeUpScrollDelay, listItem } from '../../compartido/utilidades/animaciones'
import { imagenReducida, urlEmbedInstagram } from '../../compartido/utilidades/medios'
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
  const [abierta, setAbierta] = useState(null) // índice de la foto abierta en el visor
  const [direccion, setDireccion] = useState(0)
  const perfilInstagram = usePerfilInstagram()

  useEffect(() => {
    obtenerGaleria()
      .then((datos) => {
        setFotos(datos?.fotos || [])
        setReels(datos?.reels || [])
      })
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [])

  const cerrar = useCallback(() => setAbierta(null), [])
  const mover = useCallback((paso) => {
    setDireccion(paso)
    setAbierta((i) => (i + paso + fotos.length) % fotos.length)
  }, [fotos.length])

  // Teclado en el visor: flechas y Escape. Además, bloquea el scroll de fondo.
  useEffect(() => {
    if (abierta === null) return
    const alApretar = (e) => {
      if (e.key === 'Escape') cerrar()
      if (e.key === 'ArrowRight') mover(1)
      if (e.key === 'ArrowLeft') mover(-1)
    }
    window.addEventListener('keydown', alApretar)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', alApretar)
      document.body.style.overflow = ''
    }
  }, [abierta, cerrar, mover])

  // Deslizar con el dedo para pasar de foto
  const alSoltar = (_, info) => {
    if (info.offset.x < -60 || info.velocity.x < -400) mover(1)
    else if (info.offset.x > 60 || info.velocity.x > 400) mover(-1)
  }

  const foto = abierta !== null ? fotos[abierta] : null

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
                      <Medio item={f} clase="foto" alAbrir={() => { setDireccion(0); setAbierta(i) }} />
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
                      <Medio item={reel} clase="video" />
                    </motion.div>
                  ))}
                </Carrusel>
              </section>
            )}
          </>
        )}
      </div>

      {/* Visor de fotos (se puede deslizar con el dedo) */}
      <AnimatePresence>
        {foto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center" onClick={cerrar}>
            <button onClick={cerrar} aria-label="Cerrar"
              className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-blanco/10 text-blanco hover:bg-blanco/20 flex items-center justify-center">
              <X size={22} />
            </button>
            {fotos.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); mover(-1) }} aria-label="Anterior"
                  className="hidden md:flex absolute left-6 z-10 w-12 h-12 rounded-full bg-blanco/10 text-blanco hover:bg-blanco/20 items-center justify-center">
                  <ChevronLeft size={26} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); mover(1) }} aria-label="Siguiente"
                  className="hidden md:flex absolute right-6 z-10 w-12 h-12 rounded-full bg-blanco/10 text-blanco hover:bg-blanco/20 items-center justify-center">
                  <ChevronRight size={26} />
                </button>
              </>
            )}

            <AnimatePresence mode="popLayout" initial={false} custom={direccion}>
              <motion.figure key={foto.id} custom={direccion}
                initial={{ opacity: 0, x: direccion * 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direccion * -80 }}
                transition={{ duration: 0.25 }}
                drag={fotos.length > 1 ? 'x' : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.6} onDragEnd={alSoltar}
                className="max-w-5xl w-full px-4 flex flex-col items-center cursor-grab active:cursor-grabbing touch-pan-y"
                onClick={(e) => e.stopPropagation()}>
                {foto.tipo === 'INSTAGRAM' ? (
                  <iframe src={urlEmbedInstagram(foto.url)} title={foto.descripcion || 'Foto de Instagram'} scrolling="no" allowFullScreen
                    className="w-[340px] h-[min(620px,76svh)] rounded-md bg-blanco border-0" />
                ) : (
                  <img src={imagenReducida(foto.url, 1600)} alt={foto.descripcion || ''} draggable={false}
                    className="max-h-[78svh] w-auto rounded-md object-contain select-none" />
                )}
                {foto.descripcion && <figcaption className="text-blanco/85 text-sm mt-4 text-center">{foto.descripcion}</figcaption>}
                {foto.enlace && (
                  <a href={perfilInstagram} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                    className="mt-3 inline-flex items-center gap-2 text-blanco/80 hover:text-blanco text-xs tracking-[0.12em] uppercase">
                    <IconoInstagram size={14} /> Ver perfil
                  </a>
                )}
              </motion.figure>
            </AnimatePresence>

            {fotos.length > 1 && (
              <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-2 pointer-events-none">
                <p className="text-blanco/60 text-xs tracking-widest">{abierta + 1} / {fotos.length}</p>
                <p className="md:hidden text-blanco/40 text-[0.65rem]">Deslizá para ver más</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default Galeria
