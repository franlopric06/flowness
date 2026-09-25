import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import IconoInstagram from './IconoInstagram'
import { usePerfilInstagram } from '../hooks/usePerfilInstagram'
import { imagenReducida, urlEmbedInstagram } from '../utilidades/medios'

const botonOscuro = 'w-11 h-11 rounded-full bg-blanco/10 text-blanco hover:bg-blanco/20 flex items-center justify-center'

// Visor a pantalla completa para fotos y videos de la galería.
//   items: lista de fotos o de videos
//   indice: cuál está abierto (null = cerrado)
//   alCambiar: (nuevoIndice | null) => void
// Se pasa de uno a otro con las flechas, el teclado o deslizando con el dedo.
function VisorMedios({ items, indice, alCambiar, clase = 'foto' }) {
  const [direccion, setDireccion] = useState(0)
  const perfil = usePerfilInstagram()
  const item = indice !== null && indice !== undefined ? items[indice] : null

  const cerrar = useCallback(() => alCambiar(null), [alCambiar])
  const mover = useCallback((paso) => {
    setDireccion(paso)
    alCambiar((indice + paso + items.length) % items.length)
  }, [alCambiar, indice, items.length])

  // Teclado (flechas y Escape) y sin scroll de fondo mientras está abierto
  useEffect(() => {
    if (!item) return
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
  }, [item, cerrar, mover])

  const alSoltar = (_, info) => {
    if (info.offset.x < -60 || info.velocity.x < -400) mover(1)
    else if (info.offset.x > 60 || info.velocity.x > 400) mover(-1)
  }

  const esEmbed = item?.tipo === 'INSTAGRAM'
  const varios = items.length > 1

  return (
    <AnimatePresence>
      {item && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center" onClick={cerrar}>
          <button onClick={cerrar} aria-label="Cerrar" className={`absolute top-4 right-4 z-10 ${botonOscuro}`}><X size={22} /></button>
          {varios && (
            <>
              {/* En el celular las flechas se muestran cuando no se puede deslizar (recuadro de Instagram) */}
              <button onClick={(e) => { e.stopPropagation(); mover(-1) }} aria-label="Anterior"
                className={`${esEmbed ? 'flex bottom-3 md:bottom-auto' : 'hidden md:flex'} absolute left-4 md:left-6 z-10 ${botonOscuro}`}><ChevronLeft size={26} /></button>
              <button onClick={(e) => { e.stopPropagation(); mover(1) }} aria-label="Siguiente"
                className={`${esEmbed ? 'flex bottom-3 md:bottom-auto' : 'hidden md:flex'} absolute right-4 md:right-6 z-10 ${botonOscuro}`}><ChevronRight size={26} /></button>
            </>
          )}

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.figure key={item.id}
              initial={{ opacity: 0, x: direccion * 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direccion * -80 }}
              transition={{ duration: 0.25 }}
              drag={varios && !esEmbed ? 'x' : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.6} onDragEnd={alSoltar}
              className={`max-w-5xl w-full px-4 flex flex-col items-center touch-pan-y ${varios && !esEmbed ? 'cursor-grab active:cursor-grabbing' : ''}`}
              onClick={(e) => e.stopPropagation()}>
              {esEmbed ? (
                <iframe src={urlEmbedInstagram(item.url)} title={item.descripcion || 'Publicación de Instagram'} scrolling="no" allowFullScreen
                  className="w-[340px] max-w-[calc(100vw-1rem)] h-[min(640px,72svh)] rounded-md bg-blanco border-0" />
              ) : clase === 'video' ? (
                <video src={item.url} controls autoPlay playsInline controlsList="nodownload"
                  className="max-h-[78svh] w-auto max-w-full rounded-md bg-black" />
              ) : (
                <img src={imagenReducida(item.url, 1600)} alt={item.descripcion || ''} draggable={false}
                  className="max-h-[78svh] w-auto rounded-md object-contain select-none" />
              )}
              {item.descripcion && <figcaption className="text-blanco/85 text-sm mt-4 text-center">{item.descripcion}</figcaption>}
              {(item.enlace || esEmbed) && (
                <a href={perfil} target="_blank" rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-blanco/80 hover:text-blanco text-xs tracking-[0.12em] uppercase">
                  <IconoInstagram size={14} /> Ver perfil
                </a>
              )}
            </motion.figure>
          </AnimatePresence>

          {varios && (
            <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-2 pointer-events-none">
              <p className="text-blanco/60 text-xs tracking-widest">{indice + 1} / {items.length}</p>
              {!esEmbed && <p className="md:hidden text-blanco/40 text-[0.65rem]">Deslizá para ver más</p>}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default VisorMedios
