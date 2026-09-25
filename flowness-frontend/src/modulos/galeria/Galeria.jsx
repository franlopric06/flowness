import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ChevronsRight, X, Images, Film, Camera } from 'lucide-react'
import Reel from '../../compartido/componentes/Reel'
import Carrusel from '../../compartido/componentes/Carrusel'
import CabeceraPagina from '../../compartido/componentes/CabeceraPagina'
import EstadoVacio from '../../compartido/componentes/EstadoVacio'
import { fadeUpScroll, fadeUpScrollDelay, listItem } from '../../compartido/utilidades/animaciones'
import { imagenReducida } from '../../compartido/utilidades/medios'
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
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3" role="status" aria-label="Cargando">
            {[220, 300, 180, 260, 200, 320, 240, 190].map((alto, i) => (
              <div key={i} className="esqueleto mb-3 rounded-xl" style={{ height: alto }} />
            ))}
          </div>
        ) : fotos.length === 0 && reels.length === 0 ? (
          <EstadoVacio icono={Camera} titulo="Muy pronto" texto="Muy pronto vas a encontrar fotos y videos acá." />
        ) : (
          <>
            {fotos.length > 0 && (
              <section className="mb-20">
                <TituloBloque icono={Images} texto="Fotos" />
                {/* Celular: dos filas que se deslizan de costado · Computadora: mosaico */}
                <Carrusel puntos={false}
                  claseCelular={`grid ${fotos.length > 4 ? 'grid-rows-2' : 'grid-rows-1'} grid-flow-col auto-cols-[42vw] gap-2`}
                  claseEscritorio="md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:block md:columns-3 lg:columns-4 md:gap-4">
                  {fotos.map((f, i) => (
                    <motion.button key={f.id} {...listItem(i)} onClick={() => { setDireccion(0); setAbierta(i) }}
                      className="relative block w-full md:mb-4 overflow-hidden rounded-xl md:rounded-2xl break-inside-avoid group">
                      <img src={imagenReducida(f.url, 600)} alt={f.descripcion || 'Foto de Flowness'} loading="lazy"
                        className="w-full aspect-square md:aspect-auto object-cover md:h-auto transition-transform duration-700 group-hover:scale-105" />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </Carrusel>
                {fotos.length > 4 && (
                  <p className="md:hidden flex items-center justify-center gap-1 text-piedra text-xs mt-3">
                    Deslizá para ver más <ChevronsRight size={14} className="animate-pulse" />
                  </p>
                )}
              </section>
            )}

            {reels.length > 0 && (
              <section className={fotos.length > 0 ? 'pt-16 border-t border-terracota/20' : ''}>
                <TituloBloque icono={Film} texto="Videos" />
                <Carrusel claseEscritorio="items-start md:mx-0 md:px-0 md:overflow-visible md:flex-wrap md:justify-center md:gap-6">
                  {reels.map((reel, i) => (
                    <motion.div key={reel.id} {...fadeUpScrollDelay((i % 3) * 0.1)} className="reel-marco">
                      <Reel reel={reel} titulo={reel.descripcion || 'Video de Flowness'} />
                      {reel.descripcion && <p className="text-texto/70 text-xs text-center mt-3">{reel.descripcion}</p>}
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
                <img src={imagenReducida(foto.url, 1600)} alt={foto.descripcion || ''} draggable={false}
                  className="max-h-[78svh] w-auto rounded-xl object-contain select-none" />
                {foto.descripcion && <figcaption className="text-blanco/85 text-sm mt-4 text-center">{foto.descripcion}</figcaption>}
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
