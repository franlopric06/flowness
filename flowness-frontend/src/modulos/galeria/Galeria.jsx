import { useState, useEffect, useCallback } from 'react'
import { useVibrar } from '../../compartido/hooks/useVibrar'
import Reel from '../../compartido/componentes/Reel'
import { imagenReducida } from '../../compartido/utilidades/medios'
import { obtenerGaleria } from './galeria.servicio'

// Galería pública: fotos (con visor a pantalla completa) y videos cortos
function Galeria() {
  const [fotos, setFotos] = useState([])
  const [reels, setReels] = useState([])
  const [pestana, setPestana] = useState('fotos')
  const [cargando, setCargando] = useState(true)
  const [abierta, setAbierta] = useState(null) // índice de la foto abierta en el visor
  const vibrar = useVibrar()

  useEffect(() => {
    obtenerGaleria()
      .then((datos) => {
        setFotos(datos.fotos)
        setReels(datos.reels)
        // Si no hay fotos pero sí videos, arranca en videos
        if (datos.fotos.length === 0 && datos.reels.length > 0) setPestana('videos')
      })
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [])

  const cerrar = useCallback(() => setAbierta(null), [])
  const mover = useCallback((paso) => setAbierta((i) => (i + paso + fotos.length) % fotos.length), [fotos.length])

  // Teclado en el visor: flechas y Escape
  useEffect(() => {
    if (abierta === null) return
    const alApretar = (e) => {
      if (e.key === 'Escape') cerrar()
      if (e.key === 'ArrowRight') mover(1)
      if (e.key === 'ArrowLeft') mover(-1)
    }
    window.addEventListener('keydown', alApretar)
    return () => window.removeEventListener('keydown', alApretar)
  }, [abierta, cerrar, mover])

  const botonPestana = (clave, texto, cantidad) => (
    <button onClick={() => { vibrar(); setPestana(clave) }}
      className={`text-xs tracking-widest uppercase px-6 py-2 rounded-full transition-colors ${
        pestana === clave ? 'bg-[#7B9B77] text-white' : 'border border-[#7B9B77] text-[#7B9B77] hover:bg-[#7B9B77]/10'
      }`}>
      {texto} {cantidad > 0 && <span className="opacity-70">· {cantidad}</span>}
    </button>
  )

  return (
    <main className="pt-32 min-h-screen px-4 md:px-16 pb-16">
      <p className="text-[#D8A48F] text-xs tracking-widest uppercase text-center mb-2">Momentos</p>
      <h1 className="text-[#7B9B77] text-3xl md:text-4xl font-bold text-center tracking-widest mb-8">Galería</h1>

      <div className="flex justify-center gap-3 mb-10">
        {botonPestana('fotos', 'Fotos', fotos.length)}
        {botonPestana('videos', 'Videos', reels.length)}
      </div>

      {cargando ? (
        <p className="text-center text-[#A9A9A2]">Cargando…</p>
      ) : pestana === 'fotos' ? (
        fotos.length === 0 ? (
          <p className="text-center text-[#A9A9A2]">Muy pronto vas a encontrar fotos acá.</p>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 max-w-6xl mx-auto">
            {fotos.map((foto, i) => (
              <button key={foto.id} onClick={() => { vibrar(); setAbierta(i) }}
                className="block w-full mb-3 overflow-hidden rounded-xl break-inside-avoid group">
                <img src={imagenReducida(foto.url, 600)} alt={foto.descripcion || 'Foto de Flowness'} loading="lazy"
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105" />
              </button>
            ))}
          </div>
        )
      ) : reels.length === 0 ? (
        <p className="text-center text-[#A9A9A2]">Muy pronto vas a encontrar videos acá.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reels.map((reel) => (
            <div key={reel.id}>
              <Reel reel={reel} titulo={reel.descripcion || 'Video de Flowness'} />
              {reel.descripcion && <p className="text-[#A9A9A2] text-xs text-center mt-2">{reel.descripcion}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Visor de fotos */}
      {abierta !== null && fotos[abierta] && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={cerrar}>
          <button onClick={cerrar} aria-label="Cerrar" className="absolute top-4 right-5 text-white text-4xl leading-none opacity-80 hover:opacity-100">×</button>
          {fotos.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); vibrar(); mover(-1) }} aria-label="Anterior"
                className="absolute left-2 md:left-6 text-white text-4xl px-3 py-6 opacity-70 hover:opacity-100">‹</button>
              <button onClick={(e) => { e.stopPropagation(); vibrar(); mover(1) }} aria-label="Siguiente"
                className="absolute right-2 md:right-6 text-white text-4xl px-3 py-6 opacity-70 hover:opacity-100">›</button>
            </>
          )}
          <figure className="max-w-5xl max-h-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img src={imagenReducida(fotos[abierta].url, 1600)} alt={fotos[abierta].descripcion || ''}
              className="max-h-[80vh] w-auto rounded-lg object-contain" />
            {fotos[abierta].descripcion && (
              <figcaption className="text-white/80 text-sm mt-3 text-center">{fotos[abierta].descripcion}</figcaption>
            )}
            <p className="text-white/50 text-xs mt-2">{abierta + 1} / {fotos.length}</p>
          </figure>
        </div>
      )}
    </main>
  )
}

export default Galeria
